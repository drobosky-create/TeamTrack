import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  Star,
  Save,
  Send,
  Upload,
  FileText,
  User,
  UserCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewScore } from '@/types/review';
import { toast } from '@/hooks/use-toast';

// Mock review categories
const reviewCategories = [
  {
    id: 'cat1',
    label: 'Technical Skills',
    description: 'Proficiency in job-related technical competencies and tools',
    weight: 1
  },
  {
    id: 'cat2',
    label: 'Communication',
    description: 'Effectiveness in verbal, written, and interpersonal communication',
    weight: 1
  },
  {
    id: 'cat3',
    label: 'Problem Solving',
    description: 'Ability to analyze issues and develop effective solutions',
    weight: 1
  },
  {
    id: 'cat4',
    label: 'Initiative & Innovation',
    description: 'Proactive approach and creative thinking in work tasks',
    weight: 1
  },
  {
    id: 'cat5',
    label: 'Team Collaboration',
    description: 'Working effectively with colleagues and contributing to team goals',
    weight: 1
  }
];

interface ReviewFormProps {
  reviewId: string;
  userId: string;
  userName: string;
  reviewType: 'monthly' | 'quarterly' | 'annual';
  period: string;
  dueDate: Date;
  isManagerReview?: boolean;
  existingScores?: ReviewScore[];
  onSave?: (scores: ReviewScore[]) => void;
  onSubmit?: (scores: ReviewScore[]) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  reviewId,
  userId,
  userName,
  reviewType,
  period,
  dueDate,
  isManagerReview = false,
  existingScores = [],
  onSave,
  onSubmit
}) => {
  const { user } = useAuth();
  const [scores, setScores] = useState<ReviewScore[]>(() => {
    return reviewCategories.map(category => {
      const existing = existingScores.find(s => s.categoryId === category.id);
      return existing || {
        categoryId: category.id,
        selfScore: undefined,
        managerScore: undefined,
        selfNotes: '',
        managerNotes: ''
      };
    });
  });
  
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateScore = (categoryId: string, field: keyof ReviewScore, value: any) => {
    setScores(prev => prev.map(score => 
      score.categoryId === categoryId 
        ? { ...score, [field]: value }
        : score
    ));
  };

  const ScoreSelector: React.FC<{
    value?: number;
    onChange: (score: number) => void;
    disabled?: boolean;
  }> = ({ value, onChange, disabled }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((score) => (
        <button
          key={score}
          type="button"
          onClick={() => onChange(score)}
          disabled={disabled}
          className={`
            w-10 h-10 rounded-lg border-2 transition-all
            ${value === score 
              ? 'bg-primary text-primary-foreground border-primary shadow-soft' 
              : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            flex items-center justify-center font-medium
          `}
        >
          {score}
        </button>
      ))}
    </div>
  );

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 4) return 'text-success';
    if (score === 3) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score?: number) => {
    if (!score) return 'Not rated';
    const labels = ['', 'Needs Improvement', 'Below Expectations', 'Meets Expectations', 'Exceeds Expectations', 'Outstanding'];
    return labels[score];
  };

  const calculateProgress = () => {
    const completedCategories = scores.filter(score => {
      if (isManagerReview) {
        return score.managerScore && score.managerNotes;
      } else {
        return score.selfScore && score.selfNotes;
      }
    }).length;
    
    return Math.round((completedCategories / reviewCategories.length) * 100);
  };

  const canSubmit = () => {
    return scores.every(score => {
      if (isManagerReview) {
        return score.managerScore && score.managerNotes?.trim();
      } else {
        return score.selfScore && score.selfNotes?.trim();
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      onSave?.(scores);
      toast({
        title: "Review saved",
        description: "Your progress has been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit()) {
      toast({
        title: "Incomplete review",
        description: "Please complete all categories before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      onSubmit?.(scores);
      toast({
        title: "Review submitted",
        description: `${isManagerReview ? 'Manager' : 'Self'} review has been submitted successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageScore = scores.filter(s => isManagerReview ? s.managerScore : s.selfScore)
    .reduce((sum, s) => sum + (isManagerReview ? s.managerScore! : s.selfScore!), 0) / 
    scores.filter(s => isManagerReview ? s.managerScore : s.selfScore).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="shadow-soft-md border-border-soft">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                {isManagerReview ? <UserCheck className="h-6 w-6 text-primary" /> : <User className="h-6 w-6 text-primary" />}
                {isManagerReview ? 'Manager Review' : 'Self Review'}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {isManagerReview ? `Reviewing ${userName}` : `Complete your ${reviewType} performance review`}
              </CardDescription>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="mb-2">
                {period} • {reviewType}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Due: {dueDate.toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{calculateProgress()}% complete</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Instructions */}
      <Card className="shadow-soft border-border-soft">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground mb-1">Review Instructions</h3>
              <p className="text-sm text-muted-foreground">
                Rate each category on a scale of 1-5 and provide detailed notes. 
                A score of 3 or higher in all categories is considered passing. 
                {isManagerReview 
                  ? ' As a manager, your scores will be the final ratings for this review.'
                  : ' Your self-assessment will be reviewed by your manager.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Categories */}
      <div className="space-y-4">
        {reviewCategories.map((category, index) => {
          const score = scores.find(s => s.categoryId === category.id);
          const currentScore = isManagerReview ? score?.managerScore : score?.selfScore;
          const currentNotes = isManagerReview ? score?.managerNotes : score?.selfNotes;
          
          return (
            <Card key={category.id} className="shadow-soft border-border-soft">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      {category.label}
                    </CardTitle>
                    <CardDescription className="mt-1">{category.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getScoreColor(currentScore)}`}>
                      {currentScore || '—'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getScoreLabel(currentScore)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Score Selector */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    {isManagerReview ? 'Manager Rating' : 'Self Rating'}
                  </Label>
                  <ScoreSelector
                    value={currentScore}
                    onChange={(score) => updateScore(category.id, isManagerReview ? 'managerScore' : 'selfScore', score)}
                  />
                  <div className="mt-2 text-xs text-muted-foreground">
                    1: Needs Improvement • 2: Below Expectations • 3: Meets Expectations • 4: Exceeds Expectations • 5: Outstanding
                  </div>
                </div>

                <Separator />

                {/* Notes */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    {isManagerReview ? 'Manager Comments' : 'Self Assessment Notes'}
                  </Label>
                  <Textarea
                    value={currentNotes || ''}
                    onChange={(e) => updateScore(category.id, isManagerReview ? 'managerNotes' : 'selfNotes', e.target.value)}
                    placeholder={
                      isManagerReview 
                        ? "Provide specific feedback on performance, achievements, and areas for improvement..."
                        : "Describe your performance, achievements, challenges, and goals for this category..."
                    }
                    className="min-h-[100px] resize-none"
                  />
                </div>

                {/* Show other party's review if available */}
                {!isManagerReview && score?.managerScore && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Manager Rating</Label>
                      <div className={`text-lg font-bold ${getScoreColor(score.managerScore)}`}>
                        {score.managerScore}
                      </div>
                    </div>
                    {score.managerNotes && (
                      <p className="text-sm text-muted-foreground">{score.managerNotes}</p>
                    )}
                  </div>
                )}

                {isManagerReview && score?.selfScore && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Self Rating</Label>
                      <div className={`text-lg font-bold ${getScoreColor(score.selfScore)}`}>
                        {score.selfScore}
                      </div>
                    </div>
                    {score.selfNotes && (
                      <p className="text-sm text-muted-foreground">{score.selfNotes}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary & Actions */}
      <Card className="shadow-soft-md border-border-soft">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Review Summary</h3>
              {!isNaN(averageScore) && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Average Score:</span>
                    <span className={`text-lg font-bold ${getScoreColor(Math.round(averageScore))}`}>
                      {averageScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Outcome:</span>
                    <Badge variant={averageScore >= 3 ? 'default' : 'destructive'}>
                      {averageScore >= 3 ? 'Pass' : 'Needs Improvement'}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Draft'}
              </Button>
              
              <Button 
                onClick={handleSubmit}
                disabled={!canSubmit() || isSubmitting}
                className="gap-2 bg-gradient-primary hover:opacity-90"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};