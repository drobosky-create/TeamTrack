import { ValuationAssessment } from "@shared/schema";

export interface EmailCampaignConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

export interface CampaignTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  triggerCondition: (assessment: ValuationAssessment) => boolean;
  delayHours?: number;
}

export class EmailCampaignService {
  private config: EmailCampaignConfig;
  private templates: CampaignTemplate[] = [];

  constructor() {
    this.config = {
      apiKey: process.env.SENDGRID_API_KEY || '',
      fromEmail: 'brian@applebites.com',
      fromName: 'Brian Franco - Apple Bites Valuation'
    };

    this.initializeTemplates();
  }

  private initializeTemplates() {
    this.templates = [
      {
        id: 'high-value-follow-up',
        name: 'High Value Follow-up',
        subject: 'Your {{company}} Valuation Report - Next Steps',
        triggerCondition: (assessment) => {
          const valuation = parseFloat(assessment.midEstimate || '0');
          return valuation > 2000000 && assessment.followUpIntent === 'yes';
        },
        delayHours: 1,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af;">Thank you for completing your business valuation, {{firstName}}!</h2>
            
            <p>Your {{company}} assessment shows significant value potential:</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0; color: #374151;">Valuation Summary</h3>
              <ul style="margin: 10px 0;">
                <li><strong>Current Valuation:</strong> ${{estimatedValue}}</li>
                <li><strong>Operational Grade:</strong> {{overallScore}}</li>
                <li><strong>EBITDA Multiple:</strong> {{valuationMultiple}}x</li>
              </ul>
            </div>

            <p>Based on your results, I'd like to discuss specific strategies to maximize your business value. These typically include:</p>
            
            <ul>
              <li>Operational efficiency improvements</li>
              <li>Revenue diversification strategies</li>
              <li>Exit planning and timing optimization</li>
              <li>Value driver enhancement programs</li>
            </ul>

            <p style="background: #dbeafe; padding: 15px; border-radius: 8px;">
              <strong>Next Step:</strong> Schedule a complimentary 30-minute strategy call to review your specific opportunities.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://api.leadconnectorhq.com/widget/bookings/applebites" 
                 style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Schedule Strategy Call
              </a>
            </div>

            <p>Best regards,<br>
            <strong>Brian Franco</strong><br>
            Senior Business Advisor<br>
            Apple Bites Valuation<br>
            (949) 522-9121</p>
          </div>
        `,
        textContent: `
Thank you for completing your business valuation, {{firstName}}!

Your {{company}} assessment shows significant value potential:

Valuation Summary:
- Current Valuation: ${{estimatedValue}}
- Operational Grade: {{overallScore}}
- EBITDA Multiple: {{valuationMultiple}}x

Based on your results, I'd like to discuss specific strategies to maximize your business value.

Schedule a complimentary strategy call: https://api.leadconnectorhq.com/widget/bookings/applebites

Best regards,
Brian Franco
Senior Business Advisor
Apple Bites Valuation
(949) 522-9121
        `
      },

      {
        id: 'improvement-opportunity',
        name: 'Improvement Opportunity Follow-up',
        subject: 'Unlock {{company}}\'s Hidden Value Potential',
        triggerCondition: (assessment) => {
          const grade = assessment.overallScore?.charAt(0);
          return ['C', 'D', 'F'].includes(grade || '') && assessment.followUpIntent !== 'no';
        },
        delayHours: 4,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">{{firstName}}, significant value opportunity identified</h2>
            
            <p>Your {{company}} valuation revealed substantial room for improvement that could dramatically increase your business value.</p>
            
            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0;">
              <h3 style="margin: 0; color: #991b1b;">Current Assessment</h3>
              <p style="margin: 10px 0;"><strong>Operational Grade:</strong> {{overallScore}}</p>
              <p style="margin: 10px 0;"><strong>Current Valuation:</strong> ${{estimatedValue}}</p>
            </div>

            <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0;">
              <h3 style="margin: 0; color: #166534;">Improvement Potential</h3>
              <p style="margin: 10px 0;">By addressing key operational areas, businesses like yours typically see:</p>
              <ul>
                <li><strong>50-150% valuation increase</strong> within 12-24 months</li>
                <li><strong>Improved cash flow</strong> and operational efficiency</li>
                <li><strong>Enhanced exit readiness</strong> and buyer appeal</li>
              </ul>
            </div>

            <p>The specific areas we'd focus on for {{company}} include:</p>
            <ul>
              <li>Financial performance optimization</li>
              <li>Operational process improvements</li>
              <li>Market positioning enhancements</li>
              <li>Risk mitigation strategies</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://api.leadconnectorhq.com/widget/bookings/applebites" 
                 style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Explore Value Improvement Plan
              </a>
            </div>

            <p>Best regards,<br>
            <strong>Brian Franco</strong><br>
            Value Enhancement Specialist<br>
            Apple Bites Valuation</p>
          </div>
        `,
        textContent: `
{{firstName}}, significant value opportunity identified

Your {{company}} valuation revealed substantial room for improvement.

Current Assessment:
- Operational Grade: {{overallScore}}
- Current Valuation: ${{estimatedValue}}

By addressing key operational areas, you could see 50-150% valuation increase within 12-24 months.

Explore your value improvement plan: https://api.leadconnectorhq.com/widget/bookings/applebites

Best regards,
Brian Franco
Value Enhancement Specialist
Apple Bites Valuation
        `
      },

      {
        id: 'moderate-interest-nurture',
        name: 'Moderate Interest Nurturing',
        subject: 'Business valuation insights for {{company}}',
        triggerCondition: (assessment) => {
          return assessment.followUpIntent === 'maybe';
        },
        delayHours: 24,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af;">Additional insights for {{company}}</h2>
            
            <p>Hi {{firstName}},</p>
            
            <p>I wanted to follow up on your recent business valuation and share some additional insights that might be valuable for {{company}}.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #475569;">Market Trends in Your Industry</h3>
              <ul>
                <li>Current market multiples are favorable for businesses with strong operational grades</li>
                <li>Buyers are prioritizing companies with diversified revenue streams</li>
                <li>Digital transformation initiatives are adding significant value premiums</li>
              </ul>
            </div>

            <p>Even if you're not planning an immediate exit, understanding and improving your business value drivers can:</p>
            <ul>
              <li>Increase profitability and cash flow</li>
              <li>Reduce operational risks</li>
              <li>Create more strategic options for the future</li>
            </ul>

            <p>Would you be interested in a brief, no-obligation conversation about value enhancement strategies specific to your situation?</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://api.leadconnectorhq.com/widget/bookings/applebites" 
                 style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Schedule Brief Consultation
              </a>
            </div>

            <p>Best regards,<br>
            <strong>Brian Franco</strong><br>
            Apple Bites Valuation</p>
          </div>
        `,
        textContent: `
Hi {{firstName}},

I wanted to follow up on your recent business valuation for {{company}} and share some additional market insights.

Current trends show favorable conditions for businesses focused on operational improvements and value driver enhancement.

Would you be interested in a brief consultation about value enhancement strategies?

Schedule here: https://api.leadconnectorhq.com/widget/bookings/applebites

Best regards,
Brian Franco
Apple Bites Valuation
        `
      }
    ];
  }

  private replaceTemplateVariables(content: string, assessment: ValuationAssessment): string {
    return content
      .replace(/\{\{firstName\}\}/g, assessment.firstName || '')
      .replace(/\{\{lastName\}\}/g, assessment.lastName || '')
      .replace(/\{\{company\}\}/g, assessment.company || '')
      .replace(/\{\{email\}\}/g, assessment.email || '')
      .replace(/\{\{midEstimate\}\}/g, Math.round(parseFloat(assessment.midEstimate || '0')).toLocaleString())
      .replace(/\{\{overallScore\}\}/g, assessment.overallScore || '')
      .replace(/\{\{valuationMultiple\}\}/g, assessment.valuationMultiple || '');
  }

  async sendCampaignEmail(templateId: string, assessment: ValuationAssessment): Promise<boolean> {
    if (!this.config.apiKey) {
      console.error('SendGrid API key not configured for email campaigns');
      return false;
    }

    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      console.error(`Email template not found: ${templateId}`);
      return false;
    }

    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(this.config.apiKey);

      const msg = {
        to: assessment.email,
        from: {
          email: this.config.fromEmail,
          name: this.config.fromName
        },
        subject: this.replaceTemplateVariables(template.subject, assessment),
        text: this.replaceTemplateVariables(template.textContent, assessment),
        html: this.replaceTemplateVariables(template.htmlContent, assessment),
        categories: ['valuation-campaign', templateId],
        customArgs: {
          assessmentId: assessment.id?.toString() || '',
          campaignType: templateId,
          company: assessment.company || ''
        }
      };

      await sgMail.send(msg);
      console.log(`Campaign email sent: ${templateId} to ${assessment.email}`);
      return true;
    } catch (error) {
      console.error('Failed to send campaign email:', error);
      return false;
    }
  }

  async triggerCampaigns(assessment: ValuationAssessment): Promise<void> {
    const applicableTemplates = this.templates.filter(template => 
      template.triggerCondition(assessment)
    );

    for (const template of applicableTemplates) {
      const delayMs = (template.delayHours || 0) * 60 * 60 * 1000;
      
      if (delayMs > 0) {
        // Schedule delayed email
        setTimeout(async () => {
          await this.sendCampaignEmail(template.id, assessment);
        }, delayMs);
        
        console.log(`Scheduled campaign email: ${template.id} for ${assessment.email} in ${template.delayHours} hours`);
      } else {
        // Send immediately
        await this.sendCampaignEmail(template.id, assessment);
      }
    }
  }

  getApplicableTemplates(assessment: ValuationAssessment): CampaignTemplate[] {
    return this.templates.filter(template => template.triggerCondition(assessment));
  }
}

export const emailCampaignService = new EmailCampaignService();