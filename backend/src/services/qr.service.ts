import QRCode from 'qrcode';
import { env } from '../config/env';

export class QrService {
  /**
   * Generates public URL for QR scan.
   */
  public static getPublicUrl(qrToken: string): string {
    return `${env.PUBLIC_APP_URL}/d/${qrToken}`;
  }

  /**
   * Generates base64 Data URL representation of QR code image.
   */
  public static async generateQrDataUrl(qrToken: string): Promise<string> {
    const publicUrl = this.getPublicUrl(qrToken);
    return QRCode.toDataURL(publicUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      width: 300,
      color: {
        dark: '#1E293B',
        light: '#FFFFFF',
      },
    });
  }

  /**
   * Generates SVG string representation of QR code.
   */
  public static async generateQrSvg(qrToken: string): Promise<string> {
    const publicUrl = this.getPublicUrl(qrToken);
    return QRCode.toString(publicUrl, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin: 2,
    });
  }
}
