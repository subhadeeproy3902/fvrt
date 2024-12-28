export interface FileType {
  id: string;
  file: File;
  progress: number;
  status: 'waiting' | 'converting' | 'finished' | 'error';
  convertTo: string;
  downloadUrl?: string;
  error?: string; // Add error message field
}

export type MimeTypes = {
  jpg: string;
  jpeg: string;
  png: string;
  webp: string;
  gif: string;
  bmp: string;
  tiff: string;
  svg: string;
  pdf: string;
};