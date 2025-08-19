import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle, Navigation } from "lucide-react";
import { Link } from "wouter";

export default function NavigationTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AppleBites Navigation Test
          </h1>
          <p className="text-lg text-gray-600">
            Verify that all AppleBites navigation links are working correctly
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Current Navigation Setup */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <CardTitle>Current Navigation Setup</CardTitle>
              </div>
              <CardDescription>
                All AppleBites buttons should link to the correct landing page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <strong>✓ PerformanceHub Landing:</strong>
                  <p className="text-sm text-gray-600">
                    Header and hero buttons link to <code>/applebites</code>
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <strong>✓ Route Configuration:</strong>
                  <p className="text-sm text-gray-600">
                    <code>/applebites</code> → <code>AppleBitesLanding</code> component
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <strong>✓ Consumer Auth:</strong>
                  <p className="text-sm text-gray-600">
                    Logo links back to <code>/applebites</code>
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <strong>✓ Free Assessment:</strong>
                  <p className="text-sm text-gray-600">
                    "Back to AppleBites Home" links to <code>/applebites</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Navigation Links */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Navigation className="h-6 w-6 text-blue-500" />
                <CardTitle>Test Navigation</CardTitle>
              </div>
              <CardDescription>
                Click these links to verify navigation is working
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link href="/applebites">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    AppleBites Landing Page
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/performance-hub">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    PerformanceHub Landing
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/consumer-auth">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Consumer Authentication
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/consumer-signup">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Consumer Signup
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/assessments/free">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Free Assessment
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Flow Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Navigation Flow</CardTitle>
            <CardDescription>
              How users navigate through the AppleBites ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <strong>Entry Points:</strong> Users can reach AppleBites from:
                  <ul className="text-sm text-gray-600 mt-1 ml-4">
                    <li>• PerformanceHub landing page buttons</li>
                    <li>• Direct URL: <code>/applebites</code></li>
                    <li>• Navigation headers throughout the app</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <strong>AppleBites Landing:</strong> Users see business valuation platform overview
                  <ul className="text-sm text-gray-600 mt-1 ml-4">
                    <li>• "Start Free Assessment" → <code>/consumer-signup</code></li>
                    <li>• "Sign In" → <code>/consumer-login</code></li>
                    <li>• "Team Portal" → <code>/performance-hub</code></li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <strong>Assessment Flow:</strong> After signup/login, users access:
                  <ul className="text-sm text-gray-600 mt-1 ml-4">
                    <li>• Free Assessment</li>
                    <li>• Growth Assessment (paid)</li>
                    <li>• Capital Assessment (premium)</li>
                    <li>• Results and recommendations</li>
                  </ul>
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