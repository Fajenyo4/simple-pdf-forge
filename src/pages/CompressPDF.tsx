
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
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const handleFilesDrop = (uploadedFiles: File[]) => {
    // Only allow single file for compressing
    const pdfFile = uploadedFiles[0];
    setFiles([pdfFile]);
    setOriginalSize(pdfFile.size);
    setCompressedSize(0);
    setStatus('idle');
  };

  const handleRemoveFile = (file: File) => {
    setFiles(files.filter(f => f !== file));
    setOriginalSize(0);
    setCompressedSize(0);
    setStatus('idle');
  };

  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) {
      return sizeInBytes + ' bytes';
    } else if (sizeInBytes < 1024 * 1024) {
      return (sizeInBytes / 1024).toFixed(1) + ' KB';
    } else {
      return (sizeInBytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };

  const calculateCompressionRate = (): string => {
    if (!originalSize || !compressedSize) return "0%";
    
    // Handle case where compression actually increases file size
    if (compressedSize >= originalSize) {
      return "0%";
    }
    
    const reduction = ((originalSize - compressedSize) / originalSize) * 100;
    return `${reduction.toFixed(1)}%`;
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
    setCompressedSize(0);

    try {
      // Process the PDF
      setProgress(30);
      
      console.log(`Compressing PDF with quality: ${quality}`);
      console.log(`Original size: ${originalSize} bytes`);
      
      const compressedPdf = await PdfService.compressPdf(files[0], quality);
      setProgress(70);

      // Calculate compressed size based on the Uint8Array length
      const compressedSizeBytes = compressedPdf.byteLength;
      setCompressedSize(compressedSizeBytes);
      
      console.log(`Compressed size: ${compressedSizeBytes} bytes`);
      console.log(`Compression ratio: ${calculateCompressionRate()}`);
      
      // Save the result
      const outputFileName = `${files[0].name.replace('.pdf', '')}_compressed.pdf`;
      await PdfService.savePdfAsBlob(compressedPdf, outputFileName);
      
      setProgress(100);
      setStatus('success');
      
      const reductionRate = calculateCompressionRate();
      
      // Only show success if actually compressed
      if (compressedSizeBytes < originalSize) {
        toast({
          title: "Success",
          description: `PDF compressed successfully! Reduced by ${reductionRate}`,
        });
      } else {
        toast({
          title: "Notice",
          description: "The PDF could not be compressed further with these settings.",
        });
      }
    } catch (error) {
      console.error('Error compressing PDF:', error);
      setStatus('error');
      toast({
        title: "Error",
        description: "Failed to compress PDF. Please try again with a different file or quality setting.",
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
              
              {compressedSize > 0 && status === 'success' && (
                <div className="mt-4 p-4 border rounded-lg bg-white">
                  <h2 className="font-medium mb-2">Compression Results</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Original Size:</p>
                      <p className="font-medium">{formatFileSize(originalSize)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Compressed Size:</p>
                      <p className="font-medium">{formatFileSize(compressedSize)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Reduction:</p>
                      <p className={`font-medium ${compressedSize < originalSize ? 'text-green-600' : 'text-orange-500'}`}>
                        {compressedSize < originalSize ? calculateCompressionRate() : "No reduction achieved"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 p-4 border rounded-lg bg-white">
                <h2 className="font-medium mb-4">Compression Quality</h2>
                <RadioGroup 
                  value={quality} 
                  onValueChange={(value) => setQuality(value as 'low' | 'medium' | 'high')}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low Quality (maximum compression)</Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium Quality (recommended)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High Quality (minimal compression)</Label>
                  </div>
                </RadioGroup>
                <p className="text-sm text-gray-500 mt-2">
                  {quality === 'low' ? 
                    "Maximizes compression with potential quality loss" : 
                    quality === 'medium' ? 
                    "Balanced approach between file size and quality" : 
                    "Preserves quality with moderate file size reduction"}
                </p>
              </div>

              <div className="mt-6">
                <Button 
                  onClick={handleCompress}
                  className="w-full"
                  disabled={status === 'processing'}
                >
                  {status === 'processing' ? 'Compressing...' : 'Compress PDF'}
                </Button>
              </div>
            </>
          )}

          <ProcessingProgress 
            status={status} 
            progress={progress}
            message={status === 'processing' ? 'Compressing your PDF...' : undefined}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompressPDF;
