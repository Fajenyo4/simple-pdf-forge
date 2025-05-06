
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white py-3">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative h-8 w-8 overflow-hidden rounded bg-pdf-blue text-white flex items-center justify-center">
            <span className="font-bold text-xl">P</span>
          </div>
          <span className="font-bold text-xl text-pdf-blue">SimplePDF</span>
        </Link>
        
        {/* Desktop Navigation */}
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

        {/* Mobile Navigation */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <span className="sr-only">Toggle menu</span>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[75vw] sm:w-[350px]">
            <div className="flex flex-col space-y-4 mt-6">
              <Link 
                to="/tools" 
                className="text-base font-medium text-gray-700 hover:text-pdf-blue transition p-2 rounded-md hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Tools
              </Link>
              <Link 
                to="/about" 
                className="text-base font-medium text-gray-700 hover:text-pdf-blue transition p-2 rounded-md hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              
              <div className="h-px bg-gray-200 my-2"></div>
              
              {user ? (
                <>
                  <div className="p-2 text-base font-medium text-gray-700">{user.email}</div>
                  <Button 
                    variant="ghost" 
                    className="justify-start font-medium" 
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="justify-start font-medium" asChild>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button className="justify-start" asChild>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
