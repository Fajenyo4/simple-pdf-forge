
import React from 'react';
import { Button } from '@/components/ui/button';

export interface FileItemProps {
  file: File;
  onRemove: (file: File) => void;
  onPreview?: (file: File) => void;
  showPreview?: boolean;
}

export const FileItem: React.FC<FileItemProps> = ({ 
  file, 
  onRemove, 
  onPreview,
  showPreview = true
}) => {
  // Format file size
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) {
      return sizeInBytes + ' bytes';
    } else if (sizeInBytes < 1024 * 1024) {
      return (sizeInBytes / 1024).toFixed(1) + ' KB';
    } else {
      return (sizeInBytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
      <div className="flex items-center gap-3 flex-grow">
        <div className="w-10 h-12 bg-pdf-red rounded text-white flex items-center justify-center">
          <span className="font-semibold">PDF</span>
        </div>
        <div className="flex-grow min-w-0">
          <p className="font-medium text-gray-800 truncate">{file.name}</p>
          <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showPreview && onPreview && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onPreview(file)}
            className="text-gray-600 hover:text-pdf-blue"
          >
            Preview
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onRemove(file)}
          className="text-gray-600 hover:text-destructive"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

interface FilesListProps {
  files: File[];
  onRemove: (file: File) => void;
  onPreview?: (file: File) => void;
  showPreview?: boolean;
}

const FilesList: React.FC<FilesListProps> = ({ 
  files, 
  onRemove, 
  onPreview,
  showPreview = true 
}) => {
  if (!files.length) return null;

  return (
    <div className="space-y-3 mt-4">
      {files.map((file, index) => (
        <FileItem 
          key={`${file.name}-${index}`} 
          file={file} 
          onRemove={onRemove} 
          onPreview={onPreview}
          showPreview={showPreview}
        />
      ))}
    </div>
  );
};

export default FilesList;
