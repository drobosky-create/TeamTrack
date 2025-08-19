import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Crown } from "lucide-react";
import { Link } from "wouter";

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <div className="relative">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <Crown className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-700">Welcome to Premium!</CardTitle>
          <CardDescription>
            Your subscription is now active and ready to use.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">What's Next?</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Access to all premium features</li>
              <li>• Priority customer support</li>
              <li>• Advanced analytics and reporting</li>
              <li>• Custom integrations</li>
            </ul>
          </div>
          
          <p className="text-sm text-gray-600">
            You'll receive a confirmation email with your subscription details and invoice.
          </p>
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/">Explore Premium Features</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/settings">Manage Subscription</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}