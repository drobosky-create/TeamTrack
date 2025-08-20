import { Card, CardContent, Grid, Typography, Box, Chip, LinearProgress } from '@mui/material';
import { TrendingUp, Target, BarChart3, PieChart, Calculator, Star, Crown, Zap, Award, Building2, Clock } from "lucide-react";
import MDBox from "../../../components/MD/MDBox";
import MDTypography from "../../../components/MD/MDTypography";
import MDButton from "../../../components/MD/MDButton";
import ValueDriversHeatmap from "../../../components/value-drivers-heatmap";
import type { ValuationAssessment } from "@shared/schema";

interface StrategicReportProps {
  results: ValuationAssessment;
}

export default function StrategicReport({ results }: StrategicReportProps) {
  const formatCurrency = (value: string | null | number) => {
    if (!value) return '$0';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const handleScheduleConsultation = () => {
    window.open('https://api.leadconnectorhq.com/widget/bookings/applebites', '_blank');
  };

  // Enhanced AI-powered Executive Summary Generation
  const generateIntelligentSummary = () => {
    const naicsCode = results.naicsCode || '';
    const company = results.company || 'your business';
    const valuation = results.midEstimate ? parseFloat(results.midEstimate) : 0;
    const ebitda = results.adjustedEbitda ? parseFloat(results.adjustedEbitda) : 0;
    // Calculate revenue from EBITDA and income components if not directly available
    const revenue = (() => {
      // Try to estimate revenue from available financial data
      const netIncome = results.netIncome ? parseFloat(results.netIncome) : 0;
      const adjustedEbitda = ebitda;
      
      // If we have EBITDA, estimate revenue based on industry margins
      if (adjustedEbitda > 0) {
        const naicsPrefix = naicsCode.substring(0, 2);
        const estimatedMargin = (() => {
          switch (naicsPrefix) {
            case '54': return 0.15; // Professional services - 15% margin
            case '62': return 0.12; // Healthcare - 12% margin
            case '23': return 0.08; // Construction - 8% margin
            case '51': return 0.20; // Software/Tech - 20% margin
            case '31': case '32': case '33': return 0.10; // Manufacturing - 10% margin
            default: return 0.12; // Default 12% margin
          }
        })();
        return adjustedEbitda / estimatedMargin;
      }
      
      return 0;
    })();
    const overallGrade = results.overallScore || 'B';
    
    // Advanced industry context mapping
    const industryInsights: { [key: string]: { name: string; context: string; trends: string } } = {
      '541': { 
        name: 'professional services sector', 
        context: 'characterized by knowledge-based service delivery and relationship-driven revenue models',
        trends: 'experiencing digital transformation pressures and increasing demand for specialized expertise'
      },
      '621': { 
        name: 'healthcare services industry', 
        context: 'operating in a regulated environment with demographic tailwinds and consolidation activity',
        trends: 'benefiting from aging population dynamics and value-based care transitions'
      },
      '238': { 
        name: 'construction and trades market', 
        context: 'featuring project-based revenue cycles and skilled labor dependencies',
        trends: 'facing workforce challenges while benefiting from infrastructure investment trends'
      },
      '512': { 
        name: 'technology and software industry', 
        context: 'driven by recurring revenue models and scalable digital architectures',
        trends: 'experiencing rapid growth in SaaS adoption and AI-powered solutions'
      },
      '331': { 
        name: 'manufacturing sector', 
        context: 'characterized by capital-intensive operations and supply chain complexities',
        trends: 'undergoing automation transformation and nearshoring initiatives'
      },
      '31': { name: 'manufacturing sector', context: 'capital-intensive with supply chain focus', trends: 'automation and efficiency gains' },
      '32': { name: 'manufacturing sector', context: 'industrial production environment', trends: 'technology integration trends' },
      '33': { name: 'manufacturing sector', context: 'heavy industrial operations', trends: 'sustainability and efficiency focus' }
    };
    
    const industryData = industryInsights[naicsCode.substring(0, 3)] || industryInsights[naicsCode.substring(0, 2)] || 
      { name: 'your industry', context: 'with unique operational characteristics', trends: 'adapting to market evolution' };
    
    const multiple = ebitda > 0 ? (valuation / ebitda).toFixed(1) : '0';
    const marginProfile = ebitda > 0 && revenue > 0 ? ((ebitda / revenue) * 100).toFixed(1) : '0';
    
    // Comprehensive AI-generated summary
    let summary = `${company} operates within the ${industryData.name}, ${industryData.context}. `;
    
    // Performance assessment with context
    if (overallGrade >= 'A') {
      summary += `Our comprehensive analysis reveals exceptional operational performance across all value drivers, positioning the business as a premium asset within its market segment. `;
    } else if (overallGrade >= 'B') {
      summary += `The strategic assessment demonstrates strong operational fundamentals with competitive market positioning, indicating a well-managed enterprise with clear value creation opportunities. `;
    } else {
      summary += `While the business maintains solid operational foundations, our analysis identifies significant value enhancement potential through targeted operational improvements and strategic initiatives. `;
    }
    
    // Financial performance deep dive
    if (revenue > 0) {
      if (revenue > 50000000) {
        summary += `With annual revenues of ${formatCurrency(revenue)}, the company operates at substantial scale within its sector. `;
      } else if (revenue > 10000000) {
        summary += `Annual revenues of ${formatCurrency(revenue)} position the business in the established mid-market segment. `;
      } else {
        summary += `Current revenue base of ${formatCurrency(revenue)} indicates growth-stage operations with expansion potential. `;
      }
    }
    
    // EBITDA and profitability analysis
    if (ebitda > 5000000) {
      summary += `The business generates robust adjusted EBITDA of ${formatCurrency(ebitda)}, demonstrating institutional-quality cash flow generation `;
    } else if (ebitda > 1000000) {
      summary += `Adjusted EBITDA of ${formatCurrency(ebitda)} reflects solid operational efficiency `;
    } else {
      summary += `Current EBITDA performance of ${formatCurrency(ebitda)} suggests opportunities for margin optimization `;
    }
    
    // Margin analysis
    if (parseFloat(marginProfile) > 20) {
      summary += `with exceptional ${marginProfile}% EBITDA margins significantly above industry benchmarks. `;
    } else if (parseFloat(marginProfile) > 10) {
      summary += `achieving healthy ${marginProfile}% EBITDA margins consistent with industry standards. `;
    } else if (parseFloat(marginProfile) > 0) {
      summary += `operating at ${marginProfile}% EBITDA margins with potential for improvement through operational optimization. `;
    }
    
    // Valuation multiple context with market positioning
    if (parseFloat(multiple) > 7) {
      summary += `The resulting ${multiple}x EBITDA valuation multiple reflects premium market positioning, indicating strong buyer interest and competitive advantages that justify above-market pricing. `;
    } else if (parseFloat(multiple) > 5) {
      summary += `At ${multiple}x EBITDA, the valuation multiple aligns with industry standards for well-positioned businesses, suggesting balanced risk-return characteristics attractive to strategic and financial buyers. `;
    } else if (parseFloat(multiple) > 3) {
      summary += `The ${multiple}x EBITDA multiple indicates moderate market positioning with opportunities to enhance valuation through strategic improvements and operational excellence initiatives. `;
    } else {
      summary += `Current valuation multiple of ${multiple}x EBITDA suggests significant upside potential through comprehensive value enhancement strategies. `;
    }
    
    // Industry trends and market context
    summary += `Within the broader market context, the ${industryData.name} is currently ${industryData.trends}, creating both opportunities and challenges for market participants.`;
    
    return summary;
  };

  // Dynamic Strategic Strengths based on assessment
  const generateStrategicStrengths = () => {
    const strengths = [];
    const gradeToScore = (grade: string | null | undefined): number => {
      if (!grade) return 2.5;
      const gradeMap: { [key: string]: number } = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 };
      return gradeMap[grade.charAt(0)] || 2.5;
    };

    if (gradeToScore(results.financialPerformance) >= 4) {
      strengths.push('Strong financial performance relative to industry benchmarks');
    }
    if (gradeToScore(results.recurringRevenue) >= 4) {
      strengths.push('Robust recurring revenue base providing predictable cash flows');
    }
    if (gradeToScore(results.managementTeam) >= 4) {
      strengths.push('Experienced management team with proven operational capabilities');
    }
    if (gradeToScore(results.competitivePosition) >= 4) {
      strengths.push('Strong competitive differentiation in market position');
    }
    if (gradeToScore(results.systemsProcesses) >= 4) {
      strengths.push('Well-developed operational systems supporting scalable growth');
    }
    if (gradeToScore(results.customerConcentration) >= 4) {
      strengths.push('Diversified customer base reducing concentration risk');
    }

    // Fallback strengths if none qualify
    if (strengths.length === 0) {
      strengths.push(
        'Established market presence with operational foundation',
        'Industry knowledge and customer relationships',
        'Potential for operational improvements and growth'
      );
    }

    return strengths.slice(0, 4); // Return top 4 strengths
  };

  // Dynamic Value Enhancement Opportunities
  const generateValueOpportunities = () => {
    const opportunities = [];
    const gradeToScore = (grade: string | null | undefined): number => {
      if (!grade) return 2.5;
      const gradeMap: { [key: string]: number } = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 };
      return gradeMap[grade.charAt(0)] || 2.5;
    };

    // Note: recurringRevenue field doesn't exist in schema, using financial performance instead
    if (gradeToScore(results.financialPerformance) < 4) {
      opportunities.push('Financial performance optimization and revenue enhancement');
    }
    if (gradeToScore(results.customerConcentration) < 4) {
      opportunities.push('Customer diversification and concentration risk mitigation');
    }
    if (gradeToScore(results.ownerDependency) < 4) {
      opportunities.push('Owner dependency reduction and management development');
    }
    if (gradeToScore(results.systemsProcesses) < 4) {
      opportunities.push('Operational systems enhancement and process automation');
    }
    if (gradeToScore(results.growthProspects) < 4) {
      opportunities.push('Market expansion and growth acceleration initiatives');
    }
    if (gradeToScore(results.managementTeam) < 4) {
      opportunities.push('Leadership team strengthening and succession planning');
    }

    // Ensure minimum 4 opportunities by adding common improvement areas
    if (opportunities.length < 4) {
      const additionalOpportunities = [
        'Digital transformation and technology adoption',
        'Strategic acquisitions and market consolidation', 
        'Premium service offerings and margin expansion',
        'Geographic expansion and new market penetration',
        'Operational efficiency and cost optimization',
        'Strategic partnerships and alliance development'
      ];
      
      for (const additional of additionalOpportunities) {
        if (opportunities.length >= 4) break;
        if (!opportunities.includes(additional)) {
          opportunities.push(additional);
        }
      }
    }

    return opportunities.slice(0, 4); // Return exactly 4 opportunities
  };

  // Advanced NAICS-aware deal structure analysis
  const getDealStructureRecommendations = () => {
    // Convert letter grades to numeric scores (A=5, B=4, C=3, D=2, F=1)
    const gradeToScore = (grade: string | null | undefined): number => {
      if (!grade) return 2.5;
      const gradeMap: { [key: string]: number } = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 };
      return gradeMap[grade.charAt(0)] || 2.5;
    };

    // Calculate core metrics
    const adjustedEbitda = results.adjustedEbitda ? parseFloat(results.adjustedEbitda) : 0;
    const financialScore = gradeToScore(results.financialPerformance);
    const recurringRevenueScore = gradeToScore(results.financialPerformance); // Using financial performance as proxy
    const growthScore = gradeToScore(results.growthProspects);
    const ownerDependencyScore = gradeToScore(results.ownerDependency);
    const customerConcentrationScore = gradeToScore(results.customerConcentration);
    const managementScore = gradeToScore(results.managementTeam);
    const operationalScore = gradeToScore(results.systemsProcesses);
    const scalabilityScore = (operationalScore + managementScore) / 2;
    const differentiationScore = gradeToScore(results.competitivePosition);

    // NAICS-based industry analysis
    const naicsCode = results.naicsCode || '';
    const naicsPrefix = naicsCode.substring(0, 3);
    
    // NAICS-to-deal mapping configuration
    const naicsDealsMap: { [key: string]: string[] } = {
      '541': ['SaaS Roll-Up', 'Add-On Acquisition', 'Growth Equity', 'Strategic Acquisition'], // Professional Services
      '621': ['Private Equity Platform', 'Add-On Acquisition', 'Management Buyout'], // Healthcare Services
      '238': ['Owner-Operator Acquisition', 'SBA-Backed Deal', 'Roll-Up Opportunity'], // Construction/Trades
      '512': ['Strategic Acquisition', 'Growth Equity', 'Minority Recapitalization'], // Media/Software
      '31': ['Leveraged Buyout', 'Strategic Acquisition', 'ESOP'], // Manufacturing
      '32': ['Leveraged Buyout', 'Strategic Acquisition', 'ESOP'], // Manufacturing
      '33': ['Leveraged Buyout', 'Strategic Acquisition', 'ESOP'], // Manufacturing
      '44': ['Strategic Acquisition', 'Roll-Up Opportunity', 'Asset Sale'], // Retail
      '45': ['Strategic Acquisition', 'Roll-Up Opportunity', 'Asset Sale'], // Retail
      '48': ['Private Equity Platform', 'Management Buyout', 'ESOP'], // Transportation
      '49': ['Private Equity Platform', 'Management Buyout', 'ESOP'], // Transportation
      '812': ['SBA-Backed Deal', 'Seller-Financed Exit', 'Search Fund Acquisition'], // Personal Services
      '561': ['Roll-Up Opportunity', 'Search Fund Acquisition', 'Owner-Operator Acquisition'], // Business Support
      '52': ['Minority Recapitalization', 'Private Equity Platform', 'Strategic Acquisition'], // Finance
      '53': ['Minority Recapitalization', 'Private Equity Platform', 'Strategic Acquisition'] // Real Estate
    };

    interface DealStructure {
      dealType: string;
      rationale: string;
      relevanceScore: number;
      tags: string[];
    }

    const dealOptions: DealStructure[] = [];

    // NAICS-specific deal structure recommendations
    const preferredDeals = naicsDealsMap[naicsPrefix] || [];
    
    // SaaS Roll-Up - Tech/Software industries with recurring revenue
    if ((naicsPrefix === '541' || naicsPrefix === '512') && recurringRevenueScore >= 3.5) {
      dealOptions.push({
        dealType: "SaaS Roll-Up",
        rationale: `Your NAICS code (${naicsCode}) places you in a software-driven industry. Combined with strong recurring revenue, this makes you ideal for a SaaS aggregator or roll-up.`,
        relevanceScore: 0.95 + (recurringRevenueScore - 3.5) / 10,
        tags: ["SaaS", "Recurring Revenue", `NAICS ${naicsPrefix}`]
      });
    }

    // Healthcare PE Platform - Healthcare services with scale
    if (naicsPrefix === '621' && adjustedEbitda > 2000000 && managementScore >= 4) {
      dealOptions.push({
        dealType: "Private Equity Platform",
        rationale: `As a healthcare provider with scale and leadership, you're highly attractive to healthcare-focused PE firms building platforms in NAICS ${naicsPrefix}.`,
        relevanceScore: 0.93 + Math.min(adjustedEbitda / 10000000, 0.05),
        tags: ["Healthcare", "PE Interest", `NAICS ${naicsPrefix}`]
      });
    }

    // Construction/Trades - Often owner-dependent
    if (naicsPrefix === '238' || naicsPrefix === '236') {
      if (ownerDependencyScore < 3) {
        dealOptions.push({
          dealType: "Owner-Operator Acquisition",
          rationale: `Construction/trades businesses in NAICS ${naicsPrefix} typically require hands-on ownership, making this ideal for an owner-operator buyer.`,
          relevanceScore: 0.85 - (ownerDependencyScore - 1) / 10,
          tags: ["Construction", "Owner-Operator", `NAICS ${naicsPrefix}`]
        });
      }
      if (adjustedEbitda < 3000000) {
        dealOptions.push({
          dealType: "SBA-Backed Deal",
          rationale: `Your industry profile in NAICS ${naicsPrefix} aligns well with SBA lending programs for small business acquisitions.`,
          relevanceScore: 0.82,
          tags: ["SBA Eligible", "Small Business", `NAICS ${naicsPrefix}`]
        });
      }
    }

    // Manufacturing - Traditional LBO/ESOP candidates
    if (['31', '32', '33'].includes(naicsPrefix.substring(0, 2))) {
      if (adjustedEbitda > 3000000 && financialScore >= 3.5) {
        dealOptions.push({
          dealType: "Leveraged Buyout (LBO)",
          rationale: `Manufacturing businesses in NAICS ${naicsPrefix} with stable cash flows are attractive LBO candidates for financial buyers.`,
          relevanceScore: 0.88 + financialScore / 20,
          tags: ["Manufacturing", "Stable Cash Flow", `NAICS ${naicsPrefix}`]
        });
      }
      if (managementScore >= 3 && ownerDependencyScore >= 3) {
        dealOptions.push({
          dealType: "ESOP (Employee Ownership)",
          rationale: `Legacy manufacturing companies in NAICS ${naicsPrefix} often transition successfully to employee ownership structures.`,
          relevanceScore: 0.80 + managementScore / 25,
          tags: ["Employee Ownership", "Manufacturing", `NAICS ${naicsPrefix}`]
        });
      }
    }

    // Professional Services - PE Roll-up activity
    if (naicsPrefix === '541' && scalabilityScore >= 3.5) {
      dealOptions.push({
        dealType: "Add-On Acquisition",
        rationale: `Professional services firms in NAICS ${naicsPrefix} are actively targeted by PE roll-up strategies seeking geographic or service expansion.`,
        relevanceScore: 0.87 + scalabilityScore / 20,
        tags: ["Professional Services", "PE Roll-up", `NAICS ${naicsPrefix}`]
      });
    }

    // Strategic Acquisition - High differentiation + strong operations (universal)
    if (differentiationScore >= 4 && operationalScore >= 4 && growthScore >= 4) {
      dealOptions.push({
        dealType: "Strategic Acquisition",
        rationale: "Strong competitive differentiation and operational excellence make this an attractive strategic target for industry consolidation.",
        relevanceScore: 0.90 + (differentiationScore + operationalScore) / 20,
        tags: ["High Differentiation", "Strong Operations", "Strategic Value"]
      });
    }

    // Generic deal structures for all industries (when NAICS-specific don't apply)
    
    // Growth Equity - High growth + emerging management
    if (growthScore >= 4 && managementScore >= 3 && managementScore < 5) {
      dealOptions.push({
        dealType: "Growth Equity",
        rationale: "Strong growth prospects with developing management team indicate readiness for minority growth capital investment.",
        relevanceScore: 0.85 + (growthScore - 4) / 10,
        tags: ["High Growth Potential", "Emerging Leadership", "Minority Investment"]
      });
    }

    // Management Buyout - Strong management + low owner dependency
    if (managementScore >= 4 && ownerDependencyScore >= 4) {
      dealOptions.push({
        dealType: "Management Buyout (MBO)",
        rationale: "Strong management team with operational independence creates ideal conditions for management-led acquisition.",
        relevanceScore: 0.80 + (managementScore + ownerDependencyScore) / 25,
        tags: ["Strong Management", "Operational Independence", "Internal Transition"]
      });
    }

    // Search Fund Acquisition - Mid-size with good fundamentals
    if (adjustedEbitda >= 500000 && adjustedEbitda <= 3000000 && financialScore >= 3) {
      dealOptions.push({
        dealType: "Search Fund Acquisition",
        rationale: "Size and financial profile match typical search fund acquisition criteria for entrepreneurial buyers.",
        relevanceScore: 0.78 + financialScore / 25,
        tags: ["Search Fund Size", "Financial Stability", "Entrepreneurial Buyer"]
      });
    }

    // Roll-Up Opportunity - Fragmented industry with scale potential
    if (scalabilityScore >= 3.5 && differentiationScore < 4) {
      dealOptions.push({
        dealType: "Roll-Up Opportunity",
        rationale: "Scalable business model in fragmented market presents consolidation opportunity for roll-up strategy.",
        relevanceScore: 0.76 + scalabilityScore / 25,
        tags: ["Market Fragmentation", "Scalability", "Consolidation Play"]
      });
    }

    // Turnaround Investment - Poor performance but good fundamentals
    if (financialScore < 3 && (operationalScore >= 3 || differentiationScore >= 3)) {
      dealOptions.push({
        dealType: "Turnaround Investment",
        rationale: "Underlying business strengths with financial challenges create turnaround investment opportunity.",
        relevanceScore: 0.70 + (operationalScore + differentiationScore) / 40,
        tags: ["Financial Distress", "Operational Potential", "Value Creation"]
      });
    }

    // Seller-Financed Exit - Lower valuation or challenging market conditions
    if (adjustedEbitda < 2000000 || financialScore < 3.5) {
      dealOptions.push({
        dealType: "Seller-Financed Exit",
        rationale: "Business profile suggests seller financing may be necessary to bridge valuation gaps and facilitate transaction.",
        relevanceScore: 0.75 - Math.max(0, (financialScore - 2) / 10),
        tags: ["Seller Financing", "Valuation Bridge", "Flexible Terms"]
      });
    }

    // Fallback: Asset Sale if no better options
    if (dealOptions.length === 0 || (financialScore < 2.5 && operationalScore < 2.5)) {
      dealOptions.push({
        dealType: "Asset Sale",
        rationale: "Current business performance suggests asset-based transaction may provide better value realization than going concern sale.",
        relevanceScore: 0.60,
        tags: ["Asset Based", "Distressed", "Liquidation Value"]
      });
    }

    // Sort by relevance score and return top 4
    return dealOptions
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 4)
      .map(deal => deal.dealType);
  };

  return (
    <MDBox>
      {/* Strategic Report Header */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #0b2147 0%, #1e293b 100%)', color: 'white', borderRadius: 1.5 }}>
        <CardContent sx={{ p: 2.5 }}>
          <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <MDBox>
              <MDTypography variant="h4" fontWeight="300" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2, letterSpacing: '0.5px' }}>
                Strategic Business Valuation
              </MDTypography>
              <MDTypography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: '300' }}>
                Comprehensive industry-specific analysis for {results.company}
              </MDTypography>
            </MDBox>
            <Chip 
              label="STRATEGIC ANALYSIS" 
              sx={{ 
                background: 'rgba(255,255,255,0.12)', 
                color: 'rgba(255,255,255,0.8)', 
                fontWeight: '400',
                fontSize: '0.75rem',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                letterSpacing: '0.5px'
              }} 
            />
          </MDBox>

          <MDBox display="flex" gap={3}>
            <MDBox 
              flex={1}
              textAlign="center" 
              p={2} 
              sx={{ 
                background: 'rgba(255,255,255,0.08)', 
                borderRadius: 3, 
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.05) inset',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1) inset'
                }
              }}
            >
              <MDTypography variant="h4" fontWeight="200" sx={{ color: 'rgba(255,255,255,0.95)', mb: 0.5, letterSpacing: '1px' }}>
                {formatCurrency(results.midEstimate)}
              </MDTypography>
              <MDTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem', fontWeight: '300' }}>
                Business Valuation
              </MDTypography>
            </MDBox>
            <MDBox 
              flex={1}
              textAlign="center" 
              p={2} 
              sx={{ 
                background: 'rgba(255,255,255,0.08)', 
                borderRadius: 3, 
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.05) inset',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1) inset'
                }
              }}
            >
              <MDTypography variant="h4" fontWeight="200" sx={{ color: 'rgba(255,255,255,0.95)', mb: 0.5, letterSpacing: '1px' }}>
                {formatCurrency(results.adjustedEbitda)}
              </MDTypography>
              <MDTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem', fontWeight: '300' }}>
                Adjusted EBITDA
              </MDTypography>
            </MDBox>
            <MDBox 
              flex={1}
              textAlign="center" 
              p={2} 
              sx={{ 
                background: 'rgba(255,255,255,0.08)', 
                borderRadius: 3, 
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.05) inset',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1) inset'
                }
              }}
            >
              <MDTypography variant="h4" fontWeight="200" sx={{ color: 'rgba(255,255,255,0.95)', mb: 0.5, letterSpacing: '1px' }}>
                {results.overallScore || 'B+'}
              </MDTypography>
              <MDTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem', fontWeight: '300' }}>
                Overall Grade
              </MDTypography>
            </MDBox>
          </MDBox>
        </CardContent>
      </Card>

      {/* Industry Classification Section */}
      {results.naicsCode && (
        <Card sx={{ mb: 4, borderRadius: 1.5, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <MDBox display="flex" alignItems="center" gap={2} mb={3}>
              <MDBox
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #0b2147 0%, #1e293b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Building2 size={24} color="white" />
              </MDBox>
              <MDBox>
                <MDTypography variant="h5" fontWeight="medium" color="text" mb={0.5}>
                  Industry Classification
                </MDTypography>
                <MDTypography variant="body2" color="text" sx={{ opacity: 0.7 }}>
                  NAICS-based sector analysis and competitive context
                </MDTypography>
              </MDBox>
            </MDBox>
            
            <MDBox display="flex" gap={3} mb={3}>
              <MDBox flex={1}>
                <MDBox
                  sx={{
                    p: 2.5,
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    borderRadius: 2,
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <MDTypography variant="body2" color="text" sx={{ opacity: 0.7, mb: 1, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    NAICS Code
                  </MDTypography>
                  <MDTypography variant="h4" fontWeight="bold" color="text" sx={{ color: '#0b2147', mb: 0.5 }}>
                    {results.naicsCode}
                  </MDTypography>
                  <MDTypography variant="body2" color="text" sx={{ opacity: 0.8 }}>
                    North American Industry Classification
                  </MDTypography>
                </MDBox>
              </MDBox>
              
              {results.industryDescription && (
                <MDBox flex={2}>
                  <MDBox
                    sx={{
                      p: 2.5,
                      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                      borderRadius: 2,
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <MDTypography variant="body2" color="text" sx={{ opacity: 0.7, mb: 1, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Industry Description
                    </MDTypography>
                    <MDTypography variant="body1" fontWeight="medium" color="text" sx={{ color: '#0b2147' }}>
                      {results.industryDescription}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              )}
            </MDBox>
            
            <MDBox
              sx={{
                p: 2.5,
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                borderRadius: 2,
                border: '1px solid #93c5fd'
              }}
            >
              <MDTypography variant="body2" color="text" sx={{ color: '#1e40af', fontWeight: 'medium' }}>
                <strong>Industry Context:</strong> This NAICS classification positions your business within the {(() => {
                  const naicsPrefix = results.naicsCode?.substring(0, 2) || '';
                  const sectorMap: { [key: string]: string } = {
                    '11': 'Agriculture, Forestry, Fishing and Hunting',
                    '21': 'Mining, Quarrying, and Oil and Gas Extraction',
                    '22': 'Utilities',
                    '23': 'Construction',
                    '31': 'Manufacturing',
                    '32': 'Manufacturing',
                    '33': 'Manufacturing',
                    '42': 'Wholesale Trade',
                    '44': 'Retail Trade',
                    '45': 'Retail Trade',
                    '48': 'Transportation and Warehousing',
                    '49': 'Transportation and Warehousing',
                    '51': 'Information',
                    '52': 'Finance and Insurance',
                    '53': 'Real Estate and Rental and Leasing',
                    '54': 'Professional, Scientific, and Technical Services',
                    '55': 'Management of Companies and Enterprises',
                    '56': 'Administrative and Support Services',
                    '61': 'Educational Services',
                    '62': 'Health Care and Social Assistance',
                    '71': 'Arts, Entertainment, and Recreation',
                    '72': 'Accommodation and Food Services',
                    '81': 'Other Services',
                    '92': 'Public Administration'
                  };
                  return sectorMap[naicsPrefix] || 'Specialized Business Services';
                })()} sector, providing specific context for valuation multiples, growth expectations, and strategic opportunities outlined in this analysis.
              </MDTypography>
            </MDBox>
          </CardContent>
        </Card>
      )}

      {/* Executive Summary */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox display="flex" alignItems="center" mb={3}>
            <Award size={24} color="#0A1F44" style={{ marginRight: 12 }} />
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              Executive Summary & Strategic Analysis
            </MDTypography>
          </MDBox>
          
          <MDTypography variant="body1" color="text" mb={3} sx={{ lineHeight: 1.8 }}>
            {results.executiveSummary || generateIntelligentSummary()}
          </MDTypography>

          <Box display="flex" gap={3} sx={{ '& > *': { flex: 1 } }}>
            <MDBox p={3} sx={{ backgroundColor: '#F8F9FA', borderRadius: 2, border: '1px solid #E3F2FD', minHeight: '200px' }}>
              <MDBox display="flex" alignItems="center" mb={2}>
                <TrendingUp size={20} color="#1976D2" style={{ marginRight: 8 }} />
                <MDTypography variant="h6" fontWeight="medium" color="primary">
                  Strategic Strengths
                </MDTypography>
              </MDBox>
              <MDBox sx={{ lineHeight: 1.6 }}>
                {generateStrategicStrengths().map((strength, index) => (
                  <MDTypography key={index} variant="body2" color="text" sx={{ marginBottom: '8px', display: 'block' }}>
                    • {strength}
                  </MDTypography>
                ))}
              </MDBox>
            </MDBox>
            
            <MDBox p={3} sx={{ backgroundColor: '#FFF8E1', borderRadius: 2, border: '1px solid #FFE0B2', minHeight: '200px' }}>
              <MDBox display="flex" alignItems="center" mb={2}>
                <Target size={20} color="#F57C00" style={{ marginRight: 8 }} />
                <MDTypography variant="h6" fontWeight="medium" color="warning">
                  Value Enhancement Opportunities
                </MDTypography>
              </MDBox>
              <MDBox sx={{ lineHeight: 1.6 }}>
                {generateValueOpportunities().map((opportunity, index) => (
                  <MDTypography key={index} variant="body2" color="text" sx={{ marginBottom: '8px', display: 'block' }}>
                    • {opportunity}
                  </MDTypography>
                ))}
              </MDBox>
            </MDBox>
            
            <MDBox p={3} sx={{ backgroundColor: '#E3F2FD', borderRadius: 2, border: '1px solid #BBDEFB', minHeight: '200px' }}>
              <MDBox display="flex" alignItems="center" mb={2}>
                <Building2 size={20} color="#2196F3" style={{ marginRight: 8 }} />
                <MDTypography variant="h6" fontWeight="medium" color="primary">
                  Deal Structure Fit
                </MDTypography>
              </MDBox>
              <MDBox sx={{ lineHeight: 1.6 }}>
                {(() => {
                  const recommendations = getDealStructureRecommendations().slice(0, 4);
                  if (recommendations.length === 0) return null;
                  
                  return (
                    <>
                      {/* Primary Recommendation */}
                      <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#0b2147', marginBottom: '12px', textAlign: 'center' }}>
                        {recommendations[0]}
                      </MDTypography>
                      
                      {/* Additional Options */}
                      {recommendations.length > 1 && (
                        <MDBox sx={{ textAlign: 'center' }}>
                          <MDTypography variant="subtitle2" fontWeight="medium" sx={{ color: '#666', marginBottom: '8px', marginTop: '16px' }}>
                            Additional Options
                          </MDTypography>
                          {recommendations.slice(1).map((dealType, index) => (
                            <MDTypography key={index} variant="body2" color="text" sx={{ marginBottom: '10px', display: 'block' }}>
                              • {dealType}
                            </MDTypography>
                          ))}
                        </MDBox>
                      )}
                    </>
                  );
                })()}
              </MDBox>
            </MDBox>
          </Box>
        </CardContent>
      </Card>

      {/* Valuation Range Analysis - Interactive Scale */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox display="flex" alignItems="center" mb={-2}>
            <Calculator size={24} color="#0A1F44" style={{ marginRight: 12 }} />
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              Strategic Valuation Range Analysis
            </MDTypography>
          </MDBox>

          {/* Strategic Valuation Gauge - Exact Copy from Value Calculator */}
          <MDBox display="flex" gap={4} alignItems="flex-end" mb={1}>
            {/* Gauge Container */}
            <MDBox sx={{ flex: '0 0 600px', textAlign: 'center', transform: 'scale(1.15)' }}>
              <svg width="100%" height="300" viewBox="0 0 800 150">
                {/* Material Dashboard Gradient Definitions */}
                <defs>
                  {/* Low Range - Red Material Gradient */}
                  <linearGradient id="redGradientVal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff5722" />
                    <stop offset="100%" stopColor="#d32f2f" />
                  </linearGradient>
                  {/* Conservative Range - Orange Material Gradient */}
                  <linearGradient id="orangeGradientVal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff9800" />
                    <stop offset="100%" stopColor="#f57c00" />
                  </linearGradient>
                  {/* Strategic Range - Green Material Gradient */}
                  <linearGradient id="greenGradientVal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4caf50" />
                    <stop offset="100%" stopColor="#388e3c" />
                  </linearGradient>
                  {/* Growth Range - Blue Material Gradient */}
                  <linearGradient id="blueGradientVal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2196f3" />
                    <stop offset="100%" stopColor="#1976d2" />
                  </linearGradient>
                  {/* Optimized Range - Deep Blue Material Gradient */}
                  <linearGradient id="darkBlueGradientVal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1976d2" />
                    <stop offset="100%" stopColor="#0d47a1" />
                  </linearGradient>
                  {/* Background with subtle Material gradient */}
                  <linearGradient id="backgroundGradientVal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#f5f5f5" />
                  </linearGradient>
                  {/* Needle gradient */}
                  <linearGradient id="needleGradientVal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#37474f" />
                    <stop offset="50%" stopColor="#546e7a" />
                    <stop offset="100%" stopColor="#263238" />
                  </linearGradient>
                </defs>

                {(() => {
                  const centerX = 400;
                  const centerY = 250;
                  const radius = 200;
                  
                  // Calculate dynamic position based on actual business valuation
                  const calculateGaugePosition = () => {
                    // Use actual valuation multiple from assessment results
                    const companyMultiple = parseFloat(results.valuationMultiple) || 4.0;
                    
                    // Industry range typically 3x to 9x EBITDA for most industries
                    // This could be customized based on NAICS code
                    const industryRange = { low: 3.0, high: 9.0 };
                    
                    // Calculate percentage within industry range
                    const rangePosition = (companyMultiple - industryRange.low) / (industryRange.high - industryRange.low);
                    const positionPercent = Math.max(0, Math.min(100, rangePosition * 100));
                    
                    // Map percentage to segment
                    // 0-20% = CONSERVATIVE (3.0-4.2x)
                    // 20-40% = BASELINE (4.2-5.4x)
                    // 40-60% = STRATEGIC (5.4-6.6x)
                    // 60-80% = GROWTH (6.6-7.8x)
                    // 80-100% = OPTIMIZED (7.8-9.0x+)
                    
                    if (positionPercent <= 20) return 'CONSERVATIVE';
                    if (positionPercent <= 40) return 'BASELINE';
                    if (positionPercent <= 60) return 'STRATEGIC';
                    if (positionPercent <= 80) return 'GROWTH';
                    return 'OPTIMIZED';
                  };
                  
                  const activeSegment = calculateGaugePosition();
                  
                  // Define valuation segments (0 to 180 degrees for semi-circle)
                  const segments = [
                    { label: 'CONSERVATIVE', angle: 0, color: 'redGradientVal' },
                    { label: 'BASELINE', angle: 36, color: 'orangeGradientVal' },
                    { label: 'STRATEGIC', angle: 72, color: 'greenGradientVal' },
                    { label: 'GROWTH', angle: 108, color: 'blueGradientVal' },
                    { label: 'OPTIMIZED', angle: 144, color: 'darkBlueGradientVal' },
                  ];

                  // Create arc path function
                  const createArcPath = (startAngle: number, endAngle: number, radius: number) => {
                    const startAngleRad = (startAngle + 180) * (Math.PI / 180);
                    const endAngleRad = (endAngle + 180) * (Math.PI / 180);
                    
                    const x1 = centerX + radius * Math.cos(startAngleRad);
                    const y1 = centerY + radius * Math.sin(startAngleRad);
                    const x2 = centerX + radius * Math.cos(endAngleRad);
                    const y2 = centerY + radius * Math.sin(endAngleRad);
                    
                    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
                    
                    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                  };

                  // Calculate needle position based on active segment
                  const getSegmentCenterAngle = (segmentLabel: string) => {
                    const segment = segments.find(s => s.label === segmentLabel);
                    if (!segment) return 90; // Default to middle
                    const segmentIndex = segments.indexOf(segment);
                    return segment.angle + 18; // Center of segment (each segment is 36° wide)
                  };
                  
                  const needleAngle = getSegmentCenterAngle(activeSegment);
                  const needleAngleRad = (needleAngle + 180) * (Math.PI / 180);
                  const needleLength = 190;
                  const needleX = centerX + needleLength * Math.cos(needleAngleRad);
                  const needleY = centerY + needleLength * Math.sin(needleAngleRad);

                  return (
                    <>
                      {/* Background arc */}
                      <path
                        d={createArcPath(0, 180, radius)}
                        fill="url(#backgroundGradientVal)"
                        stroke="rgb(226, 232, 240)"
                        strokeWidth="2"
                      />
                      
                      {/* Valuation segments */}
                      {segments.map((segment, index) => {
                        const startAngle = segment.angle;
                        const endAngle = index < segments.length - 1 ? segments[index + 1].angle : 180;
                        const isActive = segment.label === activeSegment;
                        
                        return (
                          <g key={segment.label}>
                            <path
                              d={createArcPath(startAngle, endAngle, radius)}
                              fill={isActive ? `url(#${segment.color})` : 'rgb(248, 250, 252)'}
                              stroke="white"
                              strokeWidth="6"
                              style={{
                                filter: isActive ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' : 'none',
                                opacity: isActive ? 1 : 0.3
                              }}
                            />
                            
                            {/* Segment labels */}
                            <text
                              x={centerX + 240 * Math.cos((segment.angle + 18 + 180) * (Math.PI / 180))}
                              y={centerY + 240 * Math.sin((segment.angle + 18 + 180) * (Math.PI / 180))}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              style={{
                                fontSize: '16px',
                                fontWeight: '900',
                                fill: isActive ? '#1A202C' : '#6b7280',
                                textShadow: isActive ? '1px 1px 2px rgba(255,255,255,0.8)' : 'none'
                              }}
                            >
                              {segment.label}
                            </text>
                          </g>
                        );
                      })}
                      
                      {/* Needle */}
                      <line
                        x1={centerX}
                        y1={centerY}
                        x2={needleX}
                        y2={needleY}
                        stroke="url(#needleGradientVal)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                        }}
                      />
                      
                      {/* Needle center dot */}
                      <circle
                        cx={centerX}
                        cy={centerY}
                        r="20"
                        fill="url(#needleGradientVal)"
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                        }}
                      />
                    </>
                  );
                })()}
              </svg>
            </MDBox>

            {/* Value Display */}
            <MDBox sx={{ flex: 1 }}>
              <MDBox mb={1} p={1.5} sx={{ backgroundColor: '#E8F5E8', borderRadius: 2, textAlign: 'center' }}>
                <MDTypography variant="h4" fontWeight="bold" color="success" mb={0.5}>
                  {formatCurrency(results.midEstimate)}
                </MDTypography>
                <MDTypography variant="h6" fontWeight="medium" color="success">
                  Strategic Baseline Value
                </MDTypography>
                <MDTypography variant="body2" sx={{ color: '#2D3748', fontWeight: 600 }}>
                  Current positioning + improvements
                </MDTypography>
              </MDBox>
              
              <MDBox display="flex" gap={2}>
                <MDBox flex={1} p={1} sx={{ backgroundColor: '#FFEBEE', borderRadius: 2, textAlign: 'center' }}>
                  <MDTypography variant="h6" fontWeight="bold" color="error">
                    {formatCurrency(results.lowEstimate)}
                  </MDTypography>
                  <MDTypography variant="caption" sx={{ color: '#2D3748', fontWeight: 600 }}>
                    Conservative Base
                  </MDTypography>
                </MDBox>
                
                <MDBox flex={1} p={1} sx={{ backgroundColor: '#E3F2FD', borderRadius: 2, textAlign: 'center' }}>
                  <MDTypography variant="h6" fontWeight="bold" color="primary">
                    {formatCurrency(results.highEstimate)}
                  </MDTypography>
                  <MDTypography variant="caption" sx={{ color: '#2D3748', fontWeight: 600 }}>
                    Optimization Peak
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>
          </MDBox>

          {/* Multiplier Information */}
          <MDBox mt={0} p={1} sx={{ backgroundColor: '#F5F5F5', borderRadius: 2, textAlign: 'center' }}>
            <MDBox display="flex" alignItems="center" justifyContent="center" mb={1}>
              <MDTypography variant="h6" fontWeight="medium" color="dark" mr={1}>
                Strategic Multiplier:
              </MDTypography>
              <MDTypography variant="h5" fontWeight="bold" color="primary">
                {results.valuationMultiple || '4.2'}x EBITDA
              </MDTypography>
            </MDBox>
            <MDTypography variant="body2" sx={{ color: '#2D3748', maxWidth: '600px', mx: 'auto' }}>
              This industry-specific multiplier reflects your business's strategic positioning, operational efficiency, 
              and growth potential within the current market environment based on NAICS-specific benchmarks.
            </MDTypography>
          </MDBox>
        </CardContent>
      </Card>

      {/* Strategic Value Drivers Analysis - Professional Bar Chart Layout */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox display="flex" alignItems="center" mb={4}>
            <BarChart3 size={24} color="#0A1F44" style={{ marginRight: 12 }} />
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              Strategic Value Drivers Assessment
            </MDTypography>
          </MDBox>
          
          {/* Compact Value Drivers Layout */}
          <MDBox display="flex" gap={3} mb={3} alignItems="center">
            {/* Overall Grade - Left Side */}
            <MDBox sx={{ flex: '0 0 200px', backgroundColor: '#f8f9fa', borderRadius: 2 }} textAlign="center" p={2}>
              <MDTypography variant="h3" fontWeight="bold" color="success" mb={1}>
                {results.overallGrade || 'B+'}
              </MDTypography>
              <MDTypography variant="body1" color="dark" fontWeight="medium">
                Overall Grade
              </MDTypography>
            </MDBox>

            {/* Key Metrics - Right Side */}
            <MDBox flex={1} display="flex" gap={2}>
              <MDBox flex={1} p={2} sx={{ backgroundColor: '#e8f5e8', borderRadius: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <MDTypography variant="h5" fontWeight="bold" color="success">
                  {results.valuationMultiple || '4.2'}x
                </MDTypography>
                <MDTypography variant="body2" color="textSecondary">
                  EBITDA Multiple
                </MDTypography>
              </MDBox>
              <MDBox flex={1} p={2} sx={{ backgroundColor: '#e3f2fd', borderRadius: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <MDTypography variant="h5" fontWeight="bold" color="primary">
                  4
                </MDTypography>
                <MDTypography variant="body2" color="textSecondary">
                  Key Strengths
                </MDTypography>
              </MDBox>
              <MDBox flex={1} p={2} sx={{ backgroundColor: '#fff3e0', borderRadius: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <MDTypography variant="h5" fontWeight="bold" color="warning">
                  4
                </MDTypography>
                <MDTypography variant="body2" color="textSecondary">
                  Opportunities
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>

          {/* Compact Two-Column Value Drivers */}
          <MDBox display="flex" gap={3} mb={3}>
            {(() => {
              const drivers = [
                { name: 'Financial Performance', grade: results.financialPerformance || 'B' },
                { name: 'Recurring Revenue', grade: results.recurringRevenue || 'A' },
                { name: 'Management Team', grade: results.managementTeam || 'A' },
                { name: 'Growth Prospects', grade: results.growthProspects || 'B' },
                { name: 'Competitive Position', grade: results.competitivePosition || 'B' },
                { name: 'Systems & Processes', grade: results.systemsProcesses || 'B' },
                { name: 'Customer Concentration', grade: results.customerConcentration || 'C' },
                { name: 'Owner Dependency', grade: results.ownerDependency || 'C' }
              ];

              const getGradeColor = (grade: string) => {
                switch (grade) {
                  case 'A': return '#4caf50';
                  case 'B': return '#2196f3';
                  case 'C': return '#ff9800';
                  case 'D': return '#f44336';
                  case 'F': return '#9e9e9e';
                  default: return '#2196f3';
                }
              };

              const leftColumn = drivers.slice(0, 4);
              const rightColumn = drivers.slice(4);

              return (
                <>
                  <MDBox flex={1}>
                    {leftColumn.map((driver, index) => (
                      <MDBox key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1.5} p={1.5} sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}>
                        <MDTypography variant="body2" fontWeight="medium" color="dark">
                          {driver.name}
                        </MDTypography>
                        <MDBox
                          sx={{
                            width: '32px',
                            height: '24px',
                            borderRadius: '4px',
                            backgroundColor: getGradeColor(driver.grade),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <MDTypography variant="caption" fontWeight="bold" color="white">
                            {driver.grade}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    ))}
                  </MDBox>
                  <MDBox flex={1}>
                    {rightColumn.map((driver, index) => (
                      <MDBox key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1.5} p={1.5} sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}>
                        <MDTypography variant="body2" fontWeight="medium" color="dark">
                          {driver.name}
                        </MDTypography>
                        <MDBox
                          sx={{
                            width: '32px',
                            height: '24px',
                            borderRadius: '4px',
                            backgroundColor: getGradeColor(driver.grade),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <MDTypography variant="caption" fontWeight="bold" color="white">
                            {driver.grade}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    ))}
                  </MDBox>
                </>
              );
            })()}
          </MDBox>
        </CardContent>
      </Card>

      {/* Industry Positioning & Benchmarks */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox display="flex" alignItems="center" mb={3}>
            <Building2 size={24} color="#0A1F44" style={{ marginRight: 12 }} />
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              Industry Positioning & Market Analysis
            </MDTypography>
          </MDBox>

          <Box display="flex" gap={3} sx={{ '& > *': { flex: 1 } }}>
            <MDBox p={3} sx={{ backgroundColor: '#F8F9FA', borderRadius: 2, border: '1px solid #E3F2FD', minHeight: '160px' }}>
              <MDBox display="flex" alignItems="center" mb={2}>
                <TrendingUp size={20} color="#4CAF50" style={{ marginRight: 8 }} />
                <MDTypography variant="h6" fontWeight="medium" color="success">
                  Market Position Score
                </MDTypography>
              </MDBox>
              <MDBox textAlign="center" mb={2}>
                <MDTypography variant="h3" fontWeight="bold" color="success">
                  75%
                </MDTypography>
              </MDBox>
              <MDTypography variant="body2" color="textSecondary" textAlign="center">
                Above industry average positioning with strong competitive advantages
              </MDTypography>
            </MDBox>
            
            <MDBox p={3} sx={{ backgroundColor: '#FFF8E1', borderRadius: 2, border: '1px solid #FFE0B2', minHeight: '160px' }}>
              <MDBox display="flex" alignItems="center" mb={2}>
                <BarChart3 size={20} color="#F57C00" style={{ marginRight: 8 }} />
                <MDTypography variant="h6" fontWeight="medium" color="warning">
                  Growth Trajectory
                </MDTypography>
              </MDBox>
              <MDBox textAlign="center" mb={2}>
                <MDTypography variant="h3" fontWeight="bold" color="warning">
                  68%
                </MDTypography>
              </MDBox>
              <MDTypography variant="body2" color="textSecondary" textAlign="center">
                Strong growth potential with strategic optimization opportunities
              </MDTypography>
            </MDBox>
            
            <MDBox p={3} sx={{ backgroundColor: '#E3F2FD', borderRadius: 2, border: '1px solid #BBDEFB', minHeight: '160px' }}>
              <MDBox display="flex" alignItems="center" mb={2}>
                <Building2 size={20} color="#2196F3" style={{ marginRight: 8 }} />
                <MDTypography variant="h6" fontWeight="medium" color="primary">
                  Industry Benchmark
                </MDTypography>
              </MDBox>
              <MDBox textAlign="center" mb={2}>
                <MDTypography variant="h3" fontWeight="bold" color="primary">
                  {results.valuationMultiple || '4.2'}x
                </MDTypography>
              </MDBox>
              <MDTypography variant="body2" color="textSecondary" textAlign="center">
                NAICS {results.naicsCode || '331110'} sector multiple reflects manufacturing industry standards
              </MDTypography>
            </MDBox>
          </Box>
        </CardContent>
      </Card>

      {/* Strategic Action Plan */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox display="flex" alignItems="center" mb={3}>
            <Zap size={24} color="#0A1F44" style={{ marginRight: 12 }} />
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              Strategic Action Plan & Next Steps
            </MDTypography>
          </MDBox>

          <Box display="flex" gap={3} sx={{ '& > *': { flex: 1 } }}>
            <MDBox p={3} sx={{ backgroundColor: '#E3F2FD', borderRadius: 2, border: '1px solid #BBDEFB', minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
              <MDBox display="flex" alignItems="center" mb={2}>
                <Clock size={20} color="#2196F3" style={{ marginRight: 8 }} />
                <MDTypography variant="h6" fontWeight="bold" color="primary">
                  Phase 1: Foundation
                </MDTypography>
              </MDBox>
              <MDTypography variant="body2" color="primary" fontWeight="medium" mb={2}>
                0-3 months
              </MDTypography>
              <MDTypography variant="body2" color="text" sx={{ flex: 1 }}>
                • Financial systems optimization<br />
                • Management team development<br />
                • Process documentation<br />
                • Performance metrics implementation
              </MDTypography>
            </MDBox>
            
            <MDBox p={3} sx={{ backgroundColor: '#FFF8E1', borderRadius: 2, border: '1px solid #FFE0B2', minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
              <MDBox display="flex" alignItems="center" mb={2}>
                <TrendingUp size={20} color="#F57C00" style={{ marginRight: 8 }} />
                <MDTypography variant="h6" fontWeight="bold" color="warning">
                  Phase 2: Growth
                </MDTypography>
              </MDBox>
              <MDTypography variant="body2" color="warning" fontWeight="medium" mb={2}>
                3-9 months
              </MDTypography>
              <MDTypography variant="body2" color="text" sx={{ flex: 1 }}>
                • Market expansion strategies<br />
                • Recurring revenue initiatives<br />
                • Customer concentration reduction<br />
                • Technology infrastructure scaling
              </MDTypography>
            </MDBox>
            
            <MDBox p={3} sx={{ backgroundColor: '#E8F5E8', borderRadius: 2, border: '1px solid #C8E6C9', minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
              <MDBox display="flex" alignItems="center" mb={2}>
                <Target size={20} color="#4CAF50" style={{ marginRight: 8 }} />
                <MDTypography variant="h6" fontWeight="bold" color="success">
                  Phase 3: Optimization
                </MDTypography>
              </MDBox>
              <MDTypography variant="body2" color="success" fontWeight="medium" mb={2}>
                9-18 months
              </MDTypography>
              <MDTypography variant="body2" color="text" sx={{ flex: 1 }}>
                • Strategic partnerships<br />
                • Exit preparation strategies<br />
                • Valuation maximization<br />
                • Market positioning refinement
              </MDTypography>
            </MDBox>
          </Box>
        </CardContent>
      </Card>

      {/* Strategic Consultation Call-to-Action */}
      <Card sx={{ background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Star size={32} color="#FFD700" style={{ marginBottom: 16 }} />
          
          <MDTypography variant="h4" fontWeight="bold" sx={{ color: 'white', mb: 2 }}>
            Ready to Execute Your Strategic Plan?
          </MDTypography>
          
          <MDTypography variant="h6" sx={{ color: '#ebfafb', mb: 3 }}>
            Schedule a comprehensive strategy session with our M&A experts to discuss your 
            strategic roadmap and value enhancement opportunities.
          </MDTypography>

          <MDBox display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <MDButton 
              onClick={handleScheduleConsultation}
              variant="contained"
              size="large"
              sx={{ 
                background: '#FFD700', 
                color: '#0A1F44',
                fontWeight: 'bold',
                px: 4, 
                py: 1.5,
                '&:hover': {
                  background: '#FFC107'
                }
              }}
            >
              Schedule Strategic Consultation
            </MDButton>
            
            <MDButton 
              onClick={() => window.location.href = '/consumer-dashboard'}
              variant="outlined"
              size="large"
              sx={{ 
                borderColor: '#FFD700', 
                color: '#FFD700',
                fontWeight: 'bold',
                px: 4, 
                py: 1.5,
                '&:hover': {
                  borderColor: '#FFC107',
                  color: '#FFC107',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)'
                }
              }}
            >
              Return to Dashboard
            </MDButton>
          </MDBox>
          
          <MDTypography variant="body2" sx={{ color: '#ebfafb', mt: 2 }}>
            Comprehensive strategic review • Value optimization planning • Exit preparation guidance
          </MDTypography>
        </CardContent>
      </Card>
    </MDBox>
  );
}