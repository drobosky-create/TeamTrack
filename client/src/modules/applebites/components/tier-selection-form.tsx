


import { CheckCircle, Star, ArrowLeft } from 'lucide-react';
import type { ValuationFormData } from '../../../hooks/use-valuation-form';

interface TierSelectionFormProps {
  formData: ValuationFormData;
  onFreeReport: () => void;
  onPaidReport: () => void;
  onPrev: () => void;
}

export default function TierSelectionForm({ 
  formData, 
  onFreeReport, 
  onPaidReport, 
  onPrev 
}: TierSelectionFormProps) {
  
  const formatCurrency = (value: string | null) => {
    if (!value) return '$0';
    const numValue = parseFloat(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  return (
    <div >
      <div >
        <h2 >Choose Your Report Type</h2>
        <p >
          Select the type of valuation report that best fits your needs.
        </p>
      </div>

      <div >
        {/* Free Tier */}
        <Card >
          <CardContent >
            <div >
              <Badge variant="outline" >BASIC REPORT</Badge>
              <h3 >Standard Analysis</h3>
              <div >Free</div>
              <p >Quick business valuation overview</p>
            </div>
            
            <div >
              <div >
                <CheckCircle  />
                <span>General 3x-8x EBITDA multipliers</span>
              </div>
              <div >
                <CheckCircle  />
                <span>A-F grade assessment across 10 value drivers</span>
              </div>
              <div >
                <CheckCircle  />
                <span>Basic PDF report with valuation range</span>
              </div>
              <div >
                <CheckCircle  />
                <span>Email delivery</span>
              </div>
            </div>
            
            <Button 
              onClick={onFreeReport}
              
            >
              Get Free Report
            </Button>
          </CardContent>
        </Card>

        {/* Paid Tier */}
        <Card >
          <div >
            <Badge >
              <Star  />
              RECOMMENDED
            </Badge>
          </div>
          
          <CardContent >
            <div >
              <Badge variant="outline" >STRATEGIC REPORT</Badge>
              <h3 >Professional Analysis</h3>
              <div >$395</div>
              <p >One-time payment</p>
              <p >Comprehensive industry-specific analysis</p>
            </div>
            
            <div >
              <div >
                <CheckCircle  />
                <span >Industry-specific NAICS multipliers</span>
              </div>
              <div >
                <CheckCircle  />
                <span >AI-powered strategic insights</span>
              </div>
              <div >
                <CheckCircle  />
                <span >Market positioning analysis</span>
              </div>
              <div >
                <CheckCircle  />
                <span >Professional presentation-ready PDF</span>
              </div>
              <div >
                <CheckCircle  />
                <span >Executive summary & recommendations</span>
              </div>
            </div>
            
            <Button 
              onClick={onPaidReport}
              
            >
              Get Strategic Report - $395
            </Button>
          </CardContent>
        </Card>
      </div>

      <div >
        <Button
          variant="outline"
          onClick={onPrev}
          
        >
          <ArrowLeft  />
          Back
        </Button>
        
        <div >
          All reports include secure email delivery and can be downloaded immediately
        </div>
      </div>
    </div>
  );
}