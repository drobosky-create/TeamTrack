import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface FinancialCoachingData {
  revenue: number;
  ebitda: number;
  adjustedEbitda: number;
  naicsCode: string;
  industryTitle: string;
  valueDriverScores: Record<string, number>;
  userMultiple: number;
  industryAverage: number;
  companySize: 'small' | 'medium' | 'large';
  businessAge?: string;
  employeeCount?: number;
}

export interface CoachingTip {
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
  potentialImpact: string;
  timeline: string;
}

export async function generateFinancialCoachingTips(data: FinancialCoachingData): Promise<CoachingTip[]> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert business financial coach and valuation specialist. Analyze the provided business financial data and generate personalized coaching tips to improve business value and financial performance.

          Focus on actionable, specific recommendations based on:
          - Current financial performance vs industry benchmarks
          - Value driver strengths and weaknesses
          - Industry-specific opportunities
          - Business valuation improvement potential

          Provide recommendations in JSON format with the following structure:
          {
            "tips": [
              {
                "category": "Revenue Growth" | "Cost Management" | "Operational Efficiency" | "Market Position" | "Financial Structure" | "Strategic Planning",
                "priority": "high" | "medium" | "low",
                "title": "Brief actionable title",
                "description": "Detailed explanation of the opportunity",
                "actionItems": ["Specific action 1", "Specific action 2", "Specific action 3"],
                "potentialImpact": "Quantified impact on valuation or performance",
                "timeline": "Implementation timeframe"
              }
            ]
          }

          Prioritize recommendations that can meaningfully impact business valuation and provide realistic, industry-appropriate advice.`
        },
        {
          role: 'user',
          content: `Please analyze this business and provide personalized financial coaching tips:

          Business Profile:
          - Industry: ${data.naicsCode} - ${data.industryTitle}
          - Annual Revenue: $${data.revenue.toLocaleString()}
          - EBITDA: $${data.ebitda.toLocaleString()}
          - Adjusted EBITDA: $${data.adjustedEbitda.toLocaleString()}
          - Current Multiple: ${data.userMultiple.toFixed(1)}x
          - Industry Average Multiple: ${data.industryAverage.toFixed(1)}x
          - Company Size: ${data.companySize}
          ${data.businessAge ? `- Business Age: ${data.businessAge}` : ''}
          ${data.employeeCount ? `- Employee Count: ${data.employeeCount}` : ''}

          Value Driver Performance:
          ${Object.entries(data.valueDriverScores).map(([driver, score]) => 
            `- ${driver}: ${score.toFixed(1)}/5.0 (${Math.round((score/5)*100)}%)`
          ).join('\n')}

          Please provide 4-6 specific, actionable coaching tips to improve this business's financial performance and valuation.`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"tips": []}');
    return result.tips || [];
  } catch (error) {
    console.error('Error generating coaching tips:', error);
    return [];
  }
}

export async function generateContextualInsights(data: FinancialCoachingData): Promise<string> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert business valuation analyst. Provide a concise, professional analysis of the business's current position and key insights for improvement. Focus on industry context and specific value drivers.`
        },
        {
          role: 'user',
          content: `Analyze this business and provide key insights:

          Business: ${data.naicsCode} - ${data.industryTitle}
          Revenue: $${data.revenue.toLocaleString()}
          Adjusted EBITDA: $${data.adjustedEbitda.toLocaleString()}
          Your Multiple: ${data.userMultiple.toFixed(1)}x vs Industry Average: ${data.industryAverage.toFixed(1)}x
          
          Value Driver Performance:
          ${Object.entries(data.valueDriverScores).map(([driver, score]) => 
            `${driver}: ${Math.round((score/5)*100)}%`
          ).join(', ')}

          Provide 2-3 sentences highlighting the business's position and 1-2 key improvement areas.`
        }
      ],
      temperature: 0.6,
      max_tokens: 300,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating contextual insights:', error);
    return '';
  }
}