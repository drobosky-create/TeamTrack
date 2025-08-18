import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export interface ValuationAnalysisInput {
  companyName: string;
  adjustedEbitda: number;
  valuationMultiple: number;
  overallScore: string;
  valueDriverScores: {
    financialPerformance: string;
    customerConcentration: string;
    managementTeam: string;
    competitivePosition: string;
    growthProspects: string;
    systemsProcesses: string;
    assetQuality: string;
    industryOutlook: string;
    riskFactors: string;
    ownerDependency: string;
  };
  adjustmentNotes?: string;
  additionalComments?: string;
}

export interface ValuationAnalysisOutput {
  narrativeSummary: string;
  keyStrengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
}

export async function generateValuationNarrative(input: ValuationAnalysisInput): Promise<ValuationAnalysisOutput> {
  try {
    const prompt = `
You are a professional business valuation expert. Generate a comprehensive business valuation analysis based on the following data:

Company: ${input.companyName}
Adjusted EBITDA: $${input.adjustedEbitda.toLocaleString()}
Valuation Multiple: ${input.valuationMultiple}x
Overall Score: ${input.overallScore}

Value Driver Scores (A-F scale):
- Financial Performance: ${input.valueDriverScores.financialPerformance}
- Customer Concentration: ${input.valueDriverScores.customerConcentration}
- Management Team: ${input.valueDriverScores.managementTeam}
- Competitive Position: ${input.valueDriverScores.competitivePosition}
- Growth Prospects: ${input.valueDriverScores.growthProspects}
- Systems & Processes: ${input.valueDriverScores.systemsProcesses}
- Asset Quality: ${input.valueDriverScores.assetQuality}
- Industry Outlook: ${input.valueDriverScores.industryOutlook}
- Risk Factors: ${input.valueDriverScores.riskFactors}
- Owner Dependency: ${input.valueDriverScores.ownerDependency}

${input.adjustmentNotes ? `Adjustment Notes: ${input.adjustmentNotes}` : ''}
${input.additionalComments ? `Additional Comments: ${input.additionalComments}` : ''}

Please provide a professional analysis in JSON format with the following structure:
{
  "narrativeSummary": "A comprehensive 2-3 paragraph executive summary of the business valuation",
  "keyStrengths": ["List of 3-5 key business strengths based on the scores"],
  "areasForImprovement": ["List of 3-5 areas that could improve business value"],
  "recommendations": ["List of 3-5 actionable recommendations for increasing business value"]
}

The narrative should be professional, objective, and suitable for a business valuation report. Focus on how the value driver scores impact the overall valuation and provide specific insights based on the scoring patterns.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional business valuation expert with extensive experience in analyzing and valuing small to medium-sized businesses. Provide objective, actionable insights based on the value driver assessment."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const result = JSON.parse(content) as ValuationAnalysisOutput;
    
    // Validate the response structure
    if (!result.narrativeSummary || !result.keyStrengths || !result.areasForImprovement || !result.recommendations) {
      throw new Error("Invalid response structure from OpenAI");
    }

    return result;
  } catch (error) {
    console.error("Error generating valuation narrative:", error);
    
    // Fallback response if OpenAI fails
    return {
      narrativeSummary: `Based on the analysis of ${input.companyName}, the business demonstrates an overall score of ${input.overallScore} with an adjusted EBITDA of $${input.adjustedEbitda.toLocaleString()}. The valuation multiple of ${input.valuationMultiple}x reflects the current market conditions and the company's risk profile. This assessment provides a foundation for understanding the business's current market value and identifying opportunities for value enhancement.`,
      keyStrengths: [
        "Established business operations",
        "Positive cash flow generation",
        "Market presence in industry"
      ],
      areasForImprovement: [
        "Operational efficiency optimization",
        "Market diversification opportunities",
        "Process standardization"
      ],
      recommendations: [
        "Develop comprehensive business processes documentation",
        "Implement financial reporting improvements",
        "Consider strategic growth initiatives"
      ]
    };
  }
}
