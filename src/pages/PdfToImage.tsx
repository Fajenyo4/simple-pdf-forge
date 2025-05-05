
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileDropZone from '@/components/FileDropZone';
import FilesList from '@/components/FilesList';
import ProcessingProgress from '@/components/ProcessingProgress';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const PdfToImage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [format, setFormat] = useState<'jpg' | 'png'>('jpg');
  const [dpi, setDpi] = useState<number>(150);

  const handleFileUpload = (uploadedFiles: File[]) => {
    // Only allow single file for conversion
    const pdfFile = uploadedFiles[0];
    setFiles([pdfFile]);
  };

  const handleRemoveFile = (file: File) => {
    setFiles(files.filter(f => f !== file));
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please upload a PDF file to convert.",
        variant: "destructive"
      });
      return;
    }

    setStatus('processing');
    setProgress(10);

    try {
      setProgress(30);
      
      // Note: This is a placeholder since actual PDF to image conversion
      // requires more complex implementation, likely using a library like pdf.js
      // to render PDF pages to a canvas and then export as images
      toast({
        title: "Feature in development",
        description: "PDF to Image conversion will be available soon!",
        variant: "default"
      });
      
      setProgress(100);
      setStatus('error');
    } catch (error) {
      console.error('Error converting PDF to images:', error);
      setStatus('error');
      toast({
        title: "Error",
        description: "Failed to convert PDF to images.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-8 mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">PDF to Images</h1>
          <p className="text-center text-gray-600 mb-8">Convert PDF pages to image formats</p>

          {files.length === 0 ? (
            <FileDropZone 
              onFileUpload={handleFileUpload} 
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
                <h2 className="font-medium mb-4">Conversion Settings</h2>
                
                <div className="mb-4">
                  <Label className="block font-medium mb-2">Image Format</Label>
                  <RadioGroup 
                    value={format} 
                    onValueChange={(value) => setFormat(value as 'jpg' | 'png')}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="jpg" id="jpg" />
                      <Label htmlFor="jpg">JPG</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="png" id="png" />
                      <Label htmlFor="png">PNG</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="block font-medium mb-2">Resolution (DPI)</Label>
                  <select 
                    value={dpi} 
                    onChange={(e) => setDpi(Number(e.target.value))}
                    className="border rounded p-2 w-full"
                  >
                    <option value="72">72 DPI (Low Quality)</option>
                    <option value="150">150 DPI (Medium Quality)</option>
                    <option value="300">300 DPI (High Quality)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  onClick={handleConvert}
                  className="w-full"
                  disabled={status === 'processing'}
                >
                  Convert to Images
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

export default PdfToImage;
