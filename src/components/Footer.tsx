
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t bg-white py-6 text-sm">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8 overflow-hidden rounded bg-pdf-blue text-white flex items-center justify-center">
              <span className="font-bold text-xl">P</span>
            </div>
            <span className="font-bold text-xl text-pdf-blue">SimplePDF</span>
          </Link>
          <p className="mt-4 text-gray-600">
            Your simple solution for all PDF needs.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">PDF Tools</h4>
          <ul className="space-y-2">
            <li><Link to="/merge-pdf" className="text-gray-600 hover:text-pdf-blue transition">Merge PDF</Link></li>
            <li><Link to="/split-pdf" className="text-gray-600 hover:text-pdf-blue transition">Split PDF</Link></li>
            <li><Link to="/compress-pdf" className="text-gray-600 hover:text-pdf-blue transition">Compress PDF</Link></li>
            <li><Link to="/convert-pdf" className="text-gray-600 hover:text-pdf-blue transition">Convert PDF</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Resources</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-gray-600 hover:text-pdf-blue transition">About</Link></li>
            <li><Link to="/blog" className="text-gray-600 hover:text-pdf-blue transition">Blog</Link></li>
            <li><Link to="/help" className="text-gray-600 hover:text-pdf-blue transition">Help Center</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
          <ul className="space-y-2">
            <li><Link to="/privacy" className="text-gray-600 hover:text-pdf-blue transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-gray-600 hover:text-pdf-blue transition">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mt-8 border-t pt-4">
        <p className="text-center text-gray-500">
          &copy; {new Date().getFullYear()} SimplePDF. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
