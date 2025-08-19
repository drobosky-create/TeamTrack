import React, { useEffect, useState } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Load Stripe outside of component
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceId: string;
  features: string[];
  popular?: boolean;
}

// Example subscription plans - replace with your actual plans
const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    description: 'Perfect for small teams',
    price: 29,
    priceId: 'price_basic_monthly', // Replace with your actual Stripe price ID
    features: [
      'Up to 10 team members',
      'Basic performance tracking',
      'Monthly reviews',
      'Email support'
    ]
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    description: 'For growing organizations',
    price: 79,
    priceId: 'price_professional_monthly', // Replace with your actual Stripe price ID
    features: [
      'Up to 50 team members',
      'Advanced analytics',
      'Custom review templates',
      'Quarterly & annual reviews',
      'Priority support'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    description: 'For large organizations',
    price: 199,
    priceId: 'price_enterprise_monthly', // Replace with your actual Stripe price ID
    features: [
      'Unlimited team members',
      'Advanced integrations',
      'Custom branding',
      'API access',
      'Dedicated support'
    ]
  }
];

interface SubscriptionFormProps {
  plan: SubscriptionPlan;
  onSuccess?: () => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ plan, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/subscription-success`,
        },
      });

      if (error) {
        toast({
          title: "Subscription Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Subscription Successful",
          description: `Welcome to ${plan.name}!`,
        });
        if (onSuccess) {
          onSuccess();
        } else {
          setLocation('/subscription-success');
        }
      }
    } catch (error: any) {
      toast({
        title: "Subscription Error",
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
        <div className="text-center">
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <p className="text-sm text-gray-600">{plan.description}</p>
          <div className="mt-2">
            <span className="text-3xl font-bold">${plan.price}</span>
            <span className="text-gray-600">/month</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Included features:</h4>
          <ul className="space-y-1">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <PaymentElement />
      
      <Button 
        type="submit" 
        disabled={!stripe || !elements || processing}
        className="w-full"
        data-testid="subscription-submit-button"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Subscribe for $${plan.price}/month`
        )}
      </Button>
    </form>
  );
};

interface SubscriptionPageProps {
  selectedPlanId?: string;
  onSuccess?: () => void;
}

export default function SubscriptionPage(props: any) {
  const { selectedPlanId, onSuccess } = props;
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    selectedPlanId ? SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || null : null
  );
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  // Query to get current subscription status
  const { data: subscriptionStatus } = useQuery({
    queryKey: [`/api/payments/subscription-status/${user?.id}`],
    enabled: !!user?.id,
  });

  // Type guard for subscription status
  const hasActiveSubscription = (subscriptionStatus as any)?.hasActiveSubscription || false;
  const subscription = (subscriptionStatus as any)?.subscription;

  // Mutation to create subscription
  const createSubscriptionMutation = useMutation({
    mutationFn: async (plan: SubscriptionPlan) => {
      const response = await apiRequest("POST", "/api/payments/create-subscription", {
        priceId: plan.priceId,
        customerEmail: user?.email,
        customerName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        userId: user?.id
      });
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      queryClient.invalidateQueries({ 
        queryKey: [`/api/payments/subscription-status/${user?.id}`] 
      });
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Setup Failed",
        description: error.message || "Failed to create subscription",
        variant: "destructive",
      });
    }
  });

  // Mutation to cancel subscription
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/payments/cancel-subscription", {
        subscriptionId: subscription?.id,
        userId: user?.id
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully.",
      });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/payments/subscription-status/${user?.id}`] 
      });
    },
    onError: (error: any) => {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    }
  });

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setLoading(true);
    await createSubscriptionMutation.mutateAsync(plan);
    setLoading(false);
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      cancelSubscriptionMutation.mutate();
    }
  };

  // Show current subscription status if user has active subscription
  if (hasActiveSubscription && subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Manage your active subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Badge variant="default" className="mb-2">Active</Badge>
              <p className="text-sm text-gray-600">
                Status: {subscription.status}
              </p>
              <p className="text-sm text-gray-600">
                Next billing: {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
              </p>
            </div>
            
            <Button 
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={cancelSubscriptionMutation.isPending}
              className="w-full"
              data-testid="cancel-subscription-button"
            >
              {cancelSubscriptionMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Subscription'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show subscription form if plan is selected and clientSecret is available
  if (selectedPlan && clientSecret) {
    const appearance = {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#003366',
      },
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Complete Subscription</CardTitle>
            <CardDescription>
              Secure payment powered by Stripe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret,
                appearance 
              }}
            >
              <SubscriptionForm 
                plan={selectedPlan}
                onSuccess={onSuccess}
              />
            </Elements>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show plan selection
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600">
            Select the perfect plan for your organization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'ring-2 ring-primary shadow-lg' : ''}`}
            >
              {plan.popular && (
                <Badge 
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                  variant="default"
                >
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handleSelectPlan(plan)}
                  disabled={loading || createSubscriptionMutation.isPending}
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  data-testid={`select-plan-${plan.id}`}
                >
                  {loading || createSubscriptionMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    'Select Plan'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}