import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Trophy,
  Target,
  AlertCircle,
  ChevronRight,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Sparkles
} from 'lucide-react';

interface GradeImpact {
  grade: string;
  label: string;
  multiple: number;
  value: number;
  improvement: number;
  color: string;
}

export default function ValueImprovementCalculator() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>('C');
  
  // Mock data - replace with actual API call
  useEffect(() => {
    // In production, fetch assessment data from API
    setAssessmentData({
      adjustedEbitda: 4500000,
      currentGrade: 'C',
      currentMultiple: 4.2,
      currentValue: 18900000,
    });
  }, [id]);

  const gradeImpacts: GradeImpact[] = [
    { 
      grade: 'F', 
      label: 'Poor Operations', 
      multiple: 2.0, 
      value: assessmentData?.adjustedEbitda * 2 || 0,
      improvement: -52,
      color: 'bg-red-100 border-red-500 text-red-700'
    },
    { 
      grade: 'D', 
      label: 'Below Average', 
      multiple: 3.0, 
      value: assessmentData?.adjustedEbitda * 3 || 0,
      improvement: -29,
      color: 'bg-orange-100 border-orange-500 text-orange-700'
    },
    { 
      grade: 'C', 
      label: 'Average Operations', 
      multiple: 4.2, 
      value: assessmentData?.adjustedEbitda * 4.2 || 0,
      improvement: 0,
      color: 'bg-yellow-100 border-yellow-500 text-yellow-700'
    },
    { 
      grade: 'B', 
      label: 'Good Operations', 
      multiple: 5.7, 
      value: assessmentData?.adjustedEbitda * 5.7 || 0,
      improvement: 36,
      color: 'bg-blue-100 border-blue-500 text-blue-700'
    },
    { 
      grade: 'A', 
      label: 'Excellent Operations', 
      multiple: 7.5, 
      value: assessmentData?.adjustedEbitda * 7.5 || 0,
      improvement: 79,
      color: 'bg-green-100 border-green-500 text-green-700'
    },
  ];

  const currentGradeData = gradeImpacts.find(g => g.grade === assessmentData?.currentGrade);
  const selectedGradeData = gradeImpacts.find(g => g.grade === selectedGrade);

  if (!assessmentData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">Value Improvement Calculator</h1>
          <p className="text-muted-foreground">
            Explore how improving your operational grades affects your business valuation
          </p>
        </div>

        {/* Current Grade Display */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle>Your Current Operational Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className={`
                  w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold
                  ${currentGradeData?.color}
                `}>
                  <Trophy className="absolute h-12 w-12 opacity-20" />
                  {assessmentData.currentGrade}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Current Performance Level</p>
              </div>
              
              <div className="text-left space-y-2">
                <p className="text-sm text-muted-foreground">This gauge shows your overall operational performance based on your assessment.</p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-2xl font-bold">${(assessmentData.currentValue / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-muted-foreground">Current Value</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{assessmentData.currentMultiple}x</p>
                    <p className="text-sm text-muted-foreground">EBITDA Multiple</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grade Impact Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Click any grade to see how operational improvements impact your business value
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {gradeImpacts.map((impact) => {
              const isSelected = selectedGrade === impact.grade;
              const isCurrent = assessmentData.currentGrade === impact.grade;
              
              return (
                <Card
                  key={impact.grade}
                  className={`
                    cursor-pointer transition-all hover:shadow-lg
                    ${isSelected ? 'ring-2 ring-primary' : ''}
                    ${isCurrent ? 'border-2' : ''}
                  `}
                  onClick={() => setSelectedGrade(impact.grade)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge 
                        className={impact.color}
                        variant="outline"
                      >
                        {impact.grade}
                      </Badge>
                      {isCurrent && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-sm">{impact.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">EBITDA Multiple</p>
                        <p className="text-lg font-bold">{impact.multiple}x</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Valuation</p>
                        <p className="text-lg font-bold">${(impact.value / 1000000).toFixed(1)}M</p>
                      </div>
                      {impact.improvement !== 0 && (
                        <div className="flex items-center gap-1">
                          {impact.improvement > 0 ? (
                            <ArrowUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <ArrowDown className="h-3 w-3 text-red-600" />
                          )}
                          <span className={`text-xs font-semibold ${
                            impact.improvement > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {impact.improvement > 0 ? '+' : ''}{impact.improvement}%
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Selected Grade Analysis */}
        {selectedGradeData && selectedGrade !== assessmentData.currentGrade && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                What if you improved to Grade {selectedGrade}?
              </CardTitle>
              <CardDescription>
                Potential value based on {selectedGradeData.label.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Current Value</p>
                  <p className="text-2xl font-bold">
                    ${(assessmentData.currentValue / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Potential Value</p>
                  <p className="text-2xl font-bold text-primary">
                    ${(selectedGradeData.value / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Value Increase</p>
                  <p className={`text-2xl font-bold ${
                    selectedGradeData.value > assessmentData.currentValue ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedGradeData.value > assessmentData.currentValue ? '+' : ''}
                    ${((selectedGradeData.value - assessmentData.currentValue) / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Coaching CTA */}
        <Card className="border-primary bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <CardTitle>AI-Powered Financial Coaching</CardTitle>
            </div>
            <CardDescription>
              Get personalized recommendations to improve your business valuation based on your financial data and industry benchmarks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Our AI coaching analyzes your specific business metrics and provides actionable insights to help you:
                <ul className="mt-2 ml-4 list-disc text-sm">
                  <li>Improve operational efficiency</li>
                  <li>Reduce customer concentration risk</li>
                  <li>Strengthen management systems</li>
                  <li>Enhance competitive positioning</li>
                </ul>
              </AlertDescription>
            </Alert>
            
            <Button 
              size="lg" 
              className="w-full gap-2"
              onClick={() => setLocation('/ai-coaching')}
            >
              Get AI Coaching Recommendations
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Back to Results */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => setLocation(`/assessment-results/${id}`)}
          >
            Back to Assessment Results
          </Button>
        </div>
      </div>
    </div>
  );
}