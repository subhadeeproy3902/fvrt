"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ImageThumbnailProps {
  file: File;
  className?: string;
}

export function ImageThumbnail({ file, className = '' }: ImageThumbnailProps) {
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative rounded-lg overflow-hidden ${className}`}
    >
      <img
        src={preview}
        alt={file.name}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}

export default ImageThumbnail;