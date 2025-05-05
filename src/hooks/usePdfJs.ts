
import { useEffect, useState } from 'react';

export const usePdfJs = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Import and initialize PDF.js
    const loadPdfJs = async () => {
      if (!(window as any).pdfjsLib) {
        const pdfjs = await import('pdfjs-dist');
        const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
        
        pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
        (window as any).pdfjsLib = pdfjs;
      }
      
      setIsLoaded(true);
    };
    
    loadPdfJs();
  }, []);

  return { isLoaded };
};

export default usePdfJs;
