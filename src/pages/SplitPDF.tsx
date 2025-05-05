
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileDropZone from '@/components/FileDropZone';
import FilesList from '@/components/FilesList';
import ProcessingProgress from '@/components/ProcessingProgress';
import { Button } from '@/components/ui/button';
import { PdfService } from '@/utils/pdfService';
import { toast } from '@/hooks/use-toast';
import usePdfJs from '@/hooks/usePdfJs';

const SplitPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [pageRange, setPageRange] = useState<{ start: number; end: number }>({ start: 1, end: 1 });
  const [totalPages, setTotalPages] = useState(1);
  const { isLoaded, getDocument } = usePdfJs();

  const handleFilesDrop = (uploadedFiles: File[]) => {
    // Only allow single file for splitting
    const pdfFile = uploadedFiles[0];
    setFiles([pdfFile]);
    
    // Get page count to update range
    if (isLoaded && pdfFile) {
      getPageCount(pdfFile);
    }
  };

  useEffect(() => {
    if (isLoaded && files.length > 0) {
      getPageCount(files[0]);
    }
  }, [isLoaded, files]);

  const getPageCount = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      if (!getDocument) {
        toast({
          title: "Error",
          description: "PDF.js library is not loaded yet. Please try again in a moment.",
          variant: "destructive"
        });
        return;
      }
      
      const pdfDoc = await getDocument({ data: arrayBuffer }).promise;
      const count = pdfDoc.numPages;
      setTotalPages(count);
      setPageRange({ start: 1, end: count });
    } catch (error) {
      console.error('Error getting page count:', error);
      toast({
        title: "Error",
        description: "Failed to read PDF file.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveFile = (file: File) => {
    setFiles(files.filter(f => f !== file));
    setTotalPages(1);
    setPageRange({ start: 1, end: 1 });
  };

  const handleSplit = async () => {
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please upload a PDF file to split.",
        variant: "destructive"
      });
      return;
    }

    setStatus('processing');
    setProgress(10);

    try {
      // Create a range for splitting
      const ranges = [{ start: pageRange.start, end: pageRange.end }];
      setProgress(30);
      
      // Process the PDF
      const splitResult = await PdfService.splitPdf(files[0], ranges);
      setProgress(70);
      
      // Save the result
      const outputFileName = `${files[0].name.replace('.pdf', '')}_split.pdf`;
      await PdfService.savePdfAsBlob(splitResult[0], outputFileName);
      
      setProgress(100);
      setStatus('success');
      toast({
        title: "Success",
        description: "PDF split successfully!",
      });
    } catch (error) {
      console.error('Error splitting PDF:', error);
      setStatus('error');
      toast({
        title: "Error",
        description: "Failed to split PDF.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-8 mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">Split PDF</h1>
          <p className="text-center text-gray-600 mb-8">Extract specific pages from your PDF file</p>

          {files.length === 0 ? (
            <FileDropZone 
              onFilesDrop={handleFilesDrop} 
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
                <h2 className="font-medium mb-4">Page Range</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Page</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={totalPages} 
                      value={pageRange.start}
                      onChange={(e) => setPageRange({ 
                        ...pageRange, 
                        start: Math.min(Math.max(1, parseInt(e.target.value) || 1), pageRange.end) 
                      })}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Page</label>
                    <input 
                      type="number" 
                      min={pageRange.start} 
                      max={totalPages} 
                      value={pageRange.end}
                      onChange={(e) => setPageRange({ 
                        ...pageRange, 
                        end: Math.min(Math.max(pageRange.start, parseInt(e.target.value) || 1), totalPages) 
                      })}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  PDF has {totalPages} page{totalPages !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  onClick={handleSplit}
                  className="w-full"
                  disabled={status === 'processing' || !isLoaded}
                >
                  {isLoaded ? "Split PDF" : "Loading PDF.js..."}
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

export default SplitPDF;
