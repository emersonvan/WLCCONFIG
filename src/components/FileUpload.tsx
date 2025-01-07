import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileType, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  error?: string;
}

const FileUpload = ({
  onFileSelect = () => {},
  acceptedFileTypes = [".cfg", ".txt"],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  error = "",
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [localError, setLocalError] = React.useState("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): string | null => {
    if (!file) return "Please select a file.";

    if (
      !acceptedFileTypes.some((type) =>
        file.name.toLowerCase().endsWith(type.toLowerCase()),
      )
    ) {
      return "Invalid file type. Please upload .cfg or .txt files only.";
    }
    return null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setLocalError("");

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setLocalError(validationError);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setLocalError(validationError);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  return (
    <Card className="w-[600px] h-[300px] bg-white p-6 flex flex-col items-center justify-center">
      <div
        className={`w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload
          className={`w-12 h-12 mb-4 ${isDragging ? "text-blue-500" : "text-gray-400"}`}
        />
        <h3 className="text-lg font-medium mb-2">
          {selectedFile ? selectedFile.name : "Drag and drop your file here"}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          or click to browse (.cfg or .txt files)
        </p>
        <input
          type="file"
          className="hidden"
          accept={acceptedFileTypes.join(",")}
          onChange={handleFileInput}
          id="file-upload"
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <FileType className="w-4 h-4 mr-2" />
          Select File
        </Button>
      </div>

      {(error || localError) && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || localError}</AlertDescription>
        </Alert>
      )}
    </Card>
  );
};

export default FileUpload;
