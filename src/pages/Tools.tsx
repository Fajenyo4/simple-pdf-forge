
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolCard from '@/components/ToolCard';

const TOOL_CARDS = [
  {
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one document',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3"/>
        <path d="M18 15V3"/>
        <path d="M15 18h8"/>
        <path d="m18 21 3-3-3-3"/>
      </svg>
    ),
    path: '/merge-pdf',
    color: 'bg-pdf-blue',
  },
  {
    title: 'Split PDF',
    description: 'Extract pages or split a PDF into multiple files',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3h-7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7"/>
        <path d="M6 9h12"/>
        <path d="M6 15h12"/>
      </svg>
    ),
    path: '/split-pdf',
    color: 'bg-pdf-green',
  },
  {
    title: 'Compress PDF',
    description: 'Reduce file size while maintaining quality',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
        <path d="m9.2 22 3-3-3-3"/>
        <path d="M9.7 19H6.4a2 2 0 0 1-2-2v-1"/>
      </svg>
    ),
    path: '/compress-pdf',
    color: 'bg-pdf-orange',
  },
  {
    title: 'Rotate PDF',
    description: 'Rotate pages in your PDF files',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 15c0 2.1 1.7 4 3.8 4h12.4c2.1 0 3.8-1.9 3.8-4s-1.7-4-3.8-4H4.7"/>
        <path d="m8 9-3 2 3 2"/>
        <path d="m2 11 4.5-8"/>
      </svg>
    ),
    path: '/rotate-pdf',
    color: 'bg-pdf-purple',
  },
  {
    title: 'Add Watermark',
    description: 'Add text or image watermarks to your PDFs',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8s.13-4-4-4-4 4-4 4v8a19 19 0 0 1-2 7"/>
        <circle cx="12" cy="16" r="1"/>
        <path d="m9 17 3 3 3-3"/>
      </svg>
    ),
    path: '/watermark-pdf',
    color: 'bg-pdf-red',
  },
  {
    title: 'PDF to Images',
    description: 'Convert PDF pages to image formats like JPG or PNG',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 9.5V4.5H9.5"/>
        <path d="M21 16V21H16"/>
        <path d="M4.5 14.5V19.5H9.5"/>
        <path d="M21 8V3H16"/>
        <path d="m9 14 6-6"/>
      </svg>
    ),
    path: '/pdf-to-image',
    color: 'bg-pdf-blue-dark',
  },
];

const Tools = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-12 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">PDF Tools</h1>
            <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Select from our collection of free tools to work with your PDF files
            </p>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TOOL_CARDS.map((tool, index) => (
                <ToolCard
                  key={index}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  path={tool.path}
                  color={tool.color}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tools;
