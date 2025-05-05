
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white py-3">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative h-8 w-8 overflow-hidden rounded bg-pdf-blue text-white flex items-center justify-center">
            <span className="font-bold text-xl">P</span>
          </div>
          <span className="font-bold text-xl text-pdf-blue">SimplePDF</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/tools" className="text-sm font-medium text-gray-700 hover:text-pdf-blue transition">All Tools</Link>
          <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-pdf-blue transition">About</Link>
          
          {user ? (
            <>
              <span className="text-sm font-medium text-gray-700">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>

        <Button variant="outline" size="icon" className="md:hidden">
          <span className="sr-only">Toggle menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </div>
    </header>
  );
};

export default Header;
