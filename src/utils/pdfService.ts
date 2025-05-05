
import { PDFDocument, PageSizes, rgb, degrees } from 'pdf-lib';

export interface ProcessingOptions {
  rotation?: number;
  watermark?: { text: string; opacity?: number };
  quality?: 'low' | 'medium' | 'high';
  pageRange?: { start: number; end: number };
  targetFormat?: 'pdf' | 'jpg' | 'png';
}

export class PdfService {
  /**
   * Merge multiple PDF files into one
   */
  static async mergePdfs(pdfFiles: File[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of pdfFiles) {
      const fileBytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      
      copiedPages.forEach(page => {
        mergedPdf.addPage(page);
      });
    }
    
    return mergedPdf.save();
  }
  
  /**
   * Split a PDF into separate files by page ranges
   */
  static async splitPdf(pdfFile: File, ranges: { start: number; end: number }[]): Promise<Uint8Array[]> {
    const fileBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBytes);
    const totalPages = pdfDoc.getPageCount();
    
    const splitDocuments: Uint8Array[] = [];
    
    for (const range of ranges) {
      const newPdf = await PDFDocument.create();
      
      // Validate page range
      const start = Math.max(0, Math.min(range.start - 1, totalPages - 1));
      const end = Math.min(range.end - 1, totalPages - 1);
      
      // Copy pages in range
      const pagesToCopy = Array.from(
        { length: end - start + 1 }, 
        (_, i) => start + i
      );
      
      const copiedPages = await newPdf.copyPages(pdfDoc, pagesToCopy);
      copiedPages.forEach(page => {
        newPdf.addPage(page);
      });
      
      splitDocuments.push(await newPdf.save());
    }
    
    return splitDocuments;
  }
  
  /**
   * Compress a PDF file
   */
  static async compressPdf(pdfFile: File, quality: 'low' | 'medium' | 'high' = 'medium'): Promise<Uint8Array> {
    const fileBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBytes, { 
      updateMetadata: false 
    });
    
    // Different compression strategies could be implemented here
    // This is a simplified version - in reality, you might want to
    // use a server-side approach for better compression
    
    return pdfDoc.save();
  }

  /**
   * Add a watermark to a PDF file
   */
  static async addWatermark(pdfFile: File, text: string, opacity = 0.3): Promise<Uint8Array> {
    const fileBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBytes);
    
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont('Helvetica');
    
    for (const page of pages) {
      const { width, height } = page.getSize();
      
      page.drawText(text, {
        x: width / 2 - 100,
        y: height / 2,
        size: 24,
        font,
        opacity,
        color: rgb(0.5, 0.5, 0.5),
        rotate: degrees(45), // Using degrees() helper function for rotation
      });
    }
    
    return pdfDoc.save();
  }

  /**
   * Rotate pages in a PDF file
   */
  static async rotatePdf(pdfFile: File, rotationDegrees: number): Promise<Uint8Array> {
    const fileBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBytes);
    const pages = pdfDoc.getPages();
    
    for (const page of pages) {
      // Normalize degrees to be 0, 90, 180, or 270
      const normalizedDegrees = ((rotationDegrees % 360) + 360) % 360;
      const currentRotation = page.getRotation().angle;
      const degreesToRotate = normalizedDegrees - currentRotation;
      
      if (degreesToRotate !== 0) {
        page.setRotation(degrees(degreesToRotate));
      }
    }
    
    return pdfDoc.save();
  }

  /**
   * Convert PDF to a Blob for download
   */
  static async savePdfAsBlob(pdfBytes: Uint8Array, fileName: string): Promise<void> {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
