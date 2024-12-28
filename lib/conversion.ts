import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import imageCompression from 'browser-image-compression';
import { FileType, MimeTypes } from './types';
import { MIME_TYPES } from './constants';

async function convertImage(file: File, targetFormat: string): Promise<Blob> {
  try {
    // Validate input file
    if (!file || !(file instanceof File)) {
      throw new Error('Invalid file input');
    }

    // Validate target format
    if (!targetFormat || !MIME_TYPES[targetFormat as keyof MimeTypes]) {
      throw new Error(`Unsupported target format: ${targetFormat}`);
    }

    // Handle PDF conversion
    if (targetFormat === 'pdf') {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const imageBytes = await file.arrayBuffer();
      
      let imageEmbed;
      try {
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          imageEmbed = await pdfDoc.embedJpg(imageBytes);
        } else {
          // Convert to PNG first for other formats
          const compressedImage = await imageCompression(file, {
            maxSizeMB: 2,
            maxWidthOrHeight: 2048,
            useWebWorker: true,
          });
          const pngBuffer = await compressedImage.arrayBuffer();
          imageEmbed = await pdfDoc.embedPng(pngBuffer);
        }
      } catch (error) {
        console.error('PDF embedding error:', error);
        throw new Error('Failed to embed image in PDF');
      }
      
      const { width, height } = imageEmbed.size();
      const pageWidth = page.getSize().width;
      const pageHeight = page.getSize().height;
      
      const scale = Math.min(
        pageWidth / width,
        pageHeight / height
      );
      
      page.drawImage(imageEmbed, {
        x: (pageWidth - width * scale) / 2,
        y: (pageHeight - height * scale) / 2,
        width: width * scale,
        height: height * scale,
      });
      
      const pdfBytes = await pdfDoc.save();
      return new Blob([pdfBytes], { type: MIME_TYPES.pdf });
    }

    // Handle image format conversions
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 2048,
      useWebWorker: true,
      fileType: MIME_TYPES[targetFormat as keyof MimeTypes],
      initialQuality: 1, // Start with highest quality
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return new Blob([await compressedFile.arrayBuffer()], { 
        type: MIME_TYPES[targetFormat as keyof MimeTypes] 
      });
    } catch (error) {
      console.error('Image compression error:', error);
      throw new Error('Failed to convert image format');
    }
  } catch (error) {
    console.error('Conversion error details:', error);
    throw error;
  }
}

export async function convertFile(
  file: File, 
  targetFormat: string, 
  onProgress?: (progress: number) => void
): Promise<Blob> {
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress = Math.min(progress + 10, 90);
    onProgress?.(progress);
  }, 200);

  try {
    const result = await convertImage(file, targetFormat);
    clearInterval(progressInterval);
    onProgress?.(100);
    return result;
  } catch (error) {
    clearInterval(progressInterval);
    onProgress?.(0);
    throw error;
  }
}

export async function downloadAsZip(files: FileType[]) {
  const zip = new JSZip();
  const finishedFiles = files.filter(f => f.status === 'finished' && f.downloadUrl);

  try {
    for (const file of finishedFiles) {
      const response = await fetch(file.downloadUrl!);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${file.file.name}`);
      }
      const blob = await response.blob();
      const fileName = `${file.file.name.split('.')[0]}.${file.convertTo}`;
      zip.file(fileName, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'converted-files.zip');
  } catch (error) {
    console.error('ZIP creation error:', error);
    throw new Error('Failed to create ZIP file');
  }
}