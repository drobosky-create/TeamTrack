import React, { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, CreditCard, ShieldCheck, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Box, Typography, Container } from '@mui/material';

export default function AppleBitesCheckoutPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      // Create a Stripe Checkout Session
      const response = await apiRequest("POST", "/api/payments/create-checkout-session", {
        productName: 'AppleBites Growth & Exit Plan',
        amount: 795,
        successUrl: `${window.location.origin}/consumer-signup?payment=success&plan=growth`,
        cancelUrl: `${window.location.origin}/applebites`
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #e8f5e9, white)', py: 4 }}>
      <Container maxWidth="md">
        <div className="mb-6">
          <Link href="/applebites">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to AppleBites
            </Button>
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Complete Your Purchase</CardTitle>
            <CardDescription>
              AppleBites Growth & Exit Plan - One-time payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product Details */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
              <Typography variant="h6" className="font-bold mb-4">
                What's Included:
              </Typography>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Complete business valuation assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Growth strategy recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Exit planning tools and resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Value improvement calculator</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Professional valuation report</span>
                </li>
              </ul>
            </div>

            {/* Price Display */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Plan:</span>
                <span className="text-lg font-bold text-blue-600">Growth & Exit</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Amount:</span>
                <span className="text-2xl font-bold">$795.00</span>
              </div>
              <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                <p className="text-sm text-gray-600">
                  <ShieldCheck className="inline h-4 w-4 text-green-600 mr-1" />
                  You can enter a promotion code on the next page
                </p>
              </div>
            </div>

            {/* Checkout Button */}
            <Button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              data-testid="button-proceed-to-checkout"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redirecting to Stripe...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Secure Checkout
                  <ExternalLink className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {/* Security Badge */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">
                Secure payment powered by Stripe
              </p>
              <div className="flex justify-center gap-2">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                  alt="Stripe" 
                  className="h-8"
                />
              </div>
              <p className="text-xs text-gray-400">
                Your payment information is encrypted and secure. We never store your card details.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <div className="mt-6 max-w-2xl mx-auto">
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="py-4">
              <Typography variant="subtitle2" className="font-semibold mb-2">
                How the checkout process works:
              </Typography>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Click "Proceed to Secure Checkout" above</li>
                <li>2. You'll be redirected to Stripe's secure checkout page</li>
                <li>3. Enter your payment details and any promotion codes</li>
                <li>4. Complete the purchase</li>
                <li>5. You'll be redirected back to create your AppleBites account</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Box>
  );
}