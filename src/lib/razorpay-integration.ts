// Enhanced Razorpay Integration for MechMaster - FIXED AMOUNT ONLY
import { supabase, isSupabaseConfigured } from './supabase';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
  notes: {
    subscription_type: string;
    amount_inr: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

// 🔒 FIXED SUBSCRIPTION AMOUNT - CANNOT BE CHANGED
const SUBSCRIPTION_AMOUNT = 140; // ₹140 only
const SUBSCRIPTION_AMOUNT_PAISE = SUBSCRIPTION_AMOUNT * 100; // 14000 paise

// Check if payment system is ready
export const isPaymentSystemReady = () => {
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  return !!(razorpayKey && razorpayKey !== 'your_razorpay_key_id' && isSupabaseConfigured());
};

export const initializeRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async () => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Payment system not configured. Please contact support.');
    }

    // Always use fixed amount - no parameter accepted
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-order`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        amount: SUBSCRIPTION_AMOUNT_PAISE, // Fixed 14000 paise (₹140)
        currency: 'INR'
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create order');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

export const processPayment = async (
  userDetails: { name: string; email: string; contact: string },
  onSuccess: (response: any) => void,
  onError: (error: any) => void
) => {
  try {
    // Check if Razorpay key is configured
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey || razorpayKey === 'your_razorpay_key_id') {
      throw new Error('Payment system not configured. Please contact support at MechMasterContact@gmail.com');
    }

    // Initialize Razorpay
    const isRazorpayLoaded = await initializeRazorpay();
    if (!isRazorpayLoaded) {
      throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
    }

    // Create order with fixed amount (only if Supabase is configured)
    let order;
    if (isSupabaseConfigured()) {
      order = await createRazorpayOrder();
    }

    const options: RazorpayOptions = {
      key: razorpayKey,
      amount: SUBSCRIPTION_AMOUNT_PAISE, // Fixed amount in paise
      currency: 'INR',
      name: 'MechMaster',
      description: `Annual Subscription - Exactly ₹${SUBSCRIPTION_AMOUNT} Only`,
      order_id: order?.id,
      handler: async (response) => {
        try {
          if (!isSupabaseConfigured()) {
            // Demo mode - simulate success
            onSuccess({ demo: true, message: 'Demo payment successful' });
            return;
          }

          // Verify payment on backend
          const verificationResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              expected_amount: SUBSCRIPTION_AMOUNT_PAISE, // Verify exact amount
            }),
          });

          if (verificationResponse.ok) {
            const result = await verificationResponse.json();
            onSuccess(result);
          } else {
            const errorData = await verificationResponse.json();
            throw new Error(errorData.error || 'Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          onError(error);
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.contact,
      },
      theme: {
        color: '#DC2626', // Red color matching your theme
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal closed by user');
        }
      },
      notes: {
        subscription_type: 'annual',
        amount_inr: SUBSCRIPTION_AMOUNT.toString(),
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error('Payment processing error:', error);
    onError(error);
  }
};

// Helper function to update user subscription after successful payment
export const updateUserSubscription = async (userId: string, paymentDetails: any) => {
  try {
    if (!isSupabaseConfigured()) {
      return true; // Demo mode
    }

    const subscriptionEndDate = new Date();
    subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1); // Add 1 year

    const { error } = await supabase
      .from('users')
      .update({
        subscription_status: 'active',
        subscription_start_date: new Date().toISOString(),
        subscription_end_date: subscriptionEndDate.toISOString(),
        razorpay_customer_id: paymentDetails.razorpay_payment_id,
        is_paid: true,
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return false;
  }
};

// Export the fixed amount for display purposes
export const getSubscriptionAmount = () => SUBSCRIPTION_AMOUNT;

// Utility function to format amount for display
export const formatAmount = (amount: number) => `₹${amount}`;

// Security function to validate amount (always returns false for non-140 amounts)
export const isValidAmount = (amount: number) => amount === SUBSCRIPTION_AMOUNT;