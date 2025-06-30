import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// SECURITY: Valid payment amount
const VALID_AMOUNT = 14000; // ₹140 in paise

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      expected_amount 
    } = await req.json()

    // SECURITY: Verify expected amount
    if (expected_amount !== VALID_AMOUNT) {
      throw new Error('Invalid payment amount')
    }

    // Verify Razorpay signature
    const crypto = await import('node:crypto')
    const expectedSignature = crypto
      .createHmac('sha256', Deno.env.get('RAZORPAY_KEY_SECRET')!)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      throw new Error('Invalid payment signature')
    }

    // Fetch payment details from Razorpay to verify amount
    const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
      headers: {
        'Authorization': `Basic ${btoa(Deno.env.get('RAZORPAY_KEY_ID') + ':' + Deno.env.get('RAZORPAY_KEY_SECRET'))}`,
      },
    })

    if (!paymentResponse.ok) {
      throw new Error('Failed to verify payment with Razorpay')
    }

    const paymentData = await paymentResponse.json()

    // CRITICAL: Verify the actual paid amount
    if (paymentData.amount !== VALID_AMOUNT) {
      throw new Error(`Payment amount mismatch. Expected ₹140, got ₹${paymentData.amount / 100}`)
    }

    // Verify payment status
    if (paymentData.status !== 'captured') {
      throw new Error('Payment not captured')
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Update user subscription
    const subscriptionEndDate = new Date()
    subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1)

    const { error } = await supabase
      .from('users')
      .update({
        subscription_status: 'active',
        subscription_start_date: new Date().toISOString(),
        subscription_end_date: subscriptionEndDate.toISOString(),
        razorpay_customer_id: razorpay_payment_id,
        is_paid: true,
      })
      .eq('id', user.id)

    if (error) throw error

    // Log successful payment
    console.log(`Payment verified: User ${user.id} paid ₹${paymentData.amount / 100}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment verified and subscription activated',
        payment_id: razorpay_payment_id,
        amount_paid: paymentData.amount / 100,
        subscription_valid_until: subscriptionEndDate.toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        code: 'PAYMENT_VERIFICATION_FAILED'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})