import { Button } from '@/components/ui/button';
import { Globe, LogOut } from 'lucide-react';
import Index from '@/pages/Index';
import Link from 'next/link';

const Services = () => {
  return (
    <div className="min-h-screen bg-white">
      <Index />
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Logo and Company Info */}
            <div className="flex items-center space-x-3">
              <Globe className="h-6 w-6 text-blue-400" />
              <div>
                <h3 className="text-lg font-bold">Y-Axis</h3>
                <p className="text-gray-400 text-sm">Your Immigration Partner</p>
              </div>
            </div>
            {/* Quick Links */}
            <div className="flex items-center space-x-6 text-sm">
              <a href="/" className="hover:text-blue-400 transition-colors">Home</a>
              <a href="/services" className="hover:text-blue-400 transition-colors">Services</a>
              <a href="#" className="hover:text-blue-400 transition-colors">About</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
            </div>

          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-400">
            <p>&copy; 2024 Y-Axis Immigration Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Services;
