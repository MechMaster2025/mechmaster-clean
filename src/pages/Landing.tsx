import React from 'react';
import { Link } from 'react-router-dom';
import { Target, BookOpen, ClipboardList, Briefcase, Clock, DollarSign, RefreshCw, Check, ArrowRight, Star, Mail, Menu, X } from 'lucide-react';

export function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mr-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">MechMaster</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Pricing
              </a>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Contact
              </Link>
              <Link 
                to="/login" 
                className="text-red-600 hover:text-red-700 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <a 
                  href="#features" 
                  className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#pricing" 
                  className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <Link 
                  to="/contact" 
                  className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-gray-200">
                  <Link 
                    to="/login" 
                    className="text-red-600 hover:text-red-700 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-red-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg">
                <Target className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Master Mechanical
              <span className="block bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Engineering
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Access comprehensive articles, practical guides, and expert knowledge on 
              valves, pumps, bearings, and more for just <span className="font-bold text-red-600">₹140 per year</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to="/signup"
                className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login"
                className="border-2 border-red-600 text-red-600 hover:bg-red-50 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <Star className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-sm font-medium">Expert Content</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-medium">Updated Regularly</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <Target className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-sm font-medium">Industry Focused</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MechMaster?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-700 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform your mechanical engineering knowledge with our comprehensive, 
              expertly crafted resources.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group text-center hover:transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:from-red-200 group-hover:to-red-300 transition-colors">
                <BookOpen className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">In-Depth Articles</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Comprehensive articles with detailed explanations and real-world applications.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group text-center hover:transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
                <ClipboardList className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Organized Learning</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Systematically categorized topics for progressive learning.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group text-center hover:transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:from-green-200 group-hover:to-green-300 transition-colors">
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Practical Knowledge</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Industry-relevant insights you can apply immediately.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group text-center hover:transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:from-purple-200 group-hover:to-purple-300 transition-colors">
                <RefreshCw className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Regular Updates</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Fresh content added regularly with latest developments.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group text-center hover:transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:from-yellow-200 group-hover:to-yellow-300 transition-colors">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Time-Saving</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                All information in one place, saving hours of research.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group text-center hover:transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:from-indigo-200 group-hover:to-indigo-300 transition-colors">
                <DollarSign className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Affordable Access</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Premium knowledge for just ₹140 per year.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-700 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
              One plan, unlimited access to all premium content.
            </p>
          </div>

          <div className="max-w-sm mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-8">
                <h3 className="text-xl font-bold mb-2">Annual Subscription</h3>
                <p className="text-red-100">Complete access to all content</p>
              </div>
              
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-5xl font-bold text-gray-900">₹140</span>
                    <span className="text-gray-600 ml-2 text-xl">/year</span>
                  </div>
                  <p className="text-green-600 font-medium text-sm">Save 80% vs individual courses</p>
                </div>
                
                <ul className="space-y-3 mb-8 text-sm">
                  {[
                    'Access to all articles and topics',
                    'Regular content updates',
                    'Detailed diagrams and illustrations',
                    'Practical examples and case studies',
                    'Mobile-friendly experience',
                    'Less than ₹12 per month'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  to="/signup"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-block text-center"
                >
                  Start Learning Today
                </Link>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  Secure payment • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Advance Your Career?
          </h2>
          <p className="text-lg text-red-100 mb-8 max-w-xl mx-auto">
            Join thousands of engineers who trust MechMaster for their professional development.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup"
              className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started Now
            </Link>
            <Link 
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">MechMaster</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                Your comprehensive resource for mechanical engineering knowledge. 
                Empowering engineers with expert content and practical insights.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/signup" className="text-gray-400 hover:text-white transition-colors">Create Account</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">
                  Questions or need help?
                </p>
                <a 
                  href="mailto:MechMasterContact@gmail.com" 
                  className="text-red-400 hover:text-red-300 transition-colors flex items-center text-sm"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  MechMasterContact@gmail.com
                </a>
                <p className="text-gray-400 text-xs">
                  We respond within 24 hours
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 MechMaster. All rights reserved. Built with ❤️ for engineers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}