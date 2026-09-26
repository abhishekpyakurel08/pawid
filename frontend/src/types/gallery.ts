export interface GalleryPhoto {
  id: string;
  title: string;
  caption?: string;
  imageUrl: string;
  area: string;
  pawId?: string;
  submittedBy?: string;
  isApproved?: boolean;
  tags?: string[];
  createdAt: string;
}

export interface SubmitPhotoPayload {
  title: string;
  caption?: string;
  imageUrl: string;
  area: string;
  pawId?: string;
  submittedBy?: string;
  tags?: string[];
}
