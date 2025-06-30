import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, CreditCard, Target, Check, Star, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getSubscriptionAmount, isPaymentSystemReady } from '../lib/razorpay-integration';

export function AccessLocked() {
  const { user } = useAuth();
  const subscriptionAmount = getSubscriptionAmount(); // Always ₹140
  const paymentReady = isPaymentSystemReady();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-red-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-4xl font-bold text-gray-900">
          Unlock Premium Content
        </h2>
        <p className="mt-4 text-center text-xl text-gray-600">
          {user ? `Welcome ${user.full_name}!` : 'Welcome!'} Get unlimited access to all mechanical engineering resources.
        </p>
      </div>

      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-2xl sm:rounded-2xl border border-gray-100">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                <Target className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Annual Subscription
            </h3>
            
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center mb-2">
                <Shield className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-600">Fixed Price - No Hidden Fees</span>
              </div>
              <div className="text-center">
                <span className="text-4xl font-bold text-gray-900">₹{subscriptionAmount}</span>
                <span className="text-gray-600 ml-2 text-lg">/year</span>
              </div>
              <p className="text-sm text-red-600 mt-2 font-medium">
                Exactly ₹{subscriptionAmount} only • No variable pricing • No surprises
              </p>
            </div>

            <div className="space-y-4 mb-8 text-left">
              {[
                'Complete access to all engineering topics',
                'In-depth articles with practical examples',
                'Detailed diagrams and illustrations',
                'Regular content updates and new topics',
                'Mobile-friendly reading experience',
                'Download resources for offline reading'
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {paymentReady ? (
                <Link
                  to="/subscribe"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay ₹{subscriptionAmount} - Subscribe Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <div className="space-y-3">
                  <div className="w-full bg-gray-400 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center cursor-not-allowed">
                    <Lock className="w-5 h-5 mr-2" />
                    Payment System Not Ready
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Contact us at{' '}
                    <a href="mailto:MechMasterContact@gmail.com" className="text-red-600 hover:text-red-500">
                      MechMasterContact@gmail.com
                    </a>
                    {' '}for subscription assistance
                  </p>
                </div>
              )}
              
              <p className="text-xs text-gray-500 text-center">
                Secure payment • Fixed amount • Cancel anytime
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>Trusted by 1000+ engineers</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-4 text-center">
                Questions? Contact us at{' '}
                <a href="mailto:MechMasterContact@gmail.com" className="text-red-600 hover:text-red-500">
                  MechMasterContact@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}