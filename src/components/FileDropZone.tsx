
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface FileDropZoneProps {
  onFilesDrop: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesDrop,
  accept = ".pdf",
  multiple = true,
  maxFiles = 10,
  maxSize = 50, // default 50MB
  className = "",
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    
    // Filter by accepted file types
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const validFiles = fileArray.filter(file => {
      const fileExtension = '.' + file.name.split('.').pop();
      return acceptedTypes.some(type => 
        type === fileExtension || 
        type === file.type || 
        (type === '.pdf' && file.type === 'application/pdf')
      );
    });
    
    // Check if any invalid files were filtered out
    if (validFiles.length < fileArray.length) {
      toast.error(`Some files were rejected. Please upload only ${accept} files.`);
    }
    
    // Check max files constraint
    if (multiple && validFiles.length > maxFiles) {
      toast.error(`Please upload a maximum of ${maxFiles} files at once.`);
      return;
    }
    
    // Check file size constraints
    const oversizedFiles = validFiles.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`Some files exceed the maximum size of ${maxSize}MB`);
      return;
    }
    
    // If single file mode, but multiple files provided
    if (!multiple && validFiles.length > 1) {
      toast.error('Please upload only one file');
      return;
    }
    
    // If everything is valid, call the callback
    onFilesDrop(validFiles);
  }, [accept, maxFiles, maxSize, multiple, onFilesDrop]);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    processFiles(e.dataTransfer.files);
  }, [processFiles]);
  
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  }, [processFiles]);
  
  return (
    <div 
      className={`file-drop-area ${isDragActive ? 'drag-active' : ''} ${className}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        id="file-input"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        onChange={handleFileInput}
        accept={accept}
        multiple={multiple}
      />
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M12 12v6" />
            <path d="m15 15-3-3-3 3" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-1">Drop your PDF files here</h3>
        <p className="text-gray-500 mb-4 text-sm">or click to browse files</p>
        <Button type="button" variant="outline" size="sm">
          Choose Files
        </Button>
        <div className="mt-2 text-xs text-gray-400">
          Max. {maxSize}MB {multiple ? `(up to ${maxFiles} files)` : "(1 file)"}
        </div>
      </div>
    </div>
  );
};

export default FileDropZone;
