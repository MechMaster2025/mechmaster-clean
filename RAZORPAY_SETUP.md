# Razorpay Integration Setup Guide

## Step 1: Create Razorpay Account

1. **Sign up at Razorpay:**
   - Go to https://dashboard.razorpay.com/signup
   - Use your business email
   - Complete KYC verification

2. **Business Details Required:**
   - PAN Card
   - Bank Account Details
   - Business Registration (if applicable)
   - GST Number (if applicable)

## Step 2: Get API Keys

1. **Test Mode (for development):**
   - Dashboard → Settings → API Keys
   - Generate Test Key ID and Secret
   - Use these for testing

2. **Live Mode (for production):**
   - Complete account activation
   - Generate Live Key ID and Secret
   - Use these for real payments

## Step 3: Add Environment Variables

Add to your `.env` file:
```
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_secret_key
```

## Step 4: Bank Account Setup

1. **Add Bank Account:**
   - Dashboard → Settings → Bank Account
   - Add your business bank account
   - Verify with micro-deposits

2. **Settlement Schedule:**
   - Choose T+2 or T+7 settlements
   - Set up automatic transfers

## Step 5: Webhook Configuration

1. **Set up webhooks:**
   - Dashboard → Settings → Webhooks
   - Add your server endpoint: `https://yourdomain.com/api/webhooks/razorpay`
   - Select events: `payment.captured`, `payment.failed`

## Step 6: Test Integration

1. **Test Cards:**
   - Card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date

2. **Test UPI:**
   - UPI ID: success@razorpay
   - Use for successful payments

## Step 7: Go Live

1. **Activate Account:**
   - Complete KYC verification
   - Submit required documents
   - Wait for approval (1-2 days)

2. **Switch to Live Keys:**
   - Replace test keys with live keys
   - Update webhook URLs
   - Test with small amount

## Important Notes

- **Fees:** 2% + GST on successful payments
- **Settlement:** T+2 days to your bank account
- **Support:** 24/7 chat support available
- **Compliance:** Automatic tax compliance included