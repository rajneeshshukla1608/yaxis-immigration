"use client"
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Users, Award, CheckCircle } from 'lucide-react';
import Link from 'next/link'
import { ChatWidget } from '@/components/ChatWidget';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-blue-300" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">Y-Axis</h1>
                <p className="text-blue-200 text-xs sm:text-sm">Your Immigration Partner</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6 lg:space-x-8">
              <a href="#services" className="hover:text-blue-200 transition-colors text-sm lg:text-base">Services</a>
              <a href="#about" className="hover:text-blue-200 transition-colors text-sm lg:text-base">About</a>
              <a href="#contact" className="hover:text-blue-200 transition-colors text-sm lg:text-base">Contact</a>
            </nav>
            <div className="flex items-center space-x-2 sm:space-x-3">
             
                <Button variant="outline" size="sm" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-xs sm:text-sm px-2 sm:px-3">
                <Link href="/auth/sign-in">Sign In</Link>
                </Button>
      

                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-2 sm:px-3">
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Your Gateway to <span className="text-blue-600">Global Opportunities</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Y-Axis is the world's leading visa and immigration consultancy. We help individuals and families 
              achieve their dreams of studying, working, or settling abroad with expert guidance and personalized solutions.
            </p>
            <Link href="/services">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                Explore Services <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">1M+</div>
              <div className="text-gray-600 text-sm sm:text-base">Successful Applications</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">25+</div>
              <div className="text-gray-600 text-sm sm:text-base">Years of Experience</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">40+</div>
              <div className="text-gray-600 text-sm sm:text-base">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section id="services" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg sm:text-xl text-gray-600 px-4">Comprehensive immigration solutions for your journey abroad</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Visa Consultation</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">Expert guidance for all types of visa applications including tourist, work, and student visas.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Document Preparation
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Interview Training
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Award className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Immigration Services</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">Complete support for permanent residency and citizenship applications worldwide.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  PR Applications
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Points Assessment
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
              <Globe className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Study Abroad</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">End-to-end assistance for international education including university applications.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  University Selection
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Scholarship Guidance
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8 sm:mt-12">
            <Link href="/services">
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Why Choose Y-Axis?</h2>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                With over 25 years of experience in immigration services, Y-Axis has helped millions of people 
                achieve their dreams of living, working, and studying abroad. Our team of certified immigration 
                consultants provides personalized guidance throughout your journey.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Expert Consultation</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Certified immigration lawyers and consultants</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">High Success Rate</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Over 95% visa approval rate across all categories</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">End-to-End Support</h4>
                    <p className="text-gray-600 text-sm sm:text-base">From initial consultation to post-landing services</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Logo and Company Info */}
            <div className="flex items-center space-x-3">
              <Globe className="h-6 w-6 text-blue-400" />
              <div>
                <h3 className="text-lg font-bold">Y-Axis</h3>
                <p className="text-gray-400 text-sm">Your Immigration Partner</p>
              </div>
            </div>

            {/* Quick Links - Hidden on small screens */}
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
              <Link href="/services" className="hover:text-blue-400 transition-colors">Services</Link>
              <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
              <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Link href="/auth/sign-in" className="w-full">
                <Button variant="outline" size="sm" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-xs sm:text-sm w-full">
                  Sign In
                </Button>
              </Link>
              
              <Link href="/auth/sign-up">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs sm:text-sm text-gray-400">
            <p>&copy; 2024 Y-Axis Immigration Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <ChatWidget/>
    </div>
  );
};

export default Home;
