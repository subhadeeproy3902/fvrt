"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Download, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FormatSelect } from "@/components/ui/format-select";
import { Alert } from "@/components/ui/alert";
import { ImageThumbnail } from "./ImageThumbnail";
import { FileType } from "@/lib/types";
import { convertFile, downloadAsZip } from "@/lib/conversion";
import {
  getAllowedFileTypes,
  getFileExtension,
  getConvertibleFormats,
  formatFileSize,
} from "@/lib/utils";
import { MAX_FILES, MAX_FILE_SIZE } from "@/lib/constants";

// Context
const ConversionContext = createContext<{
  files: FileType[];
  isConverting: boolean;
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  updateFileFormat: (id: string, format: string) => void;
  convertFiles: () => Promise<void>;
  downloadAll: () => Promise<void>;
  clearFiles: () => void;
} | null>(null);

function ConversionProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [
      ...prev,
      ...newFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
        status: "waiting",
        convertTo: "",
      })) as FileType[],
    ]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const updateFileFormat = useCallback((id: string, format: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, convertTo: format } : f))
    );
  }, []);

  const convertFiles = async () => {
    setIsConverting(true);
    const updatedFiles = [...files];

    try {
      await Promise.all(
        updatedFiles
          .filter((f) => f.status === "waiting" && f.convertTo)
          .map(async (file) => {
            try {
              file.status = "converting";
              file.progress = 0;
              setFiles([...updatedFiles]);

              const convertedBlob = await convertFile(
                file.file,
                file.convertTo,
                (progress) => {
                  file.progress = progress;
                  setFiles([...updatedFiles]);
                }
              );

              file.downloadUrl = URL.createObjectURL(convertedBlob);
              file.status = "finished";
              file.progress = 100;
            } catch (error) {
              file.status = "error";
              file.error =
                error instanceof Error ? error.message : "Conversion failed";
            }
            setFiles([...updatedFiles]);
          })
      );
    } finally {
      setIsConverting(false);
    }
  };

  const downloadAll = async () => {
    try {
      await downloadAsZip(files);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const clearFiles = () => setFiles([]);

  return (
    <ConversionContext.Provider
      value={{
        files,
        isConverting,
        addFiles,
        removeFile,
        updateFileFormat,
        convertFiles,
        downloadAll,
        clearFiles,
      }}
    >
      {children}
    </ConversionContext.Provider>
  );
}

const useConversion = () => {
  const context = useContext(ConversionContext);
  if (!context) {
    throw new Error("useConversion must be used within ConversionProvider");
  }
  return context;
};

// Components
function UploadZone() {
  const { files, addFiles } = useConversion();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length >= MAX_FILES) return;
      const newFiles = acceptedFiles.slice(0, MAX_FILES - files.length);
      addFiles(newFiles);
    },
    [files.length, addFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES - files.length,
    accept: getAllowedFileTypes(),
  });

  if (files.length >= MAX_FILES) {
    return (
      <Alert
        variant="destructive"
        className="bg-red-100 text-red-900 font-medium border-red-300"
      >
        <div className="flex flex-row gap-2 items-center">
          <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2" />
          Maximum file limit reached ({MAX_FILES} files)
        </div>
      </Alert>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors max-w-3xl w-full mx-auto
        ${
          isDragActive
            ? "border-orange-500 bg-orange-50"
            : "border-gray-300 hover:border-orange-500"
        }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-gray-600">Drop images here or click to select</p>
      <p className="mt-1 text-sm text-gray-500">
        Up to {MAX_FILES} files, max{" "}
        {(MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)}MB each
      </p>
      <Button variant="default" className="mt-4">
        Choose Files
      </Button>
    </div>
  );
}

function FileList() {
  const { files, isConverting, removeFile, updateFileFormat } = useConversion();

  return (
    <AnimatePresence>
      {files.map((fileItem) => {
        const extension = getFileExtension(fileItem.file.name);
        const convertibleFormats = getConvertibleFormats(extension);

        return (
          <motion.div
            key={fileItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4"
          >
            <ImageThumbnail file={fileItem.file} className="w-12 h-12" />

            <div className="flex-1">
              <p className="font-medium text-gray-900">{fileItem.file.name}</p>
              <p className="text-sm text-gray-500">
                {formatFileSize(fileItem.file.size)}
              </p>
            </div>

            <FormatSelect
              formats={convertibleFormats}
              value={fileItem.convertTo}
              onChange={(value) => updateFileFormat(fileItem.id, value)}
              disabled={fileItem.status !== "waiting" || isConverting}
            />

            {fileItem.status === "converting" && (
              <div className="flex items-center gap-2 min-w-[200px]">
                <Progress value={fileItem.progress} className="flex-1" />
                <span className="text-yellow-500 font-medium">
                  Converting...
                </span>
              </div>
            )}

            {fileItem.status === "error" && (
              <div className="text-red-500 text-sm">
                {fileItem.error || "Conversion failed"}
              </div>
            )}

            {fileItem.status === "finished" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = fileItem.downloadUrl!;
                  link.download = `${fileItem.file.name.split(".")[0]}.${
                    fileItem.convertTo
                  }`;
                  link.click();
                }}
                className="text-green-500 border-green-500 hover:bg-green-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFile(fileItem.id)}
              disabled={isConverting}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}

function ActionButtons() {
  const { files, isConverting, convertFiles, downloadAll, clearFiles } =
    useConversion();
  const allFinished =
    files.length > 0 && files.every((f) => f.status === "finished");
  const hasWaiting = files.some((f) => f.status === "waiting" && f.convertTo);

  if (files.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-end gap-4"
    >
      <Button variant="outline" onClick={clearFiles} disabled={isConverting}>
        Clear All
      </Button>

      {allFinished && (
        <Button
          variant="outline"
          onClick={downloadAll}
          className="text-green-500 border-green-500 hover:bg-green-50"
        >
          Download All (ZIP)
        </Button>
      )}

      <Button
        onClick={convertFiles}
        disabled={isConverting || !hasWaiting}
        className="bg-orange-500 hover:bg-orange-600 text-white"
      >
        {isConverting ? "Converting..." : "Convert Files"}
      </Button>
    </motion.div>
  );
}

export default function FileConverter() {
  return (
    <ConversionProvider>
      <div className="space-y-6">
        <UploadZone />
        <FileList />
        <ActionButtons />
      </div>
    </ConversionProvider>
  );
}
