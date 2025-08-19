import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-700">Payment Successful!</CardTitle>
          <CardDescription>
            Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Thank you for your purchase. You should receive a confirmation email shortly.
          </p>
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/">Return to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/settings">View Account Settings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}