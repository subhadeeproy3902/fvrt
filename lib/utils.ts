import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { IMAGE_FORMATS, MIME_TYPES } from './constants';
import { MimeTypes } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
}

export function isImageFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  return IMAGE_FORMATS.extensions.includes(extension);
}

export function getConvertibleFormats(currentFormat: string): string[] {
  if (!IMAGE_FORMATS.extensions.includes(currentFormat)) return [];
  return IMAGE_FORMATS.convertibleTo.filter(format => format !== currentFormat);
}

export function getAllowedFileTypes(): { [key: string]: string[] } {
  const mimeTypes: { [key: string]: string[] } = {};
  IMAGE_FORMATS.extensions.forEach(ext => {
    const mimeType = MIME_TYPES[ext as keyof MimeTypes];
    if (mimeType) {
      mimeTypes[`.${ext}`] = [mimeType];
    }
  });
  return mimeTypes;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}