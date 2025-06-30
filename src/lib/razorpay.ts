// Razorpay Integration for MechMaster
// This file handles payment processing with Razorpay
import { supabase } from './supabase';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const initializeRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount: number, currency = 'INR') => {
  try {
    // This would typically call your backend API to create a Razorpay order
    const response = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

export const processPayment = async (
  amount: number,
  userDetails: { name: string; email: string; contact: string },
  onSuccess: (response: any) => void,
  onError: (error: any) => void
) => {
  try {
    // Initialize Razorpay
    const isRazorpayLoaded = await initializeRazorpay();
    if (!isRazorpayLoaded) {
      throw new Error('Razorpay SDK failed to load');
    }

    // Create order (this would call your backend)
    const order = await createRazorpayOrder(amount * 100); // Convert to paise

    const options: RazorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_razorpay_key_id',
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'MechMaster',
      description: 'Annual Subscription - Mechanical Engineering Content',
      order_id: order.id,
      handler: async (response) => {
        try {
          // Verify payment on backend
          const verificationResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (verificationResponse.ok) {
            onSuccess(response);
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
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
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    onError(error);
  }
};

// Helper function to update user subscription after successful payment
export const updateUserSubscription = async (userId: string, paymentDetails: any) => {
  try {
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1); // Add 1 year

    const { error } = await supabase
      .from('users')
      .update({
        subscription_status: 'active',
        subscription_start_date: new Date().toISOString(),
        subscription_end_date: subscriptionEndDate.toISOString(),
        razorpay_customer_id: paymentDetails.razorpay_payment_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return false;
  }
};