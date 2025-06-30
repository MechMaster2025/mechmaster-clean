import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Category } from '../types';
import { Settings, Droplets, Zap, Hammer, AlertCircle, Lock, Database } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const iconMap = {
  'settings': Settings,
  'droplets': Droplets,
  'zap': Zap,
  'hammer': Hammer,
};

// Demo categories for when Supabase is not configured
const demoCategories: Category[] = [
  { id: '1', name: 'Valves & Controls', slug: 'valves-controls', icon: 'settings' },
  { id: '2', name: 'Pumps & Compressors', slug: 'pumps-compressors', icon: 'droplets' },
  { id: '3', name: 'Power Systems', slug: 'power-systems', icon: 'zap' },
  { id: '4', name: 'Manufacturing', slug: 'manufacturing', icon: 'hammer' },
];

export function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchCategories();
    } else {
      // Use demo data when Supabase is not configured
      setCategories(demoCategories);
      setLoading(false);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Supabase error:', error);
        setError(`Database error: ${error.message}`);
        return;
      }
      
      console.log('Fetched categories:', data);
      setCategories(data || []);
      
      if (!data || data.length === 0) {
        setError('No categories found in database');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveSubscription = user?.subscription_status === 'active' && 
    user?.subscription_end_date && 
    new Date(user.subscription_end_date) > new Date();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  // Show configuration error for admin users
  if (error && !isSupabaseConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <Database className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Demo Mode</h2>
          <p className="text-gray-600 mb-6">
            Supabase environment variables not configured. The app is running in demo mode with sample data.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-yellow-800 mb-2">To enable full functionality:</h3>
            <ol className="text-sm text-yellow-700 space-y-1">
              <li>1. Set up your Supabase project</li>
              <li>2. Add environment variables to Vercel</li>
              <li>3. Redeploy your application</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchCategories}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome to MechMaster
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive collection of mechanical engineering categories and deepen your understanding.
          </p>
          
          {/* Configuration Status */}
          {!isSupabaseConfigured() && (
            <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Demo Mode - Limited Functionality
            </div>
          )}
          
          {/* Subscription Status */}
          {user && isSupabaseConfigured() && (
            <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium">
              {hasActiveSubscription ? (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  ✓ Premium Access Active
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                  Free Account - Upgrade for Full Access
                </span>
              )}
            </div>
          )}
        </div>

        {categories.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Settings;
              
              return (
                <div key={category.id} className="relative group">
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-red-200 transition-colors">
                          <IconComponent className="w-6 h-6 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
                      </div>
                      
                      {isSupabaseConfigured() && hasActiveSubscription ? (
                        <Link
                          to={`/category/${category.slug}`}
                          className="inline-flex items-center text-red-600 hover:text-red-700 font-medium transition-colors group"
                        >
                          Explore Topics
                          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ) : isSupabaseConfigured() ? (
                        <Link
                          to="/access-locked"
                          className="inline-flex items-center text-gray-500 hover:text-red-600 font-medium transition-colors group"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Requires Subscription
                          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ) : (
                        <span className="inline-flex items-center text-gray-400 font-medium">
                          <Database className="w-4 h-4 mr-2" />
                          Demo Content
                        </span>
                      )}
                    </div>
                    
                    {/* Premium Badge for non-subscribers */}
                    {isSupabaseConfigured() && !hasActiveSubscription && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                          Premium
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">No categories available in the database.</p>
          </div>
        )}

        {/* Upgrade CTA for free users */}
        {user && isSupabaseConfigured() && !hasActiveSubscription && (
          <div className="mt-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Unlock All Content</h3>
            <p className="text-red-100 mb-6 max-w-2xl mx-auto">
              Get unlimited access to all mechanical engineering topics, detailed articles, 
              and practical guides for just ₹140 per year.
            </p>
            <Link
              to="/access-locked"
              className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
            >
              Upgrade Now - ₹140/year
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}