import { ValuationAssessment } from "@shared/schema";

export interface GoHighLevelContact {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  companyName?: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface GoHighLevelEmailPayload {
  contactId?: string;
  email: string;
  templateId?: string;
  subject: string;
  htmlContent?: string;
  attachments?: Array<{
    name: string;
    content: string; // base64 encoded
    type: string;
  }>;
}

export class GoHighLevelService {
  private apiKey: string;
  private locationId: string;
  private webhookUrls: {
    freeResults: string;
    growthPurchase: string;
    growthResults: string;
    capitalPurchase: string;
    n8nLead: string;
  };
  private baseUrl = 'https://services.leadconnectorhq.com';

  constructor() {
    if (!process.env.GHL_API_KEY) {
      throw new Error("GHL_API_KEY environment variable is required");
    }
    if (!process.env.GHL_LOCATION_ID) {
      throw new Error("GHL_LOCATION_ID environment variable is required");
    }
    
    this.apiKey = process.env.GHL_API_KEY;
    this.locationId = process.env.GHL_LOCATION_ID;
    this.webhookUrls = {
      freeResults: process.env.GHL_WEBHOOK_FREE_RESULTS || 'https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhldFd0Z/webhook-trigger/dc1a8a7f-47ee-4c9a-b474-e1aeb21af3e3',
      growthPurchase: 'https://applebites.ai/api/webhook/growth-purchase', // Incoming webhook endpoint
      growthResults: process.env.GHL_WEBHOOK_GROWTH_RESULTS || 'https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhldFd0Z/webhook-trigger/016d7395-74cf-4bd0-9c13-263f55efe657',
      capitalPurchase: process.env.GHL_WEBHOOK_CAPITAL_PURCHASE || 'https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhldFd0Z/webhook-trigger/3c15954e-9d4b-4fde-b064-8b47193d1fcb',
      n8nLead: 'https://drobosky.app.n8n.cloud/webhook-test/replit-lead'
    };
  }

  private async makeRequest(endpoint: string, method: string = 'GET', data?: any) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Version': '2021-07-28'
      },
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GoHighLevel API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async createOrUpdateContact(contactData: GoHighLevelContact): Promise<any> {
    try {
      // Use v2 endpoints - First, try to find existing contact by email
      const searchResponse = await this.makeRequest(
        `/contacts/v2/search?locationId=${this.locationId}&email=${encodeURIComponent(contactData.email)}`
      );

      let contactId: string;

      if (searchResponse.contacts && searchResponse.contacts.length > 0) {
        // Update existing contact using v2 endpoint
        contactId = searchResponse.contacts[0].id;
        const updateData = {
          ...contactData,
          locationId: this.locationId
        };
        await this.makeRequest(`/contacts/v2/${contactId}`, 'PUT', updateData);
      } else {
        // Create new contact using v2 endpoint
        const createData = {
          ...contactData,
          locationId: this.locationId
        };
        const createResponse = await this.makeRequest(`/contacts/v2/`, 'POST', createData);
        contactId = createResponse.contact.id;
      }

      return { contactId, isNew: !searchResponse.contacts?.length };
    } catch (error) {
      console.error('Error creating/updating GoHighLevel contact:', error);
      throw error;
    }
  }

  async getAllContacts(): Promise<any[]> {
    try {
      const response = await this.makeRequest(`/locations/${this.locationId}/contacts/`);
      return response.contacts || [];
    } catch (error) {
      console.error('Error fetching all GoHighLevel contacts:', error);
      throw error;
    }
  }

  async sendEmail(emailData: GoHighLevelEmailPayload): Promise<boolean> {
    try {
      await this.makeRequest(`/locations/${this.locationId}/emails/`, 'POST', emailData);
      return true;
    } catch (error) {
      console.error('Error sending email via GoHighLevel:', error);
      return false;
    }
  }

  async sendTeamWelcomeEmail(teamMemberData: {
    email: string;
    firstName: string;
    lastName: string;
    subject: string;
    emailContent: string;
    isTeamMember: boolean;
  }): Promise<{
    contactCreated: boolean;
    emailSent: boolean;
    webhookSent: boolean;
  }> {
    try {
      // Create or update contact for team member
      const contactData: GoHighLevelContact = {
        firstName: teamMemberData.firstName,
        lastName: teamMemberData.lastName,
        email: teamMemberData.email,
        tags: ['Team Member', 'Internal User'],
        customFields: {
          'user_type': 'team_member',
          'account_created_date': new Date().toISOString()
        }
      };

      const contactResult = await this.createOrUpdateContact(contactData);
      
      // Send welcome email
      const emailData: GoHighLevelEmailPayload = {
        contactId: contactResult.contactId,
        email: teamMemberData.email,
        subject: teamMemberData.subject,
        htmlContent: teamMemberData.emailContent
      };

      const emailSent = await this.sendEmail(emailData);

      // Send webhook notification
      const webhookData = {
        event: 'team_member_created',
        teamMember: {
          email: teamMemberData.email,
          firstName: teamMemberData.firstName,
          lastName: teamMemberData.lastName,
          createdAt: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };

      const webhookSent = await this.sendWebhook(webhookData, 'freeResults'); // Team member notifications use free results webhook

      return {
        contactCreated: !!contactResult,
        emailSent,
        webhookSent
      };
    } catch (error) {
      console.error('Error processing team member welcome email:', error);
      return {
        contactCreated: false,
        emailSent: false,
        webhookSent: false
      };
    }
  }

  async sendWebhook(data: any, webhookType: 'freeResults' | 'growthPurchase' | 'growthResults' | 'capitalPurchase' | 'n8nLead' = 'freeResults'): Promise<boolean> {
    try {
      const webhookUrl = this.webhookUrls[webhookType];
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      console.log(`Webhook sent to ${webhookType} (${webhookUrl}):`, response.status);
      return response.ok;
    } catch (error) {
      console.error(`Error sending webhook to ${webhookType}:`, error);
      return false;
    }
  }

  async processPurchaseEvent(purchaseData: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    company?: string;
    tier: 'growth' | 'capital';
    amount: number;
    transactionId?: string;
  }): Promise<{
    contactCreated: boolean;
    webhookSent: boolean;
  }> {
    try {
      // Create contact data for purchase
      const contactData: GoHighLevelContact = {
        firstName: purchaseData.firstName || undefined,
        lastName: purchaseData.lastName || undefined,
        email: purchaseData.email,
        phone: purchaseData.phone || undefined,
        companyName: purchaseData.company || undefined,
        tags: [
          'Business Valuation Purchase',
          `Tier: ${purchaseData.tier}`,
          `Amount: $${purchaseData.amount}`
        ],
        customFields: {
          'purchase_tier': purchaseData.tier,
          'purchase_amount': purchaseData.amount,
          'transaction_id': purchaseData.transactionId || '',
          'purchase_date': new Date().toISOString()
        }
      };

      // Create or update contact
      const contactResult = await this.createOrUpdateContact(contactData);

      // Prepare purchase webhook data
      const webhookData = {
        event: 'tier_purchase',
        tier: purchaseData.tier,
        contact: {
          first_name: purchaseData.firstName || '',
          last_name: purchaseData.lastName || '',
          email: purchaseData.email,
          phone: purchaseData.phone || '',
          company_name: purchaseData.company || ''
        },
        purchase: {
          tier: purchaseData.tier,
          amount: purchaseData.amount,
          transaction_id: purchaseData.transactionId || '',
          purchase_date: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };

      // Determine webhook type based on tier
      const webhookType = purchaseData.tier === 'growth' ? 'growthPurchase' : 'capitalPurchase';
      const webhookSent = await this.sendWebhook(webhookData, webhookType);

      return {
        contactCreated: true,
        webhookSent
      };

    } catch (error) {
      console.error('Error processing purchase event in GoHighLevel:', error);
      return {
        contactCreated: false,
        webhookSent: false
      };
    }
  }

  // Send lead data to both GoHighLevel and n8n for comprehensive lead management
  async sendLeadToAllSystems(leadData: any): Promise<{
    ghlWebhookSent: boolean;
    n8nWebhookSent: boolean;
  }> {
    try {
      // Send to appropriate GoHighLevel webhook based on tier
      let ghlWebhookType: 'freeResults' | 'growthResults' | 'capitalPurchase' = 'freeResults';
      if (leadData.tier === 'growth' || leadData.tier === 'paid') {
        ghlWebhookType = 'growthResults';
      } else if (leadData.tier === 'capital') {
        ghlWebhookType = 'capitalPurchase';
      }
      
      // Send to both systems simultaneously
      const [ghlResult, n8nResult] = await Promise.allSettled([
        this.sendWebhook(leadData, ghlWebhookType),
        this.sendWebhook(leadData, 'n8nLead')
      ]);
      
      const ghlWebhookSent = ghlResult.status === 'fulfilled' && ghlResult.value;
      const n8nWebhookSent = n8nResult.status === 'fulfilled' && n8nResult.value;
      
      console.log(`Lead sent - GHL: ${ghlWebhookSent}, n8n: ${n8nWebhookSent}`);
      
      return {
        ghlWebhookSent,
        n8nWebhookSent
      };
    } catch (error) {
      console.error('Error sending lead to all systems:', error);
      return {
        ghlWebhookSent: false,
        n8nWebhookSent: false
      };
    }
  }

  async processValuationAssessment(assessment: ValuationAssessment, pdfBuffer?: Buffer): Promise<{
    contactCreated: boolean;
    emailSent: boolean;
    webhookSent: boolean;
  }> {
    try {
      // Extract contact information from assessment
      const contactData: GoHighLevelContact = {
        firstName: assessment.firstName || undefined,
        lastName: assessment.lastName || undefined,
        email: assessment.email,
        phone: assessment.phone || undefined,
        companyName: assessment.company || undefined,
        tags: [
          'Business Valuation Lead',
          `Grade: ${assessment.overallScore}`,
          `Value: $${Number(assessment.midEstimate).toLocaleString()}`
        ],
        customFields: {
          // Convert decimal strings to numbers for GoHighLevel
          'overall_grade_af': assessment.overallScore,
          'valuation_estimate': Number(assessment.midEstimate) || 0,
          'valuation__low': Number(assessment.lowEstimate) || 0,
          'valuation__high': Number(assessment.highEstimate) || 0,
          'adjusted_ebitda': Number(assessment.adjustedEbitda) || 0,
          'valuation_multiple': Number(assessment.valuationMultiple) || 0,
          'assessment_date': assessment.createdAt,
          'financial_performance_grade': assessment.financialPerformance,
          'customer_concentration_grade': assessment.customerConcentration,
          'management_team_grade': assessment.managementTeam,
          'competitive_position_grade': assessment.competitivePosition,
          'growth_prospects_grade': assessment.growthProspects,
          'systems_processes_grade': assessment.systemsProcesses,
          'asset_quality_grade': assessment.assetQuality,
          'industry_outlook_grade': assessment.industryOutlook,
          'risk_factors_grade': assessment.riskFactors,
          'owner_dependency_grade': assessment.ownerDependency,
          'follow_up_intent': assessment.followUpIntent,
          'executive_summary': assessment.executiveSummary || ''
        }
      };

      // Create or update contact
      const contactResult = await this.createOrUpdateContact(contactData);

      // Prepare email with PDF attachment
      const emailData: GoHighLevelEmailPayload = {
        contactId: contactResult.contactId,
        email: assessment.email,
        subject: `Your Business Valuation Report - ${assessment.company || 'Your Company'}`,
        htmlContent: this.generateEmailTemplate(assessment),
        attachments: pdfBuffer ? [{
          name: `${assessment.company || 'Business'}_Valuation_Report.pdf`,
          content: pdfBuffer.toString('base64'),
          type: 'application/pdf'
        }] : undefined
      };

      // Send email
      const emailSent = await this.sendEmail(emailData);

      // Determine webhook type based on assessment tier
      let webhookType: 'freeResults' | 'growthPurchase' | 'growthResults' | 'capitalPurchase' = 'freeResults';
      
      // Check if this is a paid assessment (Growth or Capital tier)
      if (assessment.tier === 'growth' || assessment.tier === 'paid') {
        webhookType = 'growthResults';
      } else if (assessment.tier === 'capital') {
        webhookType = 'capitalPurchase'; // Capital tier uses same webhook as purchase for now
      }
      
      // Send webhook with full assessment data including pre-formatted values
      const webhookData = {
        event: 'valuation_completed',
        tier: assessment.tier || 'free',
        contact: {
          first_name: assessment.firstName || '',
          last_name: assessment.lastName || '',
          email: assessment.email,
          phone: assessment.phone || '',
          company_name: assessment.company || '',
          // Custom fields matching GoHighLevel exactly - convert strings to numbers
          overall_grade_af: assessment.overallScore,
          valuation_estimate: Number(assessment.midEstimate) || 0,
          valuation_low: Number(assessment.lowEstimate) || 0,
          valuation_high: Number(assessment.highEstimate) || 0,
          adjusted_ebitda: Number(assessment.adjustedEbitda) || 0,
          financial_performance_grade: assessment.financialPerformance,
          customer_concentration_grade: assessment.customerConcentration,
          management_team_grade: assessment.managementTeam,
          competitive_position_grade: assessment.competitivePosition,
          growth_prospects_grade: assessment.growthProspects,
          systems_processes_grade: assessment.systemsProcesses,
          asset_quality_grade: assessment.assetQuality,
          industry_outlook_grade: assessment.industryOutlook,
          risk_factors_grade: assessment.riskFactors,
          owner_dependency_grade: assessment.ownerDependency,
          follow_up_intent: assessment.followUpIntent,
          executive_summary: assessment.executiveSummary || ''
        },
        assessment: {
          id: assessment.id,
          companyName: assessment.company,
          overallScore: assessment.overallScore,
          lowEstimate: assessment.lowEstimate,
          midEstimate: assessment.midEstimate,
          highEstimate: assessment.highEstimate,
          adjustedEbitda: assessment.adjustedEbitda,
          valuationMultiple: assessment.valuationMultiple,
          createdAt: assessment.createdAt,
          followUpIntent: assessment.followUpIntent,
          additionalComments: assessment.additionalComments
        }
      };

      // Send to both GoHighLevel and n8n for comprehensive lead management
      const webhookResults = await this.sendLeadToAllSystems(webhookData);

      return {
        contactCreated: true,
        emailSent,
        webhookSent: webhookResults.ghlWebhookSent || webhookResults.n8nWebhookSent // Consider success if either webhook succeeds
      };

    } catch (error) {
      console.error('Error processing valuation assessment in GoHighLevel:', error);
      return {
        contactCreated: false,
        emailSent: false,
        webhookSent: false
      };
    }
  }

  private generateEmailTemplate(assessment: ValuationAssessment): string {
    const formatCurrency = (value: string | null) => {
      if (!value) return "$0";
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseFloat(value));
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Your Business Valuation Report</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .metrics { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .metric { display: inline-block; margin: 10px 20px 10px 0; }
          .metric-label { font-weight: bold; color: #64748b; }
          .metric-value { font-size: 18px; font-weight: bold; color: #1e3a8a; }
          .cta { background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Your Business Valuation Report</h1>
          <p>Professional valuation analysis for ${assessment.company || 'your business'}</p>
        </div>
        
        <div class="content">
          <h2>Dear ${assessment.firstName || 'Business Owner'},</h2>
          
          <p>Thank you for completing our comprehensive business valuation assessment. We've analyzed your business across multiple value drivers and prepared a detailed report with our findings.</p>
          
          <div class="metrics">
            <h3>Key Valuation Metrics</h3>
            <div class="metric">
              <div class="metric-label">Estimated Business Value Range</div>
              <div class="metric-value">${formatCurrency(assessment.lowEstimate)} - ${formatCurrency(assessment.highEstimate)}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Mid-Point Estimate</div>
              <div class="metric-value">${formatCurrency(assessment.midEstimate)}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Adjusted EBITDA</div>
              <div class="metric-value">${formatCurrency(assessment.adjustedEbitda)}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Valuation Multiple</div>
              <div class="metric-value">${assessment.valuationMultiple}x</div>
            </div>
            <div class="metric">
              <div class="metric-label">Overall Score</div>
              <div class="metric-value">Grade ${assessment.overallScore}</div>
            </div>
          </div>
          
          <h3>Next Steps</h3>
          <p>Based on your assessment results, we've identified several opportunities to enhance your business value. Our team at Meritage Partners specializes in helping business owners like you maximize valuation and prepare for successful exits.</p>
          
          ${assessment.followUpIntent === 'yes' ? 
            '<p><strong>We noticed you\'re interested in follow-up discussions.</strong> Our team will be reaching out to schedule a personalized strategy session to discuss your specific goals and value enhancement opportunities.</p>' 
            : ''
          }
          
          <a href="https://meritageadvisors.com/contact" class="cta">Schedule Your Strategy Session</a>
          
          <p>Best regards,<br>
          The Meritage Partners Team</p>
          
          <hr>
          <p style="font-size: 12px; color: #64748b;">
            This valuation is based on the information provided and current market conditions. For a comprehensive business valuation, please contact our team for a detailed analysis.
          </p>
        </div>
      </body>
      </html>
    `;
  }
}

export const goHighLevelService = new GoHighLevelService();