
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolCard from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
];

const HeroSection = () => {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          Simple PDF Tools for Everyone
        </h1>
        <p className="max-w-[700px] text-lg md:text-xl text-gray-600 mb-8">
          Free, easy-to-use tools to manage your PDF files online. No installation, no registration required.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/tools">Start Using Our Tools</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/learn-more">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      title: "Easy to Use",
      description: "Simple interface that makes PDF handling a breeze",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pdf-blue">
          <path d="M3 15c0 2.1 1.7 4 3.8 4h10.4c2.1 0 3.8-1.9 3.8-4s-1.7-4-3.8-4H7.5"/>
          <path d="M7 11V7a4 4 0 0 1 4-4v0a4 4 0 0 1 4 4v4"/>
        </svg>
      ),
    },
    {
      title: "Fast Processing",
      description: "Process your files quickly without waiting",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pdf-blue">
          <polyline points="13 17 18 12 13 7"/>
          <polyline points="6 17 11 12 6 7"/>
        </svg>
      ),
    },
    {
      title: "Secure",
      description: "Your files are processed locally, not uploaded to our servers",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pdf-blue">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          <circle cx="12" cy="16" r="1"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose SimplePDF?</h2>
        
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="mb-4 p-2 rounded-full bg-blue-50">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ToolsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-4">Our PDF Tools</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Everything you need to work with PDF files in one place
        </p>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        
        <div className="mt-10 text-center">
          <Button asChild>
            <Link to="/tools">View All Tools</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Choose your tool",
      description: "Select the PDF tool that fits your needs",
    },
    {
      number: "02",
      title: "Upload your files",
      description: "Drag and drop your files or click to select them",
    },
    {
      number: "03",
      title: "Process your PDFs",
      description: "Adjust settings if needed and start processing",
    },
    {
      number: "04",
      title: "Download results",
      description: "Get your processed PDF files instantly",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-pdf-blue text-white font-bold text-4xl w-16 h-16 rounded-full flex items-center justify-center mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-y-1/2" style={{ width: 'calc(100% - 4rem)' }}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-16 bg-pdf-blue text-white">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to handle your PDFs?</h2>
        <p className="max-w-2xl mx-auto mb-8 opacity-90">
          Start using our free tools now. No registration required.
        </p>
        <Button size="lg" variant="outline" className="bg-white text-pdf-blue hover:bg-gray-100" asChild>
          <Link to="/tools">Get Started</Link>
        </Button>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <ToolsSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
