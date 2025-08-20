import React, { useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import ValuationResults from '@/modules/applebites/components/valuation-results';
import StrategicReport from '@/modules/applebites/components/strategic-report';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'wouter';

interface Assessment {
  id: number;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  adjustedEbitda: string;
  midEstimate: string;
  lowEstimate: string;
  highEstimate: string;
  valuationMultiple: string;
  overallScore: string;
  tier: string;
  reportTier: string;
  createdAt: string;
  narrativeSummary?: string;
  executiveSummary?: string;
  baseEbitda?: string;
}

export default function AssessmentResultsPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const assessmentId = params.id;

  // Fetch assessment details
  const { data: assessmentData, isLoading, error } = useQuery({
    queryKey: [`/api/assessments/${assessmentId}`],
    enabled: !!assessmentId,
  });

  // Redirect if no assessment ID
  useEffect(() => {
    if (!assessmentId) {
      setLocation('/past-assessments');
    }
  }, [assessmentId, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading assessment results...</p>
        </div>
      </div>
    );
  }

  if (error || !assessmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load assessment results</p>
          <Link href="/past-assessments">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessments
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const assessment = assessmentData.success ? assessmentData.assessment : assessmentData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/past-assessments">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessments
            </Button>
          </Link>
          <div className="text-sm text-gray-600">
            Assessment Date: {new Date(assessment.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Results Component - Show Strategic Report for paid tiers */}
      <div className="py-8">
        {assessment?.tier === 'growth' || assessment?.tier === 'capital' ? (
          <StrategicReport results={assessment} />
        ) : (
          <ValuationResults results={assessment} />
        )}
      </div>
    </div>
  );
}