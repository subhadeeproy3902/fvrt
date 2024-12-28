"use client";

import { motion } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FormatSelect } from '@/components/ui/format-select';
import { formatFileSize, getFileExtension, getConvertibleFormats } from '@/lib/utils';
import { FileType } from '@/lib/types';

interface FileListProps {
  files: FileType[];
  setFiles: (files: FileType[]) => void;
  isConverting: boolean;
}

export default function FileList({ files, setFiles, isConverting }: FileListProps) {
  return (
    <div className="space-y-4">
      {files.map((fileItem) => {
        const extension = getFileExtension(fileItem.file.name);
        const convertibleFormats = getConvertibleFormats(extension);

        return (
          <motion.div
            key={fileItem.id}
            layout
            className="bg-gray-900 rounded-lg p-4 shadow-sm flex items-center gap-4"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-200">{fileItem.file.name}</p>
              <p className="text-sm text-gray-400">
                {formatFileSize(fileItem.file.size)}
              </p>
            </div>

            <FormatSelect
              formats={convertibleFormats}
              value={fileItem.convertTo}
              onChange={(value) =>
                setFiles(
                  files.map(f =>
                    f.id === fileItem.id ? { ...f, convertTo: value } : f
                  )
                )
              }
              disabled={fileItem.status !== 'waiting' || isConverting}
              currentFormat={extension}
            />

            {fileItem.status === 'converting' && (
              <div className="flex items-center gap-2 min-w-[150px]">
                <Progress value={fileItem.progress} className="flex-1" />
                <span className="text-yellow-500 text-sm font-medium">
                  Converting
                </span>
              </div>
            )}

            {fileItem.status === 'finished' && (
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-sm font-medium">
                  Finished
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = fileItem.downloadUrl!;
                    link.download = `${fileItem.file.name.split('.')[0]}.${fileItem.convertTo}`;
                    link.click();
                  }}
                  className="text-green-500 border-green-500 hover:bg-green-900"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFiles(files.filter(f => f.id !== fileItem.id))}
              disabled={isConverting}
              className="text-gray-400 hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}