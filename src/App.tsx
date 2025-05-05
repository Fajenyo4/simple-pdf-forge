
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Tools from "./pages/Tools";
import MergePDF from "./pages/MergePDF";
import SplitPDF from "./pages/SplitPDF";
import CompressPDF from "./pages/CompressPDF";
import RotatePDF from "./pages/RotatePDF";
import WatermarkPDF from "./pages/WatermarkPDF";
import PdfToImage from "./pages/PdfToImage";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/merge-pdf" element={<MergePDF />} />
              <Route path="/split-pdf" element={<SplitPDF />} />
              <Route path="/compress-pdf" element={<CompressPDF />} />
              <Route path="/rotate-pdf" element={<RotatePDF />} />
              <Route path="/watermark-pdf" element={<WatermarkPDF />} />
              <Route path="/pdf-to-image" element={<PdfToImage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
