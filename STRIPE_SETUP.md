# Stripe Setup Instructions for AppleBites

## Overview
AppleBites uses Stripe Checkout Sessions for payment processing. All coupon/promotion code management is done directly in the Stripe Dashboard.

## Required Environment Variables
- `VITE_STRIPE_PUBLIC_KEY` - Your Stripe publishable key (starts with `pk_`)
- `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with `sk_`)

## Payment Flow
1. Customer clicks "Access Now - $795" on AppleBites landing page
2. Redirected to checkout preview page with product details
3. Clicks "Proceed to Secure Checkout" 
4. Redirected to Stripe's hosted checkout page
5. Customer can enter promotion codes on Stripe's checkout page
6. After successful payment, redirected back to consumer signup with prefilled data

## Creating Promotion Codes in Stripe

### Step 1: Log into Stripe Dashboard
Go to https://dashboard.stripe.com

### Step 2: Create a Coupon
1. Navigate to **Products** → **Coupons**
2. Click **"+ New"** button
3. Configure the coupon:
   - **Type**: Choose "Percentage discount" or "Fixed amount discount"
   - **Value**: Enter discount percentage (e.g., 20) or amount (e.g., $10.00)
   - **Duration**: Select "Once" for one-time payments
   - **Name**: Internal name for the coupon (not shown to customers)
4. Click **"Create coupon"**

### Step 3: Create Promotion Codes
1. After creating the coupon, click on it to view details
2. In the "Promotion codes" section, click **"+ Create promotion code"**
3. Configure the promotion code:
   - **Code**: Enter the code customers will use (e.g., SAVE20, FOUNDERS, BETA25)
   - **Max redemptions**: Set a limit or leave blank for unlimited
   - **Expiration**: Set when the code expires
   - **First-time customers**: Check if you want to limit to new customers only
   - **Minimum order amount**: Set if you want a minimum purchase requirement
4. Click **"Create promotion code"**

### Example Promotion Codes
- `FOUNDERS` - For founding members
- `SAVE20` - 20% discount
- `EARLY50` - 50% early bird discount
- `PARTNER15` - 15% partner discount
- `BETA25` - 25% beta tester discount

## Testing Promotion Codes
1. Go through the checkout flow
2. On Stripe's checkout page, look for "Add promotion code" link
3. Enter your promotion code
4. The discount will be applied automatically

## Viewing Analytics
In Stripe Dashboard:
- **Payments** → View all successful transactions
- **Products** → **Coupons** → View redemption statistics
- **Reports** → Generate detailed reports on coupon usage

## Important Notes
- All coupon validation is handled by Stripe automatically
- Customers see the discount applied in real-time on Stripe's checkout page
- You can pause or delete promotion codes anytime from Stripe Dashboard
- Stripe handles all edge cases (expired codes, max redemptions, etc.)

## Support
For Stripe-specific issues, contact Stripe Support at https://support.stripe.com