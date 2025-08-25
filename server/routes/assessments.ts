import { Request, Response, Router } from 'express';
import Stripe from 'stripe';
import { db } from '../db';
import { valuationAssessments, auditLogs, consumerUsers } from '../../shared/schema';
import { eq, desc } from 'drizzle-orm';
import OpenAI from 'openai';
import * as ebitdaMultiples from '../data/ebitda-multiples.json';
// NAICS data loaded from attached_assets instead

const router = Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-07-30.basil',
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

// Send webhook notification for lead tracking
async function sendGHLWebhook(data: any, type: 'free' | 'growth' = 'free') {
  try {
    const webhookUrl = type === 'growth' 
      ? 'https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhldFd0Z/webhook-trigger/016d7395-74cf-4bd0-9c13-263f55efe657'
      : 'https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhldFd0Z/webhook-trigger/dc1a8a7f-47ee-4c9a-b474-e1aeb21af3e3';
    
    const webhookData = {
      event: 'assessment_completed',
      type: type,
      timestamp: new Date().toISOString(),
      contact: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
      },
      assessment: {
        tier: type,
        overallGrade: data.overallGrade,
        valuationLow: data.valuationLow,
        valuationMid: data.valuationMid,
        valuationHigh: data.valuationHigh,
        adjustedEbitda: data.adjustedEbitda,
        valuationMultiple: data.valuationMultiple,
        industry: data.industry,
        naicsCode: data.naicsCode,
        followUpIntent: data.followUpIntent,
      }
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });

    if (!response.ok) {
      console.error(`Webhook failed (${response.status}):`, await response.text());
      return false;
    }

    console.log(`Webhook sent successfully for ${type} assessment: ${data.email}`);
    return true;
  } catch (error) {
    console.error('Failed to send webhook:', error);
    return false;
  }
}

async function createGHLContact(contact: GHLContact) {
  if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
    console.warn('GHL API credentials not configured');
    return null;
  }

  const baseUrl = 'https://services.leadconnectorhq.com';
  const locationId = process.env.GHL_LOCATION_ID;

  try {
    // First, check if contact exists by email
    const searchUrl = `${baseUrl}/locations/${locationId}/contacts?email=${encodeURIComponent(contact.email)}`;
    const searchResponse = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    });

    let contactId: string;
    let method: string;
    let url: string;

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      if (searchData.contacts && searchData.contacts.length > 0) {
        // Update existing contact
        contactId = searchData.contacts[0].id;
        method = 'PUT';
        url = `${baseUrl}/contacts/${contactId}`;
        console.log(`Updating existing GHL contact for ${contact.email}`);
      } else {
        // Create new contact
        method = 'POST';
        url = `${baseUrl}/contacts/`;
        console.log(`Creating new GHL contact for ${contact.email}`);
      }
    } else {
      // If search fails, try to create new contact
      method = 'POST';
      url = `${baseUrl}/contacts/`;
      console.log(`Search failed, creating new GHL contact for ${contact.email}`);
    }

    const contactData = {
      locationId: locationId,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      companyName: contact.companyName,
      tags: contact.tags || ['assessment-lead'],
      customFields: contact.customFields || {},
    };

    const response = await fetch(url, {
      method: method,
      headers: {
        'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GHL API error (${response.status}):`, errorText);
      console.error('Request data:', JSON.stringify(contactData, null, 2));
      return null;
    }

    const result = await response.json();
    console.log(`GHL contact ${method === 'POST' ? 'created' : 'updated'} successfully for ${contact.email}`);
    return result;
  } catch (error) {
    console.error('Failed to create/update GHL contact:', error);
    console.error('Contact data:', contact);
    return null;
  }
}

// Get industry multiplier based on NAICS code or industry description
function getIndustryMultiplier(naicsCodeOrIndustry?: string, avgScore?: number): number {
  if (!naicsCodeOrIndustry) return 1.0;
  
  // First check if we have exact EBITDA multiples from the JSON data
  const ebitdaData = (ebitdaMultiples as any)[naicsCodeOrIndustry];
  if (ebitdaData) {
    // Use premium range if score is high, otherwise use base range
    const isPremium = avgScore && avgScore >= 4.0;
    const range = isPremium && ebitdaData.premium_range ? ebitdaData.premium_range : ebitdaData.base_range;
    
    // Return midpoint of the range
    return (range.min + range.max) / 2;
  }
  
  // Check 4-digit NAICS prefix
  const naics4Digit = naicsCodeOrIndustry.substring(0, 4);
  const ebitda4Digit = (ebitdaMultiples as any)[naics4Digit];
  if (ebitda4Digit) {
    const isPremium = avgScore && avgScore >= 4.0;
    const range = isPremium && ebitda4Digit.premium_range ? ebitda4Digit.premium_range : ebitda4Digit.base_range;
    return (range.min + range.max) / 2;
  }
  
  // Fallback to general construction if it's a construction code (23xxxx)
  if (naicsCodeOrIndustry.startsWith('23')) {
    const generalConstruction = (ebitdaMultiples as any)['general_construction'];
    if (generalConstruction) {
      const isPremium = avgScore && avgScore >= 4.0;
      const range = isPremium && generalConstruction.premium_range ? generalConstruction.premium_range : generalConstruction.base_range;
      return (range.min + range.max) / 2;
    }
  }
  
  // Fallback to sector-based multipliers with performance adjustment
  const sectorMultipliers: Record<string, number> = {
    // High-value sectors
    '51': 6.5,  // Information (includes software, tech)
    '54': 6.0,  // Professional, Scientific, Technical Services
    '52': 5.5,  // Finance and Insurance
    '62': 5.0,  // Healthcare and Social Assistance
    
    // Medium-value sectors
    '48': 4.5,  // Transportation and Warehousing
    '49': 4.5,  // Transportation and Warehousing
    '56': 4.0,  // Administrative and Support Services
    '61': 4.0,  // Educational Services
    '53': 4.0,  // Real Estate and Rental
    
    // Standard-value sectors
    '31': 3.5,  // Manufacturing
    '32': 3.5,  // Manufacturing
    '33': 3.5,  // Manufacturing
    '42': 3.5,  // Wholesale Trade
    '81': 3.5,  // Other Services
    
    // Lower-value sectors
    '23': 3.0,  // Construction
    '44': 3.0,  // Retail Trade
    '45': 3.0,  // Retail Trade
    '72': 2.5,  // Accommodation and Food Services
    '71': 2.5,  // Arts, Entertainment, Recreation
    
    // Agriculture/Mining
    '11': 2.5,  // Agriculture, Forestry, Fishing
    '21': 3.0,  // Mining, Quarrying, Oil & Gas
  };
  
  // Get base multiplier from sector (first 2 digits)
  const sectorCode = naicsCodeOrIndustry.substring(0, 2);
  let baseMultiplier = sectorMultipliers[sectorCode] || 4.0;
  
  // Adjust multiplier based on performance score
  // avgScore ranges from 1-5, where 5 is best
  if (avgScore) {
    if (avgScore >= 4.5) {
      baseMultiplier *= 1.5;  // 50% premium for excellent businesses
    } else if (avgScore >= 4.0) {
      baseMultiplier *= 1.3;  // 30% premium for very good businesses
    } else if (avgScore >= 3.5) {
      baseMultiplier *= 1.1;  // 10% premium for good businesses
    } else if (avgScore < 2.5) {
      baseMultiplier *= 0.8;  // 20% discount for poor performers
    }
  }
  
  return baseMultiplier;
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

  // Use unified getIndustryMultiplier function for NAICS-aware calculations
  // This ensures Growth assessments use proper industry-specific multipliers
  const finalMultiple = getIndustryMultiplier(data.naicsCode || data.industry, avgScore);

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
  const yearInBusiness = data.foundingYear ? new Date().getFullYear() - data.foundingYear : null;
  const yearsText = yearInBusiness ? `${yearInBusiness}-year-old ` : '';
  
  return `${data.companyName || 'The business'} is a ${yearsText}${data.industry || 'company'} with an adjusted EBITDA of $${valuation.adjustedEbitda.toLocaleString()}. Based on our comprehensive analysis of 10 key value drivers, we estimate the business value to be between $${valuation.lowEstimate.toLocaleString()} and $${valuation.highEstimate.toLocaleString()}, with a most likely value of $${valuation.midEstimate.toLocaleString()}. The company received an overall grade of ${valuation.overallScore}, reflecting ${valuation.overallScore === 'A' || valuation.overallScore === 'B' ? 'strong' : valuation.overallScore === 'C' ? 'moderate' : 'improvement opportunities in'} performance across key business metrics.`;
}

// Free assessment endpoint
router.post('/api/assessments/free', async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Calculate valuation first
    const valuation = calculateValuation(data);
    const narrativeSummary = generateNarrativeSummary(data, valuation);

    // Create GHL contact with complete valuation data
    const ghlContact = await createGHLContact({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName,
      tags: ['free-assessment', data.industry, `grade-${valuation.overallScore}`],
      customFields: {
        assessmentType: 'free',
        industry: data.industry,
        annualRevenue: data.annualRevenue,
        followUpIntent: data.followUpIntent,
        overallGrade: valuation.overallScore,
        valuationLow: valuation.lowEstimate,
        valuationMid: valuation.midEstimate,
        valuationHigh: valuation.highEstimate,
        adjustedEbitda: valuation.adjustedEbitda,
        valuationMultiple: valuation.valuationMultiple,
        assessmentDate: new Date().toISOString(),
        financialPerformance: data.financialPerformance,
        customerConcentration: data.customerConcentration,
        managementTeam: data.managementTeam,
        competitivePosition: data.competitivePosition,
        growthProspects: data.growthProspects,
      },
    });

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
      netIncome: parseFloat(data.netIncome) || 0,
      interest: parseFloat(data.interest) || 0,
      taxes: parseFloat(data.taxes) || 0,
      depreciation: parseFloat(data.depreciation) || 0,
      amortization: parseFloat(data.amortization) || 0,
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

    // Send webhook notification
    const webhookSent = await sendGHLWebhook({
      ...data,
      ...valuation,
      companyName: data.companyName,
    }, 'free');

    if (webhookSent) {
      console.log(`Free assessment completed and webhook sent for ${data.email}`);
    }

    // Skip audit logging to avoid user structure issues

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

    // Calculate comprehensive valuation first
    const valuation = calculateValuation(data);
    const narrativeSummary = generateNarrativeSummary(data, valuation);

    // Create GHL contact with complete valuation data
    const ghlContact = await createGHLContact({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName,
      tags: ['growth-assessment', 'paid-customer', data.industry, `grade-${valuation.overallScore}`],
      customFields: {
        assessmentType: 'growth',
        industry: data.industry,
        naicsCode: data.naicsCode,
        annualRevenue: data.annualRevenue,
        followUpIntent: data.followUpIntent,
        paymentAmount: 497,
        overallGrade: valuation.overallScore,
        valuationLow: valuation.lowEstimate,
        valuationMid: valuation.midEstimate,
        valuationHigh: valuation.highEstimate,
        adjustedEbitda: valuation.adjustedEbitda,
        valuationMultiple: valuation.valuationMultiple,
        assessmentDate: new Date().toISOString(),
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
      },
    });

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
      netIncome: parseFloat(data.netIncome) || 0,
      interest: parseFloat(data.interest) || 0,
      taxes: parseFloat(data.taxes) || 0,
      depreciation: parseFloat(data.depreciation) || 0,
      amortization: parseFloat(data.amortization) || 0,
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

    // Log audit trail - skip for now since user structure varies
    // if (req.user?.id) {
    //   await db.insert(auditLogs).values({
    //     userId: req.user.id,
    //     action: 'create',
    //     entityType: 'assessment',
    //     entityId: assessment.id.toString(),
    //     metadata: { 
    //       type: 'growth', 
    //       email: data.email,
    //       paymentAmount: 497,
    //     },
    //   });
    // }

    // Send webhook notification for growth assessment
    const webhookSent = await sendGHLWebhook({
      ...data,
      ...valuation,
      companyName: data.companyName,
    }, 'growth');

    if (webhookSent) {
      console.log(`Growth assessment completed and webhook sent for ${data.email}`);
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

// Get consumer user's assessments
router.get('/api/consumer/assessments', async (req: Request, res: Response) => {
  try {
    // Get the consumer user from session
    const consumerUser = (req.session as any)?.consumerUser;
    
    if (!consumerUser || !consumerUser.email) {
      return res.status(401).json({ 
        success: false, 
        message: 'Please login to view your assessments' 
      });
    }

    // Fetch all assessments for this consumer user by email
    const assessments = await db
      .select()
      .from(valuationAssessments)
      .where(eq(valuationAssessments.email, consumerUser.email))
      .orderBy(desc(valuationAssessments.createdAt));

    res.json(assessments);
  } catch (error) {
    console.error('Get consumer assessments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve assessments' 
    });
  }
});

// Get latest assessment for consumer user (for Value Improvement Calculator)
router.get('/api/consumer/assessments/latest', async (req: Request, res: Response) => {
  try {
    // Get the consumer user from session
    const consumerUser = (req.session as any)?.consumerUser;
    
    if (!consumerUser || !consumerUser.email) {
      return res.status(401).json({ 
        success: false, 
        message: 'Please login to view your assessments' 
      });
    }

    // Get the most recent assessment for this user
    const [latestAssessment] = await db
      .select()
      .from(valuationAssessments)
      .where(eq(valuationAssessments.email, consumerUser.email))
      .orderBy(desc(valuationAssessments.createdAt))
      .limit(1);
    
    if (!latestAssessment) {
      return res.status(404).json({ success: false, message: 'No assessment found' });
    }
    
    // Return the assessment data with correct field names for Value Improvement Calculator
    res.json({
      id: latestAssessment.id,
      adjustedEbitda: latestAssessment.adjustedEbitda,
      valueDrivers: {
        financialPerformance: latestAssessment.financialPerformance,
        marketPosition: latestAssessment.customerConcentration,
        operationalExcellence: latestAssessment.systemsProcesses,
        growthPotential: latestAssessment.growthProspects,
        riskProfile: latestAssessment.riskFactors,
        strategicAssets: latestAssessment.assetQuality
      },
      finalMultiple: latestAssessment.valuationMultiple,
      businessValue: latestAssessment.midEstimate,
      tier: latestAssessment.tier
    });
  } catch (error) {
    console.error('Error fetching latest consumer assessment:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch latest assessment' });
  }
});

// Delete consumer assessment
router.delete('/api/consumer/assessments/:id', async (req: Request, res: Response) => {
  try {
    // Get the consumer user from session
    const consumerUser = (req.session as any)?.consumerUser;
    
    if (!consumerUser || !consumerUser.email) {
      return res.status(401).json({ 
        success: false, 
        message: 'Please login to delete assessments' 
      });
    }

    const assessmentId = parseInt(req.params.id);
    
    // First, verify that this assessment belongs to the user
    const existingAssessment = await db
      .select()
      .from(valuationAssessments)
      .where(eq(valuationAssessments.id, assessmentId))
      .limit(1);
    
    if (!existingAssessment.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assessment not found' 
      });
    }
    
    // Check if the assessment belongs to the current user
    if (existingAssessment[0].email !== consumerUser.email) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only delete your own assessments' 
      });
    }
    
    // Delete the assessment
    await db
      .delete(valuationAssessments)
      .where(eq(valuationAssessments.id, assessmentId));
    
    res.json({ 
      success: true, 
      message: 'Assessment deleted successfully' 
    });
  } catch (error) {
    console.error('Delete consumer assessment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete assessment' 
    });
  }
});

// Test GoHighLevel API connection (must be before :id route)
router.get('/api/assessments/test-ghl', async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;
    
    if (!apiKey || !locationId) {
      return res.status(500).json({
        success: false,
        error: 'Missing GHL credentials',
        hasApiKey: !!apiKey,
        hasLocationId: !!locationId
      });
    }
    
    // Test with Version header which is required
    const tests = [
      {
        name: 'Bearer with Version 2021-07-28',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
          'Version': '2021-07-28'
        }
      },
      {
        name: 'Bearer with Version 2021-04-15',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
          'Version': '2021-04-15'
        }
      }
    ];
    
    const results = [];
    
    for (const test of tests) {
      try {
        const response = await fetch(`https://services.leadconnectorhq.com/locations/${locationId}`, {
          method: 'GET',
          headers: test.headers
        });
        
        const responseText = await response.text();
        
        results.push({
          test: test.name,
          status: response.status,
          statusText: response.statusText,
          body: responseText.substring(0, 100)
        });
      } catch (err) {
        results.push({
          test: test.name,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }
    
    res.json({
      apiKeyLength: apiKey.length,
      apiKeyPrefix: apiKey.substring(0, 10) + '...',
      locationId: locationId,
      testResults: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get migration status (must be before :id route)
router.get('/api/assessments/migration-status', async (req: Request, res: Response) => {
  try {
    const count = await db
      .select()
      .from(valuationAssessments);
    
    res.json({
      success: true,
      totalAssessments: count.length,
      message: `Found ${count.length} assessments ready for migration`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
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
    
    // Get the consumer user from session if logged in
    const consumerUserId = (req.session as any)?.consumerUser?.id || null;
    
    // Extract data from nested form structure
    const { ebitda, adjustments, valueDrivers, followUp } = formData;
    
    // For Growth Assessment, we need to map the driver questions to grade categories
    let processedValueDrivers: any = {};
    const isGrowthAssessment = formData.tier === 'growth';
    
    if (isGrowthAssessment) {
      // Map Growth Assessment drivers to categories (all get the same overall grade)
      // We'll calculate the overall score later and apply it to all categories
      processedValueDrivers = {
        financialPerformance: null, // Will be set to overall grade
        customerConcentration: null,
        managementTeam: null,
        competitivePosition: null,
        growthProspects: null,
        systemsProcesses: null,
        assetQuality: null,
        industryOutlook: null,
        riskFactors: null,
        ownerDependency: null
      };
    } else {
      // Free Assessment already has these fields as grades
      processedValueDrivers = valueDrivers;
    }
    
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
    
    // Handle both Growth Assessment (weighted scoring) and Free Assessment (A-F grades)
    let avgScore = 3; // Default to average
    
    // Check if this is a Growth Assessment with weighted answers (already declared above)
    
    if (isGrowthAssessment) {
      // Growth Assessment uses weighted scoring (0-4 index where 4 is best)
      // Each answer index directly represents the weight/score
      const scores: number[] = [];
      for (const [key, value] of Object.entries(valueDrivers)) {
        if (typeof value === 'number') {
          // Index 0 = 1 point, Index 1 = 2 points, etc., Index 4 = 5 points
          scores.push(value + 1);
        }
      }
      avgScore = scores.length > 0 
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length
        : 3;
    } else {
      // Free Assessment uses A-F grades
      const gradeToScore: Record<string, number> = {
        'A': 5,
        'B': 4,
        'C': 3,
        'D': 2,
        'F': 1,
      };
      
      const drivers = Object.values(valueDrivers).filter(Boolean) as string[];
      avgScore = drivers.length > 0
        ? drivers.reduce((sum, grade) => sum + (gradeToScore[grade] || 3), 0) / drivers.length
        : 3;
    }
    
    // Debug logging to track what's being passed
    console.log('Growth Assessment Debug:', {
      naicsCode: formData.naicsCode,
      industry: formData.industry,
      avgScore,
      isGrowthAssessment,
      valueDrivers,
      tier: formData.tier
    });
    
    // Get industry-specific multiple based on NAICS code and performance
    let finalMultiple = 5.0;
    
    if (formData.naicsCode) {
      // Load and parse the NAICS multiplier data
      try {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.default.join(process.cwd(), 'attached_assets', 'updated_ebitda_multiples_by_naics_full_1755644266414.json');
        const fileContent = fs.default.readFileSync(filePath, 'utf8');
        const multipliersData = JSON.parse(fileContent);
        const naicsData = multipliersData[formData.naicsCode];
        
        if (naicsData) {
          // Determine if company qualifies for premium range based on performance
          const isPremium = avgScore >= 4.0;
          
          if (isPremium) {
            // Use premium range, interpolate based on score (4.0-5.0 maps to min-max of premium range)
            const normalizedScore = (avgScore - 4.0) / 1.0; // 0 to 1
            finalMultiple = naicsData.premium_range.min + 
                           (naicsData.premium_range.max - naicsData.premium_range.min) * normalizedScore;
          } else {
            // Use base range, interpolate based on score (0-3.9 maps to min-max of base range)
            const normalizedScore = avgScore / 3.9; // 0 to 1
            finalMultiple = naicsData.base_range.min + 
                           (naicsData.base_range.max - naicsData.base_range.min) * normalizedScore;
          }
          console.log('NAICS Data Found:', { naicsCode: formData.naicsCode, data: naicsData, finalMultiple });
        } else {
          console.log('NAICS code not found in data, using fallback');
          finalMultiple = getIndustryMultiplier(formData.naicsCode, avgScore) || 5.0;
        }
      } catch (error) {
        console.error('Error loading NAICS data:', error);
        finalMultiple = getIndustryMultiplier(formData.naicsCode, avgScore) || 5.0;
      }
    } else {
      finalMultiple = getIndustryMultiplier(formData.industry, avgScore) || 5.0;
    }
    
    console.log('Calculated Multiple:', finalMultiple);
    
    // Calculate valuation ranges using the industry-adjusted multiple
    const midEstimate = adjustedEbitda * finalMultiple;
    const lowEstimate = midEstimate * 0.8;
    const highEstimate = midEstimate * 1.2;
    
    // Determine overall grade
    let overallScore = 'C';
    if (avgScore >= 4.5) overallScore = 'A';
    else if (avgScore >= 4.0) overallScore = 'B';
    else if (avgScore >= 3.0) overallScore = 'C';
    else if (avgScore >= 2.0) overallScore = 'D';
    else overallScore = 'F';
    
    // For Growth Assessment, set all value driver grades to the overall score
    if (isGrowthAssessment) {
      for (const key in processedValueDrivers) {
        processedValueDrivers[key] = overallScore;
      }
    }
    
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
                Valuation Multiple: ${finalMultiple}x
                Valuation Range: $${lowEstimate.toLocaleString()} - $${highEstimate.toLocaleString()}
                Mid-point Estimate: $${midEstimate.toLocaleString()}
                Overall Grade: ${overallScore}
                
                Value Drivers:
                - Financial Performance: ${processedValueDrivers.financialPerformance}
                - Customer Concentration: ${processedValueDrivers.customerConcentration}
                - Management Team: ${processedValueDrivers.managementTeam}
                - Competitive Position: ${processedValueDrivers.competitivePosition}
                - Growth Prospects: ${processedValueDrivers.growthProspects}
                - Systems & Processes: ${processedValueDrivers.systemsProcesses}
                - Asset Quality: ${processedValueDrivers.assetQuality}
                - Industry Outlook: ${processedValueDrivers.industryOutlook}
                - Risk Factors: ${processedValueDrivers.riskFactors}
                - Owner Dependency: ${processedValueDrivers.ownerDependency}
                
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
    
    // Get consumer user details if logged in
    let consumerUserData = null;
    if (consumerUserId) {
      const [consumerUser] = await db
        .select()
        .from(consumerUsers)
        .where(eq(consumerUsers.id, consumerUserId))
        .limit(1);
      consumerUserData = consumerUser;
    }
    
    // Save to database with proper type handling
    const [assessment] = await db.insert(valuationAssessments).values({
      firstName: consumerUserData?.firstName || 'Guest',
      lastName: consumerUserData?.lastName || 'User',
      email: consumerUserData?.email || `guest_${Date.now()}@example.com`,
      phone: consumerUserData?.phone || '000-000-0000',
      company: consumerUserData?.companyName || 'Company',
      tier: formData.tier || 'free',
      reportTier: formData.reportTier || 'free',
      naicsCode: formData.naicsCode || null,
      industryDescription: formData.industry || null,
      
      // Financial data - convert strings to numbers
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
      
      // Value drivers - use processedValueDrivers which already has the correct grades
      financialPerformance: processedValueDrivers.financialPerformance || 'C',
      customerConcentration: processedValueDrivers.customerConcentration || 'C',
      managementTeam: processedValueDrivers.managementTeam || 'C',
      competitivePosition: processedValueDrivers.competitivePosition || 'C',
      growthProspects: processedValueDrivers.growthProspects || 'C',
      systemsProcesses: processedValueDrivers.systemsProcesses || 'C',
      assetQuality: processedValueDrivers.assetQuality || 'C',
      industryOutlook: processedValueDrivers.industryOutlook || 'C',
      riskFactors: processedValueDrivers.riskFactors || 'C',
      ownerDependency: processedValueDrivers.ownerDependency || 'C',
      
      // Follow-up
      followUpIntent: followUp.followUpIntent,
      additionalComments: followUp.additionalComments || '',
      
      // Calculated values
      baseEbitda,
      adjustedEbitda,
      valuationMultiple: finalMultiple,
      lowEstimate,
      midEstimate,
      highEstimate,
      overallScore,
      
      // Generated content
      narrativeSummary,
      executiveSummary,
      isProcessed: true,
    }).returning();
    
    // Return the complete assessment data with success flag
    res.json({ 
      success: true,
      id: assessment.id,
      assessment,
      valuation: {
        baseEbitda,
        adjustedEbitda,
        valuationMultiple: finalMultiple,
        lowEstimate,
        midEstimate,
        highEstimate,
        overallScore
      }
    });
  } catch (error) {
    console.error('Valuation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process valuation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Migrate existing assessments to GoHighLevel
router.post('/api/assessments/migrate-to-ghl', async (req: Request, res: Response) => {
  try {
    console.log('Starting migration of existing assessments to GoHighLevel...');
    
    // Fetch all existing assessments from database
    const assessments = await db
      .select()
      .from(valuationAssessments)
      .orderBy(desc(valuationAssessments.createdAt));
    
    console.log(`Found ${assessments.length} assessments to migrate`);
    
    const results = {
      total: assessments.length,
      successful: 0,
      failed: 0,
      skipped: 0,
      details: [] as any[]
    };
    
    // Process each assessment
    for (const assessment of assessments) {
      try {
        // Skip if no email
        if (!assessment.email) {
          results.skipped++;
          results.details.push({
            id: assessment.id,
            status: 'skipped',
            reason: 'No email address'
          });
          continue;
        }
        
        // Create contact data with all assessment information
        const contactResult = await createGHLContact({
          firstName: assessment.firstName || 'Unknown',
          lastName: assessment.lastName || 'Unknown',
          email: assessment.email,
          phone: assessment.phone || '',
          companyName: assessment.company || 'Unknown Company',
          tags: [
            `${assessment.tier || 'free'}-assessment`,
            assessment.industryDescription || 'Unknown Industry',
            `grade-${assessment.overallScore || 'C'}`,
            'migrated-data'
          ],
          customFields: {
            assessmentType: assessment.tier || 'free',
            assessmentId: assessment.id,
            assessmentDate: assessment.createdAt,
            industry: assessment.industryDescription,
            naicsCode: assessment.naicsCode,
            overallGrade: assessment.overallScore,
            valuationLow: assessment.lowEstimate ? parseFloat(assessment.lowEstimate) : 0,
            valuationMid: assessment.midEstimate ? parseFloat(assessment.midEstimate) : 0,
            valuationHigh: assessment.highEstimate ? parseFloat(assessment.highEstimate) : 0,
            adjustedEbitda: assessment.adjustedEbitda ? parseFloat(assessment.adjustedEbitda) : 0,
            valuationMultiple: assessment.valuationMultiple ? parseFloat(assessment.valuationMultiple) : 0,
            financialPerformance: assessment.financialPerformance,
            customerConcentration: assessment.customerConcentration,
            managementTeam: assessment.managementTeam,
            competitivePosition: assessment.competitivePosition,
            growthProspects: assessment.growthProspects,
            systemsProcesses: assessment.systemsProcesses,
            assetQuality: assessment.assetQuality,
            industryOutlook: assessment.industryOutlook,
            riskFactors: assessment.riskFactors,
            ownerDependency: assessment.ownerDependency,
            followUpIntent: assessment.followUpIntent,
            migrated: true,
            migratedAt: new Date().toISOString()
          }
        });
        
        if (contactResult) {
          results.successful++;
          results.details.push({
            id: assessment.id,
            email: assessment.email,
            company: assessment.company,
            status: 'success',
            ghlContactId: contactResult.id || contactResult.contact?.id
          });
          console.log(`✓ Migrated: ${assessment.email} (${assessment.company})`);
        } else {
          results.failed++;
          results.details.push({
            id: assessment.id,
            email: assessment.email,
            company: assessment.company,
            status: 'failed',
            reason: 'GHL API returned null'
          });
          console.log(`✗ Failed: ${assessment.email} (${assessment.company})`);
        }
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        results.failed++;
        results.details.push({
          id: assessment.id,
          email: assessment.email,
          company: assessment.company,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`Error migrating assessment ${assessment.id}:`, error);
      }
    }
    
    console.log('Migration complete:', results);
    
    res.json({
      success: true,
      message: `Migration complete: ${results.successful} successful, ${results.failed} failed, ${results.skipped} skipped`,
      results
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
    res.status(500).json({
      success: false,
      message: 'Migration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test endpoint for GHL integration
router.post('/api/assessments/test-ghl', async (req: Request, res: Response) => {
  try {
    const testData = {
      firstName: 'Test',
      lastName: 'Integration',
      email: `test-${Date.now()}@example.com`,
      phone: '555-0123',
      companyName: 'Test Company',
      industry: 'Technology',
      annualRevenue: 1000000,
      followUpIntent: 'yes',
    };

    console.log('Testing GHL integration with:', testData);

    // Test contact creation
    const contact = await createGHLContact({
      ...testData,
      tags: ['test-integration', 'api-test'],
      customFields: {
        testRun: true,
        timestamp: new Date().toISOString(),
      },
    });

    // Test webhook
    const webhookResult = await sendGHLWebhook({
      ...testData,
      overallGrade: 'B',
      valuationLow: 2000000,
      valuationMid: 2500000,
      valuationHigh: 3000000,
      adjustedEbitda: 500000,
      valuationMultiple: 5.0,
    }, 'free');

    res.json({
      success: true,
      message: 'GHL integration test completed',
      contactCreated: !!contact,
      webhookSent: webhookResult,
      contactData: contact,
    });
  } catch (error: any) {
    console.error('GHL test failed:', error);
    res.status(500).json({
      success: false,
      message: 'GHL integration test failed',
      error: error.message,
    });
  }
});

export default router;