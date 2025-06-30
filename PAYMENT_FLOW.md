# MechMaster Payment Flow - Fixed ₹140 Only

## What Users Experience:

### Step 1: User clicks "Subscribe Now"
- Sees: "Pay Exactly ₹140 - Subscribe Now" button
- No amount input field - completely locked

### Step 2: Payment Gateway Opens
- **Razorpay Modal appears with:**
  - Merchant: "MechMaster" (or your registered name)
  - Amount: ₹140.00 (fixed, cannot be changed)
  - Description: "Annual Subscription - ₹140 Only"

### Step 3: Payment Methods
- **UPI**: User gets message "Pay ₹140 to MechMaster"
- **Cards**: Shows ₹140.00 fixed amount
- **Net Banking**: Shows ₹140.00 fixed amount
- **Wallets**: Shows ₹140.00 fixed amount

### Step 4: UPI Payment Example
```
📱 UPI Payment Request
To: MechMaster
Amount: ₹140.00
Reference: Annual Subscription
```

## Security Measures:

### Frontend Protection:
- ❌ No amount input fields
- ❌ No way to modify price
- ✅ Amount hardcoded in all components

### Backend Protection:
- ✅ Server validates exact ₹140 (14000 paise)
- ✅ Rejects any other amount
- ✅ Double verification with Razorpay

### Payment Gateway Protection:
- ✅ Order created with fixed ₹140 only
- ✅ Razorpay enforces the order amount
- ✅ Cannot be modified after creation

## What Happens if Someone Tries to Pay Wrong Amount:

### Scenario 1: User tries to modify frontend
- **Result**: Impossible - no input fields exist

### Scenario 2: Developer tries direct API call
- **Server Response**: "Invalid amount. Only ₹140 is allowed."
- **Payment**: Rejected before reaching Razorpay

### Scenario 3: Payment with different amount
- **Verification**: Fails - "Expected ₹140, got ₹X"
- **Subscription**: Not activated
- **User Status**: Remains free user

## Bank Statement Appearance:

### For Your Bank Account:
```
Credit: ₹140.00
From: Razorpay Payments
Ref: MechMaster Subscription
```

### For User's Bank/UPI:
```
Debit: ₹140.00
To: MechMaster (or your registered name)
Ref: Annual Subscription
```