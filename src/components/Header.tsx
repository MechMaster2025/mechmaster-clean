import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Target, Menu, X, User, LogOut, Home, Mail, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SearchBar } from './SearchBar';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      setProfileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Don't show header on landing page for cleaner design
  if (location.pathname === '/') {
    return null;
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user ? "/home" : "/"} className="flex items-center flex-shrink-0">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mr-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 hidden sm:block">MechMaster</span>
          </Link>
          
          {/* Search Bar - Desktop */}
          {user && (
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <SearchBar />
            </div>
          )}
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {user && (
              <Link 
                to="/home" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Categories
              </Link>
            )}
            <Link 
              to="/contact" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact
            </Link>
          </nav>
          
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">
                    {user.full_name || user.email?.split('@')[0] || 'User'}
                  </span>
                </button>
                
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                        user.subscription_status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.subscription_status === 'active' ? 'Premium' : 'Free'}
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Profile Settings
                    </Link>
                    <Link
                      to="/home"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <Home className="w-4 h-4 inline mr-2" />
                      Browse Categories
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
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
              {/* Mobile Search */}
              {user && (
                <div className="px-4">
                  <SearchBar />
                </div>
              )}
              
              {user && (
                <Link 
                  to="/home" 
                  className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Categories
                </Link>
              )}
              
              <Link 
                to="/contact" 
                className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Link>
              
              <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <div className="pb-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="text-gray-600 hover:text-gray-900 font-medium py-2 flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <button 
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }} 
                      className="text-red-600 hover:text-red-700 font-medium py-2 text-left flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}