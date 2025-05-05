
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileDropZone from '@/components/FileDropZone';
import FilesList from '@/components/FilesList';
import ProcessingProgress from '@/components/ProcessingProgress';
import { Button } from '@/components/ui/button';
import { PdfService } from '@/utils/pdfService';
import { toast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const CompressPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');

  const handleFileUpload = (uploadedFiles: File[]) => {
    // Only allow single file for compressing
    const pdfFile = uploadedFiles[0];
    setFiles([pdfFile]);
  };

  const handleRemoveFile = (file: File) => {
    setFiles(files.filter(f => f !== file));
  };

  const handleCompress = async () => {
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please upload a PDF file to compress.",
        variant: "destructive"
      });
      return;
    }

    setStatus('processing');
    setProgress(10);

    try {
      // Process the PDF
      setProgress(30);
      const compressedPdf = await PdfService.compressPdf(files[0], quality);
      setProgress(70);
      
      // Save the result
      const outputFileName = `${files[0].name.replace('.pdf', '')}_compressed.pdf`;
      await PdfService.savePdfAsBlob(compressedPdf, outputFileName);
      
      setProgress(100);
      setStatus('success');
      toast({
        title: "Success",
        description: "PDF compressed successfully!",
      });
    } catch (error) {
      console.error('Error compressing PDF:', error);
      setStatus('error');
      toast({
        title: "Error",
        description: "Failed to compress PDF.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-8 mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">Compress PDF</h1>
          <p className="text-center text-gray-600 mb-8">Reduce PDF file size while maintaining quality</p>

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
                <h2 className="font-medium mb-4">Compression Quality</h2>
                <RadioGroup 
                  value={quality} 
                  onValueChange={(value) => setQuality(value as 'low' | 'medium' | 'high')}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low Quality (smaller file size)</Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium Quality (recommended)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High Quality (larger file size)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="mt-6">
                <Button 
                  onClick={handleCompress}
                  className="w-full"
                  disabled={status === 'processing'}
                >
                  Compress PDF
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

export default CompressPDF;
