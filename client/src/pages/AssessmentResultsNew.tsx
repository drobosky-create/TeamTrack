import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle,
  DollarSign,
  TrendingUp,
  Calendar,
  Trophy,
  ChevronRight,
  Download,
  Info
} from 'lucide-react';

export default function AssessmentResults() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [assessmentData, setAssessmentData] = useState<any>(null);

  useEffect(() => {
    // In production, fetch from API
    // For now, using mock data to demonstrate the structure
    setAssessmentData({
      id: id,
      adjustedEbitda: 4500000,
      valuationMultiple: 4.2,
      lowEstimate: 15100000,
      midEstimate: 18900000,
      highEstimate: 22700000,
      overallGrade: 'C',
      executiveSummary: `Executive Summary shows an adjusted EBITDA of $4,504,494 with an estimated valuation of $18,918,875. Based on your Operational Grade of C ("Average Operations"), a multiplier of 4.2x was applied to your Adjusted EBITDA to generate the valuation estimate. The analysis indicates C overall performance across key business drivers.`,
      valueDrivers: {
        financialPerformance: 'C',
        customerConcentration: 'C',
        managementTeamStrength: 'C',
        competitivePosition: 'C',
        growthProspects: 'C',
        systemsProcesses: 'C',
        assetQuality: 'C',
        industryOutlook: 'C',
        riskFactors: 'C',
        ownerDependency: 'C',
      }
    });
  }, [id]);

  if (!assessmentData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-700 border-green-500';
      case 'B': return 'bg-blue-100 text-blue-700 border-blue-500';
      case 'C': return 'bg-yellow-100 text-yellow-700 border-yellow-500';
      case 'D': return 'bg-orange-100 text-orange-700 border-orange-500';
      case 'F': return 'bg-red-100 text-red-700 border-red-500';
      default: return 'bg-gray-100 text-gray-700 border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold">Your Business Valuation Results</h1>
          </div>
          <p className="text-muted-foreground">
            Professional analysis complete - here's what your business is worth
          </p>
        </div>

        {/* Valuation Range Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Estimated Business Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm opacity-80 mb-2">Conservative</p>
                <p className="text-3xl font-bold">
                  ${(assessmentData.lowEstimate / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="scale-110">
                <p className="text-sm opacity-80 mb-2">Most Likely Value</p>
                <p className="text-4xl font-bold text-cyan-300">
                  ${(assessmentData.midEstimate / 1000000).toFixed(1)}M
                </p>
              </div>
              <div>
                <p className="text-sm opacity-80 mb-2">Optimistic</p>
                <p className="text-3xl font-bold">
                  ${(assessmentData.highEstimate / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button 
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white gap-2"
                onClick={() => setLocation(`/value-improvement/${id}`)}
              >
                Explore Improvements
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 gap-2"
                onClick={() => setLocation('/consultation-booking')}
              >
                <Calendar className="h-4 w-4" />
                Schedule Consultation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Adjusted EBITDA:</span>
                <span className="font-bold text-lg">
                  ${(assessmentData.adjustedEbitda / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Valuation Multiple:</span>
                <span className="font-bold text-lg">
                  {assessmentData.valuationMultiple}x
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Overall Business Grade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Overall Business Grade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className={`
                  w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-2
                  ${getGradeColor(assessmentData.overallGrade)}
                `}>
                  {assessmentData.overallGrade}
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Average Performance</p>
                  <p className="text-sm text-muted-foreground">
                    Your business shows average operational performance with opportunities for improvement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Executive Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>AI Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {assessmentData.executiveSummary}
            </p>
          </CardContent>
        </Card>

        {/* Value Drivers Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Business Value Drivers Analysis</CardTitle>
            <CardDescription>
              Interactive visualization of your business performance across key value drivers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                💡 Click on any grade card below to see detailed insights
              </AlertDescription>
            </Alert>
            
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(assessmentData.valueDrivers).map(([key, grade]) => {
                const labels: Record<string, string> = {
                  financialPerformance: 'Financial Performance',
                  customerConcentration: 'Customer Concentration',
                  managementTeamStrength: 'Management Team Strength',
                  competitivePosition: 'Competitive Position',
                  growthProspects: 'Growth Prospects',
                  systemsProcesses: 'Systems & Processes',
                  assetQuality: 'Asset Quality',
                  industryOutlook: 'Industry Outlook',
                  riskFactors: 'Risk Factors',
                  ownerDependency: 'Owner Dependency',
                };
                
                return (
                  <div 
                    key={key}
                    className="flex items-center justify-between p-3 rounded-lg border hover:shadow-md transition-all cursor-pointer"
                  >
                    <span className="text-sm font-medium">{labels[key]}</span>
                    <Badge 
                      variant="outline"
                      className={`${getGradeColor(grade as string)} px-3 py-1`}
                    >
                      {grade as string}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            className="gap-2"
            onClick={() => setLocation(`/value-improvement/${id}`)}
          >
            <TrendingUp className="h-4 w-4" />
            View Value Improvement Calculator
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download Full Report (PDF)
          </Button>
        </div>
      </div>
    </div>
  );
}