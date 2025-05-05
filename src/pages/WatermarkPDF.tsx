
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileDropZone from '@/components/FileDropZone';
import FilesList from '@/components/FilesList';
import ProcessingProgress from '@/components/ProcessingProgress';
import { Button } from '@/components/ui/button';
import { PdfService } from '@/utils/pdfService';
import { toast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const WatermarkPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.3);

  const handleFileUpload = (uploadedFiles: File[]) => {
    // Only allow single file for watermarking
    const pdfFile = uploadedFiles[0];
    setFiles([pdfFile]);
  };

  const handleRemoveFile = (file: File) => {
    setFiles(files.filter(f => f !== file));
  };

  const handleAddWatermark = async () => {
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please upload a PDF file to watermark.",
        variant: "destructive"
      });
      return;
    }

    if (!watermarkText.trim()) {
      toast({
        title: "Empty watermark",
        description: "Please enter watermark text.",
        variant: "destructive"
      });
      return;
    }

    setStatus('processing');
    setProgress(10);

    try {
      // Process the PDF
      setProgress(30);
      const watermarkedPdf = await PdfService.addWatermark(files[0], watermarkText, opacity);
      setProgress(70);
      
      // Save the result
      const outputFileName = `${files[0].name.replace('.pdf', '')}_watermarked.pdf`;
      await PdfService.savePdfAsBlob(watermarkedPdf, outputFileName);
      
      setProgress(100);
      setStatus('success');
      toast({
        title: "Success",
        description: "Watermark added successfully!",
      });
    } catch (error) {
      console.error('Error adding watermark:', error);
      setStatus('error');
      toast({
        title: "Error",
        description: "Failed to add watermark.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-8 mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">Add Watermark</h1>
          <p className="text-center text-gray-600 mb-8">Add text watermarks to your PDF file</p>

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
                <div className="mb-4">
                  <Label htmlFor="watermarkText" className="block font-medium mb-2">Watermark Text</Label>
                  <Input
                    id="watermarkText"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Enter watermark text"
                  />
                </div>
                
                <div>
                  <Label htmlFor="opacity" className="block font-medium mb-2">
                    Opacity: {Math.round(opacity * 100)}%
                  </Label>
                  <Slider
                    id="opacity"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={[opacity]}
                    onValueChange={([value]) => setOpacity(value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  onClick={handleAddWatermark}
                  className="w-full"
                  disabled={status === 'processing'}
                >
                  Add Watermark
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

export default WatermarkPDF;
