import React from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, 
  TrendingUp, 
  Building2, 
  FileText, 
  Download, 
  Calendar,
  Star,
  AlertCircle
} from 'lucide-react';

export default function AssessmentResults() {
  const { id } = useParams();
  
  const { data: assessment, isLoading, error } = useQuery({
    queryKey: ['/api/assessments', id],
    queryFn: async () => {
      const response = await fetch(`/api/assessments/${id}`);
      if (!response.ok) throw new Error('Failed to fetch assessment');
      const data = await response.json();
      return data.assessment;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Unable to load assessment results. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-50';
      case 'B': return 'text-blue-600 bg-blue-50';
      case 'C': return 'text-yellow-600 bg-yellow-50';
      case 'D': return 'text-orange-600 bg-orange-50';
      case 'F': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Business Valuation Report</h1>
          <p className="text-muted-foreground">
            Assessment for {assessment.company} • {new Date(assessment.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Valuation Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Valuation Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Low Estimate</p>
                <p className="text-2xl font-bold text-muted-foreground">
                  {formatCurrency(assessment.lowEstimate)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Most Likely Value</p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(assessment.midEstimate)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">High Estimate</p>
                <p className="text-2xl font-bold text-muted-foreground">
                  {formatCurrency(assessment.highEstimate)}
                </p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Adjusted EBITDA</p>
                <p className="text-lg font-semibold">{formatCurrency(assessment.adjustedEbitda)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valuation Multiple</p>
                <p className="text-lg font-semibold">{assessment.valuationMultiple?.toFixed(1)}x</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Grade */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Overall Business Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className={`text-4xl font-bold px-6 py-4 rounded-lg ${getGradeColor(assessment.overallScore)}`}>
                {assessment.overallScore}
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Business Assessment Score</p>
                <p className="text-sm">
                  {assessment.overallScore === 'A' || assessment.overallScore === 'B' 
                    ? 'Your business demonstrates strong performance across key metrics and is well-positioned for growth.'
                    : assessment.overallScore === 'C'
                    ? 'Your business shows moderate performance with opportunities for improvement in several areas.'
                    : 'Your business has significant improvement opportunities that could enhance its value.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Value Drivers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Value Driver Analysis
            </CardTitle>
            <CardDescription>
              Individual assessment of key business factors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'Financial Performance', value: assessment.financialPerformance },
                { label: 'Customer Concentration', value: assessment.customerConcentration },
                { label: 'Management Team', value: assessment.managementTeam },
                { label: 'Competitive Position', value: assessment.competitivePosition },
                { label: 'Growth Prospects', value: assessment.growthProspects },
                { label: 'Systems & Processes', value: assessment.systemsProcesses },
                { label: 'Asset Quality', value: assessment.assetQuality },
                { label: 'Industry Outlook', value: assessment.industryOutlook },
                { label: 'Risk Factors', value: assessment.riskFactors },
                { label: 'Owner Dependency', value: assessment.ownerDependency },
              ].filter(item => item.value).map((driver, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">{driver.label}</span>
                  <Badge className={getGradeColor(driver.value)}>
                    Grade: {driver.value}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Executive Summary */}
        {assessment.narrativeSummary && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{assessment.narrativeSummary}</p>
            </CardContent>
          </Card>
        )}

        {/* Additional Details for Growth Tier */}
        {assessment.tier === 'growth' && assessment.executiveSummary && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Detailed Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm">{assessment.executiveSummary}</pre>
            </CardContent>
          </Card>
        )}

        {/* Company Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Company Name</p>
                <p className="font-medium">{assessment.company}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="font-medium">{assessment.industryDescription}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Founded</p>
                <p className="font-medium">{assessment.foundingYear}</p>
              </div>
              {assessment.naicsCode && (
                <div>
                  <p className="text-sm text-muted-foreground">NAICS Code</p>
                  <p className="font-medium">{assessment.naicsCode}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{assessment.firstName} {assessment.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{assessment.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="gap-2">
            <Download className="h-4 w-4" />
            Download Full Report (PDF)
          </Button>
          {assessment.followUpIntent !== 'no' && (
            <Button size="lg" variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Consultation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}