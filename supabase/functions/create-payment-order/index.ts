import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// FIXED SUBSCRIPTION AMOUNT - SECURITY CHECK
const VALID_AMOUNT = 14000; // ₹140 in paise

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency = 'INR' } = await req.json()

    // SECURITY: Verify amount is exactly ₹140
    if (amount !== VALID_AMOUNT) {
      throw new Error(`Invalid amount. Only ₹140 (${VALID_AMOUNT} paise) is allowed.`)
    }

    // Create Razorpay order with verified amount
    const orderData = {
      amount: VALID_AMOUNT, // Force correct amount
      currency: currency,
      receipt: `mechmaster_${Date.now()}`,
      notes: {
        subscription: 'MechMaster Annual Subscription',
        amount_inr: '140',
        plan: 'annual'
      }
    }

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(Deno.env.get('RAZORPAY_KEY_ID') + ':' + Deno.env.get('RAZORPAY_KEY_SECRET'))}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Razorpay API Error: ${errorData.error?.description || 'Unknown error'}`)
    }

    const order = await response.json()

    // Double-check the order amount
    if (order.amount !== VALID_AMOUNT) {
      throw new Error('Order amount mismatch')
    }

    return new Response(
      JSON.stringify(order),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Payment order creation error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        code: 'PAYMENT_ORDER_FAILED'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})