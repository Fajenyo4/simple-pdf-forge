
import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileDropZone from '@/components/FileDropZone';
import FilesList from '@/components/FilesList';
import ProcessingProgress from '@/components/ProcessingProgress';
import { Button } from '@/components/ui/button';
import { PdfService } from '@/utils/pdfService';

const MergePDF = () => {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  
  const handleFilesDrop = useCallback((files: File[]) => {
    setPdfFiles(prevFiles => [...prevFiles, ...files]);
    toast.success(`${files.length} file${files.length > 1 ? 's' : ''} added`);
  }, []);
  
  const handleRemoveFile = useCallback((fileToRemove: File) => {
    setPdfFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
    toast.info('File removed');
  }, []);
  
  const simulateProgress = useCallback(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleProcessFiles = async () => {
    if (pdfFiles.length < 2) {
      toast.error('Please add at least 2 PDF files to merge');
      return;
    }
    
    setStatus('processing');
    setProgress(0);
    
    const stopProgressSimulation = simulateProgress();
    
    try {
      // Process the PDF files
      const mergedPdfBytes = await PdfService.mergePdfs(pdfFiles);
      
      // Stop progress simulation
      stopProgressSimulation();
      setProgress(100);
      
      // Create a download link
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged-document.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setStatus('success');
      toast.success('PDF files successfully merged!');
    } catch (error) {
      console.error('Error merging PDFs:', error);
      stopProgressSimulation();
      setStatus('error');
      toast.error('Failed to merge PDF files. Please try again.');
    }
  };
  
  const handleReset = () => {
    setPdfFiles([]);
    setStatus('idle');
    setProgress(0);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4 bg-gray-50">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Merge PDF Files</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Combine multiple PDF files into a single document. Arrange the files in the desired order before merging.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Upload Area */}
            <FileDropZone 
              onFilesDrop={handleFilesDrop} 
              accept=".pdf"
              multiple={true}
              maxFiles={20}
              className="mb-6"
            />
            
            {/* Files List */}
            {pdfFiles.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Files to Merge ({pdfFiles.length})</h3>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    Clear All
                  </Button>
                </div>
                <FilesList 
                  files={pdfFiles} 
                  onRemove={handleRemoveFile}
                  showPreview={true}
                />
              </div>
            )}
            
            {/* Progress */}
            <ProcessingProgress 
              status={status} 
              progress={progress} 
              message={status === 'processing' ? 'Merging your PDF files...' : undefined}
            />
            
            {/* Action Buttons */}
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleProcessFiles}
                disabled={pdfFiles.length < 2 || status === 'processing'}
                className="px-8"
              >
                {status === 'success' ? 'Merge Again' : 'Merge Files'}
              </Button>
            </div>
          </div>
          
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h3 className="font-semibold text-pdf-blue mb-2">How to Merge PDF Files</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
              <li>Upload two or more PDF files that you want to combine.</li>
              <li>Arrange them in the desired order (first file on top will be the first in the merged PDF).</li>
              <li>Click the "Merge Files" button to combine them into one PDF document.</li>
              <li>Download your merged PDF when processing is complete.</li>
            </ol>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MergePDF;
