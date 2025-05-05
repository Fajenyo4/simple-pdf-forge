
import { useEffect, useState } from 'react';

export const usePdfJs = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Import and initialize PDF.js
    const loadPdfJs = async () => {
      if (!(window as any).pdfjsLib) {
        const pdfjs = await import('pdfjs-dist');
        
        // Use a CDN approach to load the worker
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        
        (window as any).pdfjsLib = pdfjs;
      }
      
      setIsLoaded(true);
    };
    
    loadPdfJs();
  }, []);

  return { 
    isLoaded, 
    getDocument: isLoaded ? (window as any).pdfjsLib?.getDocument : null 
  };
};

export default usePdfJs;
