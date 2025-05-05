
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileDropZone from '@/components/FileDropZone';
import FilesList from '@/components/FilesList';
import ProcessingProgress from '@/components/ProcessingProgress';
import { Button } from '@/components/ui/button';
import { PdfService } from '@/utils/pdfService';
import { toast } from '@/hooks/use-toast';

const RotatePDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [rotation, setRotation] = useState<number>(90);

  const handleFileUpload = (uploadedFiles: File[]) => {
    // Only allow single file for rotating
    const pdfFile = uploadedFiles[0];
    setFiles([pdfFile]);
  };

  const handleRemoveFile = (file: File) => {
    setFiles(files.filter(f => f !== file));
  };

  const handleRotate = async () => {
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please upload a PDF file to rotate.",
        variant: "destructive"
      });
      return;
    }

    setStatus('processing');
    setProgress(10);

    try {
      // Process the PDF
      setProgress(30);
      const rotatedPdf = await PdfService.rotatePdf(files[0], rotation);
      setProgress(70);
      
      // Save the result
      const outputFileName = `${files[0].name.replace('.pdf', '')}_rotated.pdf`;
      await PdfService.savePdfAsBlob(rotatedPdf, outputFileName);
      
      setProgress(100);
      setStatus('success');
      toast({
        title: "Success",
        description: "PDF rotated successfully!",
      });
    } catch (error) {
      console.error('Error rotating PDF:', error);
      setStatus('error');
      toast({
        title: "Error",
        description: "Failed to rotate PDF.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-8 mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">Rotate PDF</h1>
          <p className="text-center text-gray-600 mb-8">Change the orientation of PDF pages</p>

          {files.length === 0 ? (
            <FileDropZone 
              onFilesDrop={handleFileUpload} 
              accept=".pdf"
              multiple={false}
            />
          ) : (
            <>
              <FilesList 
                files={files} 
                onRemove={handleRemoveFile} 
              />
              
              <div className="mt-6 p-4 border rounded-lg bg-white">
                <h2 className="font-medium mb-4">Rotation Angle</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[90, 180, 270].map((angle) => (
                    <Button 
                      key={angle}
                      variant={rotation === angle ? "default" : "outline"}
                      onClick={() => setRotation(angle)}
                      className="flex flex-col items-center justify-center py-4 h-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${angle}deg)` }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                      <span className="mt-2">{angle}°</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  onClick={handleRotate}
                  className="w-full"
                  disabled={status === 'processing'}
                >
                  Rotate PDF
                </Button>
              </div>
            </>
          )}

          <ProcessingProgress 
            status={status} 
            progress={progress}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RotatePDF;
