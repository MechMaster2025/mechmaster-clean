import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { processPayment, getSubscriptionAmount, isPaymentSystemReady } from '../lib/razorpay-integration';
import { Target, Check, CreditCard, Smartphone, CreditCard as Card, Building, Shield, Lock, AlertTriangle } from 'lucide-react';

export function Subscribe() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get the fixed subscription amount
  const subscriptionAmount = getSubscriptionAmount(); // Always ₹140
  const paymentReady = isPaymentSystemReady();

  const handlePayment = async () => {
    if (!user) return;

    if (!paymentReady) {
      alert('⚠️ Payment system is not configured yet. Please contact support at MechMasterContact@gmail.com');
      return;
    }

    setLoading(true);
    
    try {
      await processPayment(
        {
          name: user.full_name || 'User',
          email: user.email,
          contact: user.phone || '9999999999',
        },
        async (response) => {
          // Payment successful
          console.log('Payment successful:', response);
          alert('🎉 Payment successful! Your subscription is now active. Welcome to MechMaster Premium!');
          navigate('/home');
          setLoading(false);
        },
        (error) => {
          // Payment failed
          console.error('Payment failed:', error);
          alert('❌ Payment failed. Please try again or contact support.');
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('❌ Error processing payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <Target className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Your Subscription
          </h1>
          <p className="text-xl text-gray-600">
            {user ? `Welcome ${user.full_name}!` : 'Welcome!'} Secure payment for your annual subscription.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-8">
              <h3 className="text-2xl font-bold mb-2">Annual Subscription</h3>
              <p className="text-red-100">Full access to all premium content</p>
              
              {/* Security Badge */}
              <div className="mt-4 inline-flex items-center bg-red-500 bg-opacity-30 px-3 py-1 rounded-full">
                <Shield className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
            </div>
            
            <div className="p-8">
              {/* Payment System Status */}
              {!paymentReady && (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">Payment System Setup Required</p>
                      <p className="text-xs text-yellow-700">
                        Razorpay integration is not configured. Contact support for assistance.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Fixed Amount Display */}
              <div className="text-center mb-8 bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-center mb-2">
                  <Lock className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Fixed Price</span>
                </div>
                <span className="text-5xl font-bold text-gray-900">₹{subscriptionAmount}</span>
                <span className="text-gray-600 ml-2 text-xl">/year</span>
                <p className="text-green-600 font-medium mt-2">
                  No hidden fees • No variable pricing • Exactly ₹{subscriptionAmount} only
                </p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  'Complete access to all engineering topics',
                  'In-depth articles with practical examples',
                  'Detailed diagrams and illustrations',
                  'Regular content updates and new topics',
                  'Mobile-friendly reading experience',
                  'Priority email support'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Payment Methods */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Secure Payment Options</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <Smartphone className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium">UPI</span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <Card className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium">Cards</span>
                  </div>
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <Building className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="font-medium">Net Banking</span>
                  </div>
                  <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                    <CreditCard className="w-5 h-5 text-orange-600 mr-2" />
                    <span className="font-medium">Wallets</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handlePayment}
                disabled={loading || !paymentReady}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </div>
                ) : !paymentReady ? (
                  <>
                    <AlertTriangle className="w-5 h-5 inline mr-2" />
                    Payment System Not Ready
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 inline mr-2" />
                    Pay Exactly ₹{subscriptionAmount} - Subscribe Now
                  </>
                )}
              </button>

              <div className="mt-6 text-center space-y-2">
                <p className="text-xs text-gray-500">
                  🔒 Amount is fixed at ₹{subscriptionAmount} • No additional charges
                </p>
                {paymentReady ? (
                  <>
                    <p className="text-xs text-gray-500">
                      Secure payment powered by Razorpay • SSL encrypted
                    </p>
                    <p className="text-xs text-gray-500">
                      Cancel anytime • 30-day money-back guarantee
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-yellow-600">
                    Contact MechMasterContact@gmail.com for payment assistance
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 max-w-lg mx-auto bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-900">Payment Security</p>
              <p className="text-xs text-blue-700">
                Amount is locked at ₹140. Any attempt to modify the payment amount will be rejected.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Trusted by 1000+ engineers across India</p>
          <div className="flex justify-center items-center space-x-8 text-gray-400">
            <div className="text-sm">🔒 SSL Secured</div>
            <div className="text-sm">💳 All Payment Methods</div>
            <div className="text-sm">📱 Mobile Friendly</div>
          </div>
        </div>
      </div>
    </div>
  );
}