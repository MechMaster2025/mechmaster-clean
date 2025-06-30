import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { User, Calendar, CreditCard, BookOpen, Database } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600">You need to be signed in to view your profile.</p>
        </div>
      </div>
    );
  }

  const isSubscriptionActive = user.is_paid && 
    user.subscription_end_date && 
    new Date(user.subscription_end_date) > new Date();

  const supabaseConfigured = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="flex items-center mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mr-6">
                <User className="w-10 h-10 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.full_name}</h1>
                <p className="text-gray-600">{user.email}</p>
                {user.phone && (
                  <p className="text-gray-600">{user.phone}</p>
                )}
                {!supabaseConfigured && (
                  <span className="inline-block mt-2 px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    Demo Mode
                  </span>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Subscription Status */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Subscription Status</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      supabaseConfigured && isSubscriptionActive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {supabaseConfigured ? (isSubscriptionActive ? 'Active' : 'Inactive') : 'Demo Mode'}
                    </span>
                  </div>
                  {supabaseConfigured && user.subscription_end_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expires:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(user.subscription_end_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {!supabaseConfigured && (
                    <div className="text-sm text-yellow-600">
                      Full subscription features require database configuration
                    </div>
                  )}
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Calendar className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Account Information</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member since:</span>
                    <span className="font-medium text-gray-900">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Demo User'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account type:</span>
                    <span className="font-medium text-gray-900">
                      {supabaseConfigured ? (isSubscriptionActive ? 'Premium' : 'Free') : 'Demo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button 
                  onClick={() => window.location.href = '/home'}
                  className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <BookOpen className="w-6 h-6 text-red-600 mr-3" />
                  <span className="font-medium text-gray-900">Browse Categories</span>
                </button>
                
                {supabaseConfigured ? (
                  <button 
                    onClick={() => window.location.href = '/subscribe'}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <CreditCard className="w-6 h-6 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">Manage Subscription</span>
                  </button>
                ) : (
                  <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                    <Database className="w-6 h-6 text-yellow-600 mr-3" />
                    <span className="font-medium text-gray-700">Demo Mode Active</span>
                  </div>
                )}
                
                <button className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <User className="w-6 h-6 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Demo Mode Notice */}
            {!supabaseConfigured && (
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Database className="w-6 h-6 text-blue-600 mr-3" />
                  <h4 className="text-lg font-semibold text-blue-900">Demo Mode</h4>
                </div>
                <p className="text-blue-800 mb-3">
                  You're currently viewing the app in demo mode. To enable full functionality including user accounts and subscriptions:
                </p>
                <ol className="text-sm text-blue-700 space-y-1 ml-4">
                  <li>1. Set up your Supabase project</li>
                  <li>2. Configure environment variables</li>
                  <li>3. Deploy with proper configuration</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}