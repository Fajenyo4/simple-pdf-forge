
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProcessingProgressProps {
  status: 'idle' | 'processing' | 'success' | 'error';
  progress: number;
  message?: string;
}

const ProcessingProgress: React.FC<ProcessingProgressProps> = ({
  status,
  progress,
  message
}) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'idle':
        return 'Ready to process';
      case 'processing':
        return message || 'Processing your files...';
      case 'success':
        return 'Processing completed!';
      case 'error':
        return message || 'An error occurred';
      default:
        return '';
    }
  };

  if (status === 'idle') return null;

  return (
    <div className="mt-6 p-4 border rounded-lg bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-700">{getStatusMessage()}</span>
        <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
      </div>
      <Progress 
        value={progress}
        className={`h-2 ${
          status === 'error' ? 'bg-destructive/20' : 
          status === 'success' ? 'bg-green-100' : 
          'bg-blue-100'
        }`}
      />
    </div>
  );
};

export default ProcessingProgress;
