import { Request, Response, Router } from 'express';
import Stripe from 'stripe';
import { db } from '../db';
import { valuationAssessments, auditLogs } from '@shared/schema';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';

const router = Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

// Initialize OpenAI
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Initialize GHL (GoHighLevel) client
interface GHLContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

async function createGHLContact(contact: GHLContact) {
  if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
    console.warn('GHL API credentials not configured');
    return null;
  }

  try {
    const response = await fetch(`https://rest.gohighlevel.com/v1/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId: process.env.GHL_LOCATION_ID,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        companyName: contact.companyName,
        tags: contact.tags || ['assessment-lead'],
        customField: contact.customFields || {},
      }),
    });

    if (!response.ok) {
      console.error('GHL API error:', await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create GHL contact:', error);
    return null;
  }
}

// Calculate EBITDA and valuation
function calculateValuation(data: any) {
  // Calculate base EBITDA
  const baseEbitda = 
    (parseFloat(data.netIncome) || 0) +
    (parseFloat(data.interest) || 0) +
    (parseFloat(data.taxes) || 0) +
    (parseFloat(data.depreciation) || 0) +
    (parseFloat(data.amortization) || 0);

  // Calculate adjustments
  const adjustments = 
    (parseFloat(data.ownerSalary) || 0) +
    (parseFloat(data.personalExpenses) || 0) +
    (parseFloat(data.oneTimeExpenses) || 0) +
    (parseFloat(data.otherAdjustments) || 0);

  const adjustedEbitda = baseEbitda + adjustments;

  // Calculate score based on value drivers
  const gradeToScore: Record<string, number> = {
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 2,
    'F': 1,
  };

  const drivers = [
    data.financialPerformance,
    data.customerConcentration,
    data.managementTeam,
    data.competitivePosition,
    data.growthProspects,
    data.systemsProcesses,
    data.assetQuality,
    data.industryOutlook,
    data.riskFactors,
    data.ownerDependency,
  ].filter(Boolean);

  const avgScore = drivers.length > 0
    ? drivers.reduce((sum, grade) => sum + (gradeToScore[grade] || 3), 0) / drivers.length
    : 3;

  // Calculate multiple based on score (simplified)
  let baseMultiple = 3.0;
  if (avgScore >= 4.5) baseMultiple = 5.0;
  else if (avgScore >= 4.0) baseMultiple = 4.5;
  else if (avgScore >= 3.5) baseMultiple = 4.0;
  else if (avgScore >= 3.0) baseMultiple = 3.5;
  else if (avgScore >= 2.5) baseMultiple = 3.0;
  else baseMultiple = 2.5;

  // Industry adjustment (simplified - in production, use NAICS-specific data)
  const industryMultipliers: Record<string, number> = {
    'technology': 1.3,
    'healthcare': 1.2,
    'manufacturing': 0.9,
    'retail': 0.8,
    'services': 1.0,
  };

  const industryKey = data.industry?.toLowerCase() || 'services';
  const industryMultiplier = Object.keys(industryMultipliers).find(key => 
    industryKey.includes(key)
  ) ? industryMultipliers[Object.keys(industryMultipliers).find(key => 
    industryKey.includes(key)) || 'services'] : 1.0;

  const finalMultiple = baseMultiple * industryMultiplier;

  // Calculate valuation ranges
  const midEstimate = adjustedEbitda * finalMultiple;
  const lowEstimate = midEstimate * 0.8;
  const highEstimate = midEstimate * 1.2;

  // Determine overall grade
  let overallGrade = 'C';
  if (avgScore >= 4.5) overallGrade = 'A';
  else if (avgScore >= 4.0) overallGrade = 'B';
  else if (avgScore >= 3.0) overallGrade = 'C';
  else if (avgScore >= 2.0) overallGrade = 'D';
  else overallGrade = 'F';

  return {
    baseEbitda,
    adjustedEbitda,
    valuationMultiple: finalMultiple,
    lowEstimate,
    midEstimate,
    highEstimate,
    overallScore: overallGrade,
  };
}

// Generate narrative summary
function generateNarrativeSummary(data: any, valuation: any) {
  const yearInBusiness = new Date().getFullYear() - data.foundingYear;
  
  return `${data.companyName} is a ${yearInBusiness}-year-old ${data.industry} company with an adjusted EBITDA of $${valuation.adjustedEbitda.toLocaleString()}. Based on our comprehensive analysis of 10 key value drivers, we estimate the business value to be between $${valuation.lowEstimate.toLocaleString()} and $${valuation.highEstimate.toLocaleString()}, with a most likely value of $${valuation.midEstimate.toLocaleString()}. The company received an overall grade of ${valuation.overallScore}, reflecting ${valuation.overallScore === 'A' || valuation.overallScore === 'B' ? 'strong' : valuation.overallScore === 'C' ? 'moderate' : 'improvement opportunities in'} performance across key business metrics.`;
}

// Free assessment endpoint
router.post('/api/assessments/free', async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Create GHL contact
    const ghlContact = await createGHLContact({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName,
      tags: ['free-assessment', data.industry],
      customFields: {
        assessmentType: 'free',
        industry: data.industry,
        annualRevenue: data.annualRevenue,
        followUpIntent: data.followUpIntent,
      },
    });

    // Calculate valuation
    const valuation = calculateValuation(data);
    const narrativeSummary = generateNarrativeSummary(data, valuation);

    // Save to database
    const [assessment] = await db.insert(valuationAssessments).values({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      company: data.companyName,
      jobTitle: data.jobTitle,
      foundingYear: data.foundingYear,
      industryDescription: data.industry,
      tier: 'free',
      reportTier: 'free',
      netIncome: data.netIncome || 0,
      interest: data.interest || 0,
      taxes: data.taxes || 0,
      depreciation: data.depreciation || 0,
      amortization: data.amortization || 0,
      financialPerformance: data.financialPerformance,
      customerConcentration: data.customerConcentration,
      managementTeam: data.managementTeam,
      competitivePosition: data.competitivePosition,
      growthProspects: data.growthProspects,
      systemsProcesses: data.systemsProcesses || 'C',
      assetQuality: data.assetQuality || 'C',
      industryOutlook: data.industryOutlook || 'C',
      riskFactors: data.riskFactors || 'C',
      ownerDependency: data.ownerDependency || 'C',
      followUpIntent: data.followUpIntent,
      additionalComments: data.additionalComments,
      ...valuation,
      narrativeSummary,
      isProcessed: true,
    }).returning();

    // Log audit trail
    if (req.user?.id) {
      await db.insert(auditLogs).values({
        userId: req.user.id,
        action: 'create',
        entityType: 'assessment',
        entityId: assessment.id.toString(),
        metadata: { type: 'free', email: data.email },
      });
    }

    res.json({ 
      success: true, 
      id: assessment.id,
      valuation,
      message: 'Free assessment submitted successfully',
    });
  } catch (error) {
    console.error('Free assessment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process assessment' 
    });
  }
});

// Growth assessment payment intent
router.post('/api/assessments/growth/create-payment', async (req: Request, res: Response) => {
  try {
    const { amount, email, companyName } = req.body;

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe is not configured');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        type: 'growth_assessment',
        email,
        companyName,
      },
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Payment intent error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create payment intent' 
    });
  }
});

// Growth assessment submission
router.post('/api/assessments/growth', async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Verify payment if provided
    if (data.paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(data.paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ 
          success: false, 
          message: 'Payment not completed' 
        });
      }
    }

    // Create GHL contact with growth tag
    const ghlContact = await createGHLContact({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName,
      tags: ['growth-assessment', 'paid-customer', data.industry],
      customFields: {
        assessmentType: 'growth',
        industry: data.industry,
        naicsCode: data.naicsCode,
        annualRevenue: data.annualRevenue,
        followUpIntent: data.followUpIntent,
        paymentAmount: 497,
      },
    });

    // Calculate comprehensive valuation
    const valuation = calculateValuation(data);
    const narrativeSummary = generateNarrativeSummary(data, valuation);

    // Generate executive summary for growth tier
    const executiveSummary = `
    EXECUTIVE SUMMARY
    
    ${data.companyName} operates in the ${data.industry} sector${data.naicsCode ? ` (NAICS: ${data.naicsCode})` : ''} with annual revenues of $${data.annualRevenue?.toLocaleString() || 'N/A'}.
    
    KEY FINDINGS:
    • Adjusted EBITDA: $${valuation.adjustedEbitda.toLocaleString()}
    • Valuation Multiple: ${valuation.valuationMultiple.toFixed(1)}x
    • Estimated Value Range: $${valuation.lowEstimate.toLocaleString()} - $${valuation.highEstimate.toLocaleString()}
    • Most Likely Value: $${valuation.midEstimate.toLocaleString()}
    • Overall Grade: ${valuation.overallScore}
    
    STRENGTHS:
    ${data.financialPerformance === 'A' || data.financialPerformance === 'B' ? '• Strong financial performance\n' : ''}
    ${data.managementTeam === 'A' || data.managementTeam === 'B' ? '• Experienced management team\n' : ''}
    ${data.growthProspects === 'A' || data.growthProspects === 'B' ? '• Positive growth trajectory\n' : ''}
    
    OPPORTUNITIES:
    ${data.systemsProcesses === 'C' || data.systemsProcesses === 'D' || data.systemsProcesses === 'F' ? '• Enhance operational systems and processes\n' : ''}
    ${data.customerConcentration === 'C' || data.customerConcentration === 'D' || data.customerConcentration === 'F' ? '• Diversify customer base\n' : ''}
    ${data.ownerDependency === 'C' || data.ownerDependency === 'D' || data.ownerDependency === 'F' ? '• Reduce owner dependency\n' : ''}
    `;

    // Save to database
    const [assessment] = await db.insert(valuationAssessments).values({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      company: data.companyName,
      jobTitle: data.jobTitle,
      foundingYear: data.foundingYear,
      naicsCode: data.naicsCode,
      industryDescription: data.industry,
      tier: 'growth',
      reportTier: 'paid',
      paymentStatus: 'completed',
      stripePaymentId: data.paymentIntentId,
      netIncome: data.netIncome,
      interest: data.interest,
      taxes: data.taxes,
      depreciation: data.depreciation,
      amortization: data.amortization,
      ownerSalary: data.ownerSalary || 0,
      personalExpenses: data.personalExpenses || 0,
      oneTimeExpenses: data.oneTimeExpenses || 0,
      otherAdjustments: data.otherAdjustments || 0,
      adjustmentNotes: data.adjustmentNotes,
      financialPerformance: data.financialPerformance,
      customerConcentration: data.customerConcentration,
      managementTeam: data.managementTeam,
      competitivePosition: data.competitivePosition,
      growthProspects: data.growthProspects,
      systemsProcesses: data.systemsProcesses,
      assetQuality: data.assetQuality,
      industryOutlook: data.industryOutlook,
      riskFactors: data.riskFactors,
      ownerDependency: data.ownerDependency,
      followUpIntent: data.followUpIntent,
      additionalComments: data.additionalComments,
      ...valuation,
      narrativeSummary,
      executiveSummary,
      isProcessed: true,
    }).returning();

    // Log audit trail
    if (req.user?.id) {
      await db.insert(auditLogs).values({
        userId: req.user.id,
        action: 'create',
        entityType: 'assessment',
        entityId: assessment.id.toString(),
        metadata: { 
          type: 'growth', 
          email: data.email,
          paymentAmount: 497,
        },
      });
    }

    res.json({ 
      success: true, 
      id: assessment.id,
      valuation,
      message: 'Growth assessment submitted successfully',
    });
  } catch (error) {
    console.error('Growth assessment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process assessment' 
    });
  }
});

// Get assessment results
router.get('/api/assessments/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [assessment] = await db
      .select()
      .from(valuationAssessments)
      .where(eq(valuationAssessments.id, parseInt(id)))
      .limit(1);

    if (!assessment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assessment not found' 
      });
    }

    res.json({ 
      success: true, 
      assessment,
    });
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve assessment' 
    });
  }
});

// Unified valuation endpoint used by the free assessment form
router.post('/api/valuation', async (req: Request, res: Response) => {
  try {
    const formData = req.body;
    
    // Extract data from nested form structure
    const { ebitda, adjustments, valueDrivers, followUp } = formData;
    
    // Calculate base EBITDA
    const baseEbitda = 
      (parseFloat(ebitda.netIncome) || 0) +
      (parseFloat(ebitda.interest) || 0) +
      (parseFloat(ebitda.taxes) || 0) +
      (parseFloat(ebitda.depreciation) || 0) +
      (parseFloat(ebitda.amortization) || 0);
    
    // Calculate adjustments
    const totalAdjustments = 
      (parseFloat(adjustments.ownerSalary) || 0) +
      (parseFloat(adjustments.personalExpenses) || 0) +
      (parseFloat(adjustments.oneTimeExpenses) || 0) +
      (parseFloat(adjustments.otherAdjustments) || 0);
    
    const adjustedEbitda = baseEbitda + totalAdjustments;
    
    // Calculate score based on value drivers
    const gradeToScore: Record<string, number> = {
      'A': 5,
      'B': 4,
      'C': 3,
      'D': 2,
      'F': 1,
    };
    
    const drivers = Object.values(valueDrivers).filter(Boolean) as string[];
    const avgScore = drivers.length > 0
      ? drivers.reduce((sum, grade) => sum + (gradeToScore[grade] || 3), 0) / drivers.length
      : 3;
    
    // Calculate multiple based on score
    let baseMultiple = 3.0;
    if (avgScore >= 4.5) baseMultiple = 5.0;
    else if (avgScore >= 4.0) baseMultiple = 4.5;
    else if (avgScore >= 3.5) baseMultiple = 4.0;
    else if (avgScore >= 3.0) baseMultiple = 3.5;
    else if (avgScore >= 2.5) baseMultiple = 3.0;
    else baseMultiple = 2.5;
    
    // Calculate valuation ranges
    const midEstimate = adjustedEbitda * baseMultiple;
    const lowEstimate = midEstimate * 0.8;
    const highEstimate = midEstimate * 1.2;
    
    // Determine overall grade
    let overallScore = 'C';
    if (avgScore >= 4.5) overallScore = 'A';
    else if (avgScore >= 4.0) overallScore = 'B';
    else if (avgScore >= 3.0) overallScore = 'C';
    else if (avgScore >= 2.0) overallScore = 'D';
    else overallScore = 'F';
    
    // Generate AI-powered summaries if OpenAI is available
    let narrativeSummary = `Based on the financial analysis, the business has an adjusted EBITDA of $${adjustedEbitda.toLocaleString()} with a valuation range of $${lowEstimate.toLocaleString()} to $${highEstimate.toLocaleString()}.`;
    let executiveSummary = '';
    
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a professional business valuation analyst. Generate concise, insightful summaries for business valuations."
            },
            {
              role: "user",
              content: `Generate a professional narrative summary and executive summary for a business valuation with the following details:
                Base EBITDA: $${baseEbitda.toLocaleString()}
                Adjusted EBITDA: $${adjustedEbitda.toLocaleString()}
                Valuation Multiple: ${baseMultiple}x
                Valuation Range: $${lowEstimate.toLocaleString()} - $${highEstimate.toLocaleString()}
                Mid-point Estimate: $${midEstimate.toLocaleString()}
                Overall Grade: ${overallScore}
                
                Value Drivers:
                - Financial Performance: ${valueDrivers.financialPerformance}
                - Customer Concentration: ${valueDrivers.customerConcentration}
                - Management Team: ${valueDrivers.managementTeam}
                - Competitive Position: ${valueDrivers.competitivePosition}
                - Growth Prospects: ${valueDrivers.growthProspects}
                - Systems & Processes: ${valueDrivers.systemsProcesses}
                - Asset Quality: ${valueDrivers.assetQuality}
                - Industry Outlook: ${valueDrivers.industryOutlook}
                - Risk Factors: ${valueDrivers.riskFactors}
                - Owner Dependency: ${valueDrivers.ownerDependency}
                
                Additional Context: ${followUp.additionalComments || 'None provided'}
                
                Please provide:
                1. A narrative summary (2-3 sentences) that explains the valuation in plain language
                2. An executive summary (1-2 paragraphs) with key insights and recommendations`
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
        });
        
        const aiResponse = completion.choices[0].message?.content || '';
        const sections = aiResponse.split(/(?:1\.|Narrative Summary:|Executive Summary:)/i);
        
        if (sections.length >= 2) {
          narrativeSummary = sections[1]?.trim() || narrativeSummary;
          executiveSummary = sections[2]?.trim() || sections.slice(2).join(' ').trim();
        }
      } catch (aiError) {
        console.error('AI generation error:', aiError);
        // Fallback to basic summaries if AI fails
        executiveSummary = `The business demonstrates ${overallScore === 'A' || overallScore === 'B' ? 'strong' : overallScore === 'C' ? 'moderate' : 'improvement opportunities in'} performance across key value drivers. With an adjusted EBITDA of $${adjustedEbitda.toLocaleString()}, the estimated business value is $${midEstimate.toLocaleString()}.`;
      }
    }
    
    // Save to database
    const [assessment] = await db.insert(valuationAssessments).values({
      // Using placeholder contact info since it's not collected in free assessment
      firstName: 'Guest',
      lastName: 'User',
      email: `guest_${Date.now()}@example.com`,
      company: 'Company',
      tier: 'free',
      reportTier: 'free',
      
      // Financial data
      netIncome: parseFloat(ebitda.netIncome) || 0,
      interest: parseFloat(ebitda.interest) || 0,
      taxes: parseFloat(ebitda.taxes) || 0,
      depreciation: parseFloat(ebitda.depreciation) || 0,
      amortization: parseFloat(ebitda.amortization) || 0,
      
      // Adjustments
      ownerSalary: parseFloat(adjustments.ownerSalary) || 0,
      personalExpenses: parseFloat(adjustments.personalExpenses) || 0,
      oneTimeExpenses: parseFloat(adjustments.oneTimeExpenses) || 0,
      otherAdjustments: parseFloat(adjustments.otherAdjustments) || 0,
      adjustmentNotes: adjustments.adjustmentNotes || '',
      
      // Value drivers
      financialPerformance: valueDrivers.financialPerformance,
      customerConcentration: valueDrivers.customerConcentration,
      managementTeam: valueDrivers.managementTeam,
      competitivePosition: valueDrivers.competitivePosition,
      growthProspects: valueDrivers.growthProspects,
      systemsProcesses: valueDrivers.systemsProcesses,
      assetQuality: valueDrivers.assetQuality,
      industryOutlook: valueDrivers.industryOutlook,
      riskFactors: valueDrivers.riskFactors,
      ownerDependency: valueDrivers.ownerDependency,
      
      // Follow-up
      followUpIntent: followUp.followUpIntent,
      additionalComments: followUp.additionalComments || '',
      
      // Calculated values
      baseEbitda,
      adjustedEbitda,
      valuationMultiple: baseMultiple,
      lowEstimate,
      midEstimate,
      highEstimate,
      overallScore,
      
      // Generated content
      narrativeSummary,
      executiveSummary,
      isProcessed: true,
    }).returning();
    
    // Return the complete assessment data
    res.json(assessment);
  } catch (error) {
    console.error('Valuation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process valuation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;