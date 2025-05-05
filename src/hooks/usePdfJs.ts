
import { useEffect, useState } from 'react';

export const usePdfJs = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Import and initialize PDF.js
    const loadPdfJs = async () => {
      try {
        if (!(window as any).pdfjsLib) {
          const pdfjs = await import('pdfjs-dist');
          
          // Import the worker directly instead of using CDN
          const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs');
          
          // Set the worker source to the worker constructor
          pdfjs.GlobalWorkerOptions.workerPort = new pdfjsWorker.PDFWorkerConstructor();
          
          (window as any).pdfjsLib = pdfjs;
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading PDF.js:', error);
      }
    };
    
    loadPdfJs();
  }, []);

  return { 
    isLoaded, 
    getDocument: isLoaded ? (window as any).pdfjsLib?.getDocument : null 
  };
};

export default usePdfJs;
