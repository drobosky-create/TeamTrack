import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  ArrowRight, 
  Star, 
  Zap, 
  Building2,
  CheckCircle,
  TrendingUp,
  FileText,
  DollarSign
} from 'lucide-react';

export default function AssessmentSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Business Valuation Assessment
          </h1>
          <p className="text-xl text-gray-600">
            Get professional insights into your business value with our comprehensive assessment tools
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Free Assessment */}
          <Card className="relative border-2 hover:border-green-500 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Star className="h-8 w-8 text-yellow-500" />
                <Badge variant="secondary">Free</Badge>
              </div>
              <CardTitle>Free Assessment</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-3xl font-bold">$0</p>
                <p className="text-sm text-muted-foreground">One-time assessment</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">EBITDA calculation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Generic industry multiple</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Valuation range estimate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Overall business grade (A-F)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">AI executive summary</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Value improvement calculator</span>
                </li>
              </ul>

              <Link href="/assessments/free">
                <Button className="w-full gap-2">
                  Start Free Assessment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Growth Assessment */}
          <Card className="relative border-2 border-primary hover:shadow-xl transition-all">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-white">MOST POPULAR</Badge>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Zap className="h-8 w-8 text-primary" />
                <Badge>Growth</Badge>
              </div>
              <CardTitle>Growth Assessment</CardTitle>
              <CardDescription>Comprehensive analysis & insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-3xl font-bold">$497</p>
                <p className="text-sm text-muted-foreground">One-time payment</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm font-semibold">Everything in Free, plus:</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Industry-specific multipliers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">10 value driver deep analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Owner compensation adjustments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">30-minute consultation call</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">AI coaching recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">100% satisfaction guarantee</span>
                </li>
              </ul>

              <Link href="/assessments/growth">
                <Button className="w-full gap-2 bg-primary text-white hover:bg-primary/90">
                  Get Growth Assessment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Capital Assessment */}
          <Card className="relative border-2 hover:border-orange-500 transition-all hover:shadow-lg opacity-75">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Building2 className="h-8 w-8 text-orange-500" />
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <CardTitle>Capital Assessment</CardTitle>
              <CardDescription>For serious transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-3xl font-bold">Custom</p>
                <p className="text-sm text-muted-foreground">Contact for pricing</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-500">Full business audit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-500">50+ page detailed report</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-500">Transaction support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-500">M&A readiness assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-500">Dedicated advisor team</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-500">Exit strategy planning</span>
                </li>
              </ul>

              <Button className="w-full" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Note */}
        <div className="mt-12 text-center">
          <Card className="max-w-3xl mx-auto bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Not Sure Which to Choose?</h3>
              </div>
              <p className="text-sm text-gray-600">
                Start with our Free Assessment to get a baseline valuation. You can always upgrade to the Growth Assessment 
                for deeper insights and personalized recommendations based on your specific industry and business situation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}