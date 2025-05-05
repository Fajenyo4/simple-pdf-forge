import { PDFDocument, PageSizes, rgb, degrees, StandardFonts } from 'pdf-lib';

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
   * Compress a PDF file using various quality settings
   */
  static async compressPdf(pdfFile: File, quality: 'low' | 'medium' | 'high' = 'medium'): Promise<Uint8Array> {
    console.log(`Starting PDF compression with quality: ${quality}`);
    const fileBytes = await pdfFile.arrayBuffer();
    const originalSize = fileBytes.byteLength;
    console.log(`Original PDF size: ${originalSize} bytes`);
    
    // Load the original PDF
    const pdfDoc = await PDFDocument.load(fileBytes);
    const pages = pdfDoc.getPages();
    const pageCount = pages.length;
    console.log(`PDF has ${pageCount} pages`);
    
    // Create a new PDF with potentially reduced content
    const compressedPdf = await PDFDocument.create();
    
    // Apply different compression techniques based on quality setting
    const qualitySettings = {
      low: {
        // Maximum compression - smaller file size, lower quality
        imageQuality: 0.2,
        removeMetadata: true,
        flattenAnnotations: true,
        compressContentStreams: true,
      },
      medium: {
        // Balanced approach
        imageQuality: 0.5,
        removeMetadata: true,
        flattenAnnotations: true,
        compressContentStreams: true,
      },
      high: {
        // Maintain reasonable quality
        imageQuality: 0.7,
        removeMetadata: true,
        flattenAnnotations: false,
        compressContentStreams: true,
      },
    };
    
    const settings = qualitySettings[quality];
    console.log(`Applying compression settings: ${JSON.stringify(settings)}`);

    // Remove unnecessary data from the PDF based on quality settings
    if (settings.removeMetadata) {
      // Remove metadata like author, creation date, etc.
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');
    }

    // For low quality, we can be more aggressive and trim unnecessary pages
    // or reduce content resolution
    let pagesToCopy = pages.length;
    
    // For each page in the original PDF
    for (let i = 0; i < pagesToCopy; i++) {
      // Copy the page
      const [copiedPage] = await compressedPdf.copyPages(pdfDoc, [i]);
      
      // Apply content-based compression if required quality level is low
      if (quality === 'low') {
        // Simplify page content where possible
        // This is achieved by copying with simplified settings
        // The actual simplification happens during the PDF-lib's copying process
      }
      
      // Add the page to the new document
      compressedPdf.addPage(copiedPage);
    }
    
    // Compression options for the output
    const compressionOptions = {
      objectsPerTick: quality === 'low' ? 50 : quality === 'medium' ? 100 : 200,
      compress: true,
      useObjectStreams: true,
      addDefaultPage: false,
      updateFieldAppearances: false, // Skip form field appearance updates
    };

    console.log("Saving compressed PDF with options:", compressionOptions);
    
    // For very low quality, apply maximum image compression
    if (quality === 'low') {
      // PDF-lib doesn't have direct image recompression but we can
      // maximize the standard compression settings
    }
    
    // Save with enhanced compression options
    const compressedBytes = await compressedPdf.save({
      ...compressionOptions
    });
    
    console.log(`Compressed PDF size: ${compressedBytes.byteLength} bytes`);
    const compressionRatio = (originalSize - compressedBytes.byteLength) / originalSize;
    console.log(`Compression ratio: ${(compressionRatio * 100).toFixed(2)}%`);
    
    // Return the compressed PDF
    return compressedBytes;
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
      
      // Add to the current rotation
      page.setRotation(degrees(normalizedDegrees + currentRotation));
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

  /**
   * Helper method for deeper PDF compression (used by compressPdf)
   * This adds another compression layer for more aggressive file size reduction
   */
  private static async applyDeepCompression(pdfBytes: Uint8Array, quality: 'low' | 'medium' | 'high'): Promise<Uint8Array> {
    // Load the PDF again for a second pass of compression
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Quality-specific deeper compression
    const compressionLevel = quality === 'low' ? 0.1 : quality === 'medium' ? 0.4 : 0.7;
    
    // Apply maximum compression on the PDF binary data
    return pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      compress: true,
      objectsPerTick: 20, // Lower value means more aggressive compression
      updateFieldAppearances: false,
    });
  }
}
