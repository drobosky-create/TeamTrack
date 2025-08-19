import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Tag, Percent, DollarSign, Calendar } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function AdminPromotionCodesPage() {
  const { toast } = useToast();
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
  const [formData, setFormData] = useState({
    code: '',
    percentOff: '',
    amountOff: '',
    maxRedemptions: '',
    expiresInDays: '30',
  });

  const createPromotionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/admin/create-promotion-code', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Promotion Code Created!",
        description: `Code "${data.promotionCode}" has been created successfully in Stripe.`,
      });
      // Reset form
      setFormData({
        code: '',
        percentOff: '',
        amountOff: '',
        maxRedemptions: '',
        expiresInDays: '30',
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create promotion code.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: any = {
      code: formData.code,
      maxRedemptions: formData.maxRedemptions ? parseInt(formData.maxRedemptions) : undefined,
      expiresInDays: parseInt(formData.expiresInDays),
    };

    if (discountType === 'percent') {
      payload.percentOff = parseFloat(formData.percentOff);
    } else {
      payload.amountOff = parseFloat(formData.amountOff);
    }

    createPromotionMutation.mutate(payload);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Stripe Promotion Code</CardTitle>
          <CardDescription>
            Create promotion codes that customers can use during Stripe Checkout.
            These codes will be created directly in your Stripe account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code Name */}
            <div className="space-y-2">
              <Label htmlFor="code">
                <Tag className="inline h-4 w-4 mr-1" />
                Promotion Code
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                placeholder="SAVE20"
                required
                className="uppercase"
                data-testid="input-promo-code"
              />
              <p className="text-sm text-gray-500">
                The code customers will enter (letters and numbers only)
              </p>
            </div>

            {/* Discount Type */}
            <div className="space-y-3">
              <Label>Discount Type</Label>
              <RadioGroup value={discountType} onValueChange={(value: any) => setDiscountType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percent" id="percent" />
                  <Label htmlFor="percent" className="font-normal cursor-pointer">
                    <Percent className="inline h-4 w-4 mr-1" />
                    Percentage Discount
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="amount" id="amount" />
                  <Label htmlFor="amount" className="font-normal cursor-pointer">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Fixed Amount Discount
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Discount Value */}
            {discountType === 'percent' ? (
              <div className="space-y-2">
                <Label htmlFor="percentOff">Percentage Off</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="percentOff"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.percentOff}
                    onChange={(e) => setFormData({ ...formData, percentOff: e.target.value })}
                    placeholder="20"
                    required
                    className="max-w-[100px]"
                    data-testid="input-percent-off"
                  />
                  <span className="text-gray-600">%</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="amountOff">Amount Off</Label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">$</span>
                  <Input
                    id="amountOff"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.amountOff}
                    onChange={(e) => setFormData({ ...formData, amountOff: e.target.value })}
                    placeholder="10.00"
                    required
                    className="max-w-[150px]"
                    data-testid="input-amount-off"
                  />
                  <span className="text-gray-600">USD</span>
                </div>
              </div>
            )}

            {/* Max Redemptions */}
            <div className="space-y-2">
              <Label htmlFor="maxRedemptions">
                Maximum Redemptions (Optional)
              </Label>
              <Input
                id="maxRedemptions"
                type="number"
                min="1"
                value={formData.maxRedemptions}
                onChange={(e) => setFormData({ ...formData, maxRedemptions: e.target.value })}
                placeholder="100"
                className="max-w-[150px]"
                data-testid="input-max-redemptions"
              />
              <p className="text-sm text-gray-500">
                Leave empty for unlimited uses
              </p>
            </div>

            {/* Expiration */}
            <div className="space-y-2">
              <Label htmlFor="expiresInDays">
                <Calendar className="inline h-4 w-4 mr-1" />
                Expires In (Days)
              </Label>
              <Input
                id="expiresInDays"
                type="number"
                min="1"
                value={formData.expiresInDays}
                onChange={(e) => setFormData({ ...formData, expiresInDays: e.target.value })}
                required
                className="max-w-[150px]"
                data-testid="input-expires-days"
              />
              <p className="text-sm text-gray-500">
                Number of days until this code expires
              </p>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={createPromotionMutation.isPending}
              className="w-full sm:w-auto"
              data-testid="button-create-promo"
            >
              {createPromotionMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating in Stripe...
                </>
              ) : (
                'Create Promotion Code'
              )}
            </Button>
          </form>

          {/* Example Codes */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Example Promotion Codes:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <code className="bg-white px-1 rounded">SAVE20</code> - 20% off</li>
              <li>• <code className="bg-white px-1 rounded">EARLY50</code> - 50% off for early adopters</li>
              <li>• <code className="bg-white px-1 rounded">PARTNER15</code> - 15% partner discount</li>
              <li>• <code className="bg-white px-1 rounded">LAUNCH100</code> - 100% off (free access)</li>
              <li>• <code className="bg-white px-1 rounded">BETA25</code> - 25% beta tester discount</li>
            </ul>
          </div>

          {/* Info Box */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-sm mb-2 text-yellow-800">Important Notes:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Promotion codes are created directly in your Stripe account</li>
              <li>• Customers enter these codes during Stripe Checkout</li>
              <li>• You can view and manage all codes in your Stripe Dashboard</li>
              <li>• Codes are automatically validated by Stripe during checkout</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}