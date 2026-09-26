import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';
import { AppError } from '../middleware/error.middleware';

// Configure Cloudinary if credentials present
if (
  env.CLOUDINARY_CLOUD_NAME &&
  env.CLOUDINARY_API_KEY &&
  env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export class UploadService {
  private static uploadsDir = path.join(process.cwd(), 'uploads');

  public static ensureUploadsDirExists() {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Cybersecurity Check: Verify magic bytes (file signature) to prevent disguised executable uploads.
   */
  private static verifyMagicBytes(buffer: Buffer): 'jpeg' | 'png' | 'webp' | null {
    if (!buffer || buffer.length < 12) return null;

    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return 'jpeg';
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return 'png';
    }

    // WebP: RIFF ... WEBP
    const isRiff =
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46;
    const isWebp =
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50;

    if (isRiff && isWebp) {
      return 'webp';
    }

    return null;
  }

  public static async processUploadedFile(file?: Express.Multer.File) {
    if (!file) {
      throw new AppError('No image file provided', 400, 'FILE_MISSING');
    }

    // 1. Check max size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new AppError('File size exceeds 5MB limit', 400, 'FILE_TOO_LARGE');
    }

    const fileBuffer = file.buffer || (file.path ? fs.readFileSync(file.path) : null);
    if (!fileBuffer) {
      throw new AppError('Unable to read uploaded file buffer', 400, 'FILE_READ_ERROR');
    }

    // 2. Cybersecurity: Magic bytes verification
    const detectedFormat = this.verifyMagicBytes(fileBuffer);
    if (!detectedFormat) {
      throw new AppError(
        'Security rejection: File header magic bytes invalid or untrusted. Only genuine JPEG, PNG, and WebP images are permitted.',
        400,
        'MALICIOUS_FILE_DETECTED'
      );
    }

    // 3. Cybersecurity & Optimization: Process and compress image using Sharp
    // - Strips EXIF camera metadata (GPS/location privacy protection)
    // - Auto-orients image
    // - Compresses into web-optimized WebP
    const processedImageBuffer = await sharp(fileBuffer)
      .rotate() // Auto-orient based on EXIF before stripping
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    const randomFilename = `${crypto.randomBytes(16).toString('hex')}.webp`;
    const publicId = randomFilename.split('.')[0];

    // 4. Cloudinary Integration or Secure Local Storage Fallback
    if (
      env.CLOUDINARY_CLOUD_NAME &&
      env.CLOUDINARY_API_KEY &&
      env.CLOUDINARY_API_SECRET
    ) {
      try {
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'pawid_dogs',
              public_id: publicId,
              resource_type: 'image',
              format: 'webp',
            },
            (error: any, result: any) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(processedImageBuffer);
        });

        return {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          filename: randomFilename,
          mimetype: 'image/webp',
          size: processedImageBuffer.length,
          provider: 'cloudinary',
        };
      } catch (err: any) {
        console.error('Cloudinary upload failed, falling back to local storage:', err);
      }
    }

    // Secure Local Storage Fallback
    this.ensureUploadsDirExists();
    const targetPath = path.join(this.uploadsDir, randomFilename);
    fs.writeFileSync(targetPath, processedImageBuffer);

    return {
      url: `/uploads/${randomFilename}`,
      publicId,
      filename: randomFilename,
      mimetype: 'image/webp',
      size: processedImageBuffer.length,
      provider: 'local',
    };
  }
}
