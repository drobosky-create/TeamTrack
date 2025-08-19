import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Crown, Zap } from "lucide-react";
import { Link } from "wouter";

export default function PaymentDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Stripe Payment Integration Demo
          </h1>
          <p className="text-lg text-gray-600">
            Test the comprehensive Stripe payment system built for PerformanceHub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* One-time Payment Demo */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-6 w-6 text-blue-500" />
                <CardTitle>One-time Payment</CardTitle>
              </div>
              <CardDescription>
                Test the checkout flow for single purchases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Features:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Secure payment processing with Stripe</li>
                  <li>• Payment intent creation and confirmation</li>
                  <li>• Success/failure handling</li>
                  <li>• Payment metadata tracking</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/checkout">Try $10.00 Payment</Link>
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Uses Stripe test mode - no real charges
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Demo */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Crown className="h-6 w-6 text-purple-500" />
                <CardTitle>Subscription Management</CardTitle>
              </div>
              <CardDescription>
                Test the recurring billing and subscription flow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Features:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Multiple subscription tiers</li>
                  <li>• Customer and subscription management</li>
                  <li>• Subscription status tracking</li>
                  <li>• Cancel/modify subscription</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/subscription">View Plans</Link>
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Uses Stripe test mode - no real charges
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Implementation Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              <CardTitle>Technical Implementation</CardTitle>
            </div>
            <CardDescription>
              Comprehensive Stripe integration details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Backend Features</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Payment Intent API for one-time payments</li>
                  <li>• Subscription creation and management</li>
                  <li>• Customer record synchronization</li>
                  <li>• Webhook event handling</li>
                  <li>• Secure API key management</li>
                  <li>• Payment status validation</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Frontend Features</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• React Stripe Elements integration</li>
                  <li>• Responsive payment forms</li>
                  <li>• Loading states and error handling</li>
                  <li>• Success/failure page flows</li>
                  <li>• Real-time payment processing</li>
                  <li>• Mobile-optimized design</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">API Endpoints</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Payment Intent:</strong>
                  <code className="block text-xs bg-blue-100 px-2 py-1 rounded mt-1">
                    POST /api/payments/create-payment-intent
                  </code>
                </div>
                <div>
                  <strong>Create Subscription:</strong>
                  <code className="block text-xs bg-blue-100 px-2 py-1 rounded mt-1">
                    POST /api/payments/create-subscription
                  </code>
                </div>
                <div>
                  <strong>Cancel Subscription:</strong>
                  <code className="block text-xs bg-blue-100 px-2 py-1 rounded mt-1">
                    POST /api/payments/cancel-subscription
                  </code>
                </div>
                <div>
                  <strong>Subscription Status:</strong>
                  <code className="block text-xs bg-blue-100 px-2 py-1 rounded mt-1">
                    GET /api/payments/subscription-status/:id
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}