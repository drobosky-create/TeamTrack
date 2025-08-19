import React, { useEffect, useState } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { useLocation, Link } from "wouter";
import { Box, Typography, Container } from '@mui/material';

// Load Stripe outside of component to avoid recreating on every render
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const AppleBitesCheckoutForm: React.FC<{ originalAmount: number; finalAmount: number; couponApplied: string }> = ({ 
  originalAmount, 
  finalAmount, 
  couponApplied 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [processing, setProcessing] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/consumer-signup?payment=success&plan=growth`,
          payment_method_data: {
            billing_details: {
              email: customerEmail,
              name: customerName,
            },
          },
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Store customer info in session storage for prefilling
        sessionStorage.setItem('applebites_purchase', JSON.stringify({
          email: customerEmail,
          name: customerName,
          plan: 'growth',
          paymentIntentId: paymentIntent.id,
        }));
        
        toast({
          title: "Payment Successful",
          description: "Redirecting to complete your AppleBites registration...",
        });
        
        // Redirect to consumer signup with success params
        setTimeout(() => {
          setLocation('/consumer-signup?payment=success&plan=growth');
        }, 1500);
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="input-customer-name"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="input-customer-email"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Plan:</span>
            <span className="text-lg font-bold text-blue-600">Growth & Exit</span>
          </div>
          {couponApplied && originalAmount !== finalAmount && (
            <>
              <div className="flex justify-between items-center text-gray-500 line-through">
                <span className="text-sm">Original Price:</span>
                <span className="text-lg">${originalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-green-600 mb-1">
                <span className="text-sm font-medium">Discount ({couponApplied}):</span>
                <span className="text-lg">-${(originalAmount - finalAmount).toFixed(2)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Total Amount:</span>
            <span className="text-2xl font-bold">${finalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <PaymentElement />
      
      <Button 
        type="submit" 
        disabled={!stripe || !elements || processing || !customerEmail || !customerName}
        className="w-full bg-blue-600 hover:bg-blue-700"
        data-testid="button-submit-payment"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Complete Purchase - $${finalAmount.toFixed(2)}`
        )}
      </Button>
    </form>
  );
};

export default function AppleBitesCheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [originalAmount] = useState(795);
  const [finalAmount, setFinalAmount] = useState(795);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const { toast } = useToast();

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Invalid Coupon",
        description: "Please enter a coupon code.",
        variant: "destructive",
      });
      return;
    }

    setApplyingCoupon(true);
    
    // Validate coupon code
    try {
      const response = await apiRequest("POST", "/api/payments/validate-coupon", {
        couponCode: couponCode.toUpperCase(),
        amount: originalAmount,
      });
      const data = await response.json();

      if (data.valid) {
        const discountedAmount = data.finalAmount;
        setFinalAmount(discountedAmount);
        setAppliedCoupon(couponCode.toUpperCase());
        
        // Create new payment intent with discounted amount
        const paymentResponse = await apiRequest("POST", "/api/payments/create-payment-intent", { 
          amount: discountedAmount,
          metadata: {
            product: 'applebites_growth',
            description: 'AppleBites Growth & Exit Plan',
            coupon: couponCode.toUpperCase(),
            originalAmount: originalAmount,
          }
        });
        const paymentData = await paymentResponse.json();
        
        setClientSecret(paymentData.clientSecret);
        
        toast({
          title: "Coupon Applied!",
          description: `${data.discountPercent}% discount applied. New total: $${discountedAmount.toFixed(2)}`,
        });
      } else {
        toast({
          title: "Invalid Coupon",
          description: data.message || "This coupon code is not valid.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply coupon. Please try again.",
        variant: "destructive",
      });
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = async () => {
    setFinalAmount(originalAmount);
    setAppliedCoupon("");
    setCouponCode("");
    
    // Create new payment intent with original amount
    try {
      const response = await apiRequest("POST", "/api/payments/create-payment-intent", { 
        amount: originalAmount,
        metadata: {
          product: 'applebites_growth',
          description: 'AppleBites Growth & Exit Plan'
        }
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
      
      toast({
        title: "Coupon Removed",
        description: "Original price restored.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove coupon. Please refresh and try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Create initial PaymentIntent for AppleBites Growth plan
    apiRequest("POST", "/api/payments/create-payment-intent", { 
      amount: originalAmount,
      metadata: {
        product: 'applebites_growth',
        description: 'AppleBites Growth & Exit Plan'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
        toast({
          title: "Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      });
  }, [toast, originalAmount]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Link href="/applebites">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Plans
          </Button>
        </Link>

        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="text-2xl">AppleBites Growth & Exit Plan</CardTitle>
            <CardDescription className="text-blue-100">
              Complete your purchase to unlock comprehensive business valuation tools
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6 space-y-2">
              <Typography variant="h6" className="font-semibold mb-3">
                What's Included:
              </Typography>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Everything in Free Plan
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  60-Minute Deep Dive Call with Expert
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Private Equity Scorecard Analysis
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Professional Opinion of Valuation
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Enterprise Value Estimator Tool
                </li>
              </ul>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : clientSecret ? (
              <>
                {/* Coupon Code Section */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <Typography variant="subtitle2" className="font-semibold mb-2">
                    Have a discount code?
                  </Typography>
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={applyingCoupon}
                        data-testid="input-coupon-code"
                      />
                      <Button 
                        onClick={applyCoupon}
                        disabled={applyingCoupon || !couponCode.trim()}
                        variant="outline"
                        className="min-w-[100px]"
                        data-testid="button-apply-coupon"
                      >
                        {applyingCoupon ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">
                          {appliedCoupon} applied - ${(originalAmount - finalAmount).toFixed(2)} off
                        </span>
                      </div>
                      <Button
                        onClick={removeCoupon}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        data-testid="button-remove-coupon"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

                <Elements stripe={stripePromise} options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#2563eb',
                    },
                  },
                }}>
                  <AppleBitesCheckoutForm 
                    originalAmount={originalAmount}
                    finalAmount={finalAmount}
                    couponApplied={appliedCoupon}
                  />
                </Elements>
              </>
            ) : (
              <div className="text-center py-8 text-red-600">
                Unable to initialize payment. Please refresh and try again.
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}