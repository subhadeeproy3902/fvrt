export const IMAGE_FORMATS = {
  extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'svg'],
  convertibleTo: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'pdf'],
};

export const MIME_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
};

export const SUPPORTED_FEATURES = [
  {
    title: 'Multiple Images',
    description: 'Convert up to 10 images at once with real-time progress tracking',
    icon: 'Images',
  },
  {
    title: 'Smart Conversion',
    description: 'Intelligent format detection and optimized conversion',
    icon: 'Sparkles',
  },
  {
    title: 'Batch Download',
    description: 'Download all converted images in a single ZIP file with one click',
    icon: 'PackageSearch',
  },
  {
    title: 'High Speed',
    description: 'Fast and efficient image conversion with minimal delay',
    icon: 'BadgeCheck',
  },
];

export const MAX_FILES = 10;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ARTIFICIAL_DELAY = 3000; // 3 seconds delay for progress bar