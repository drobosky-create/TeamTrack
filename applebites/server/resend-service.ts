import { Resend } from 'resend';
import { ValuationAssessment } from '@shared/schema';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailAttachment {
  filename: string;
  content: Buffer;
  type: string;
}

export interface SendReportEmailOptions {
  assessment: ValuationAssessment;
  pdfBuffer: Buffer;
  tier: 'free' | 'paid';
  recipientEmail?: string;
}

export class ResendEmailService {
  private fromEmail = 'reports@meritageadvisors.com';
  private replyToEmail = 'support@meritageadvisors.com';

  async sendValuationReport({
    assessment,
    pdfBuffer,
    tier,
    recipientEmail
  }: SendReportEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const recipient = recipientEmail || assessment.email;
      const reportType = tier === 'paid' ? 'Strategic' : 'Starter';
      const filename = `${assessment.company}_${reportType}_Valuation_Report.pdf`;
      
      const emailContent = this.generateEmailHTML(assessment, tier);
      
      const result = await resend.emails.send({
        from: this.fromEmail,
        to: [recipient],
        replyTo: this.replyToEmail,
        subject: `Your ${reportType} Business Valuation Report - ${assessment.company}`,
        html: emailContent,
        attachments: [
          {
            filename,
            content: pdfBuffer,
          }
        ],
        tags: [
          {
            name: 'report_type',
            value: tier
          },
          {
            name: 'company',
            value: assessment.company?.substring(0, 50) || 'unknown'
          }
        ]
      });

      return {
        success: true,
        messageId: result.data?.id
      };
    } catch (error) {
      console.error('Error sending valuation report email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async sendFollowUpEmail(
    assessment: ValuationAssessment,
    followUpType: 'consultation' | 'value_improvement' | 'thank_you'
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const subject = this.getFollowUpSubject(assessment, followUpType);
      const emailContent = this.generateFollowUpHTML(assessment, followUpType);
      
      const result = await resend.emails.send({
        from: this.fromEmail,
        to: [assessment.email],
        replyTo: this.replyToEmail,
        subject,
        html: emailContent,
        tags: [
          {
            name: 'email_type',
            value: 'follow_up'
          },
          {
            name: 'follow_up_type',
            value: followUpType
          }
        ]
      });

      return {
        success: true,
        messageId: result.data?.id
      };
    } catch (error) {
      console.error('Error sending follow-up email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private generateEmailHTML(assessment: ValuationAssessment, tier: 'free' | 'paid'): string {
    const formatCurrency = (value: string | null) => {
      if (!value) return '$0';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseFloat(value));
    };

    const reportType = tier === 'paid' ? 'Strategic' : 'Starter';
    const isStrategic = tier === 'paid';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your ${reportType} Business Valuation Report</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 0; 
                background-color: #f8fafc;
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white; 
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
                background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); 
                color: white; 
                padding: 40px 30px; 
                text-align: center; 
            }
            .header h1 { 
                margin: 0 0 10px 0; 
                font-size: 28px; 
                font-weight: 700; 
            }
            .header p { 
                margin: 0; 
                font-size: 16px; 
                opacity: 0.9; 
            }
            .content { 
                padding: 40px 30px; 
            }
            .greeting { 
                font-size: 18px; 
                margin-bottom: 20px; 
            }
            .highlight-box { 
                background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); 
                border: 1px solid #bfdbfe; 
                border-radius: 8px; 
                padding: 25px; 
                margin: 25px 0; 
                text-align: center; 
            }
            .value-display { 
                font-size: 32px; 
                font-weight: bold; 
                color: #1e40af; 
                margin-bottom: 10px; 
            }
            .value-label { 
                color: #64748b; 
                font-size: 14px; 
            }
            .metrics { 
                display: flex; 
                justify-content: space-around; 
                margin: 20px 0; 
                flex-wrap: wrap;
            }
            .metric { 
                text-align: center; 
                margin: 10px; 
                flex: 1;
                min-width: 120px;
            }
            .metric-value { 
                font-size: 20px; 
                font-weight: bold; 
                color: #1e40af; 
            }
            .metric-label { 
                font-size: 12px; 
                color: #64748b; 
                margin-top: 5px; 
            }
            .feature-list { 
                margin: 25px 0; 
            }
            .feature-item { 
                display: flex; 
                align-items: center; 
                margin: 12px 0; 
                padding: 8px 0; 
            }
            .feature-icon { 
                width: 20px; 
                height: 20px; 
                background: #059669; 
                border-radius: 50%; 
                margin-right: 15px; 
                display: inline-block; 
            }
            .cta-button { 
                display: inline-block; 
                background: linear-gradient(135deg, #059669 0%, #0d9488 100%); 
                color: white; 
                padding: 15px 30px; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: bold; 
                margin: 20px 0; 
                text-align: center;
            }
            .footer { 
                background: #f1f5f9; 
                padding: 30px; 
                text-align: center; 
                color: #64748b; 
                font-size: 14px; 
            }
            .social-links { 
                margin: 20px 0; 
            }
            .social-links a { 
                color: #1e40af; 
                text-decoration: none; 
                margin: 0 10px; 
            }
            .disclaimer { 
                font-size: 12px; 
                color: #94a3b8; 
                margin-top: 20px; 
                text-align: left; 
                line-height: 1.4; 
            }
            @media (max-width: 600px) {
                .content { padding: 20px; }
                .header { padding: 30px 20px; }
                .metrics { flex-direction: column; }
                .value-display { font-size: 24px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Your ${reportType} Business Valuation Report</h1>
                <p>${isStrategic ? 'Comprehensive Strategic Analysis' : 'Professional Assessment'} for ${assessment.company}</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Dear ${assessment.firstName},
                </div>
                
                <p>Thank you for using our business valuation platform. Your ${reportType.toLowerCase()} report for <strong>${assessment.company}</strong> is now ready and attached to this email.</p>
                
                <div class="highlight-box">
                    <div class="value-display">${formatCurrency(assessment.midEstimate)}</div>
                    <div class="value-label">Estimated Business Value</div>
                    
                    <div class="metrics">
                        <div class="metric">
                            <div class="metric-value">${formatCurrency(assessment.lowEstimate)}</div>
                            <div class="metric-label">Low Estimate</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value">${formatCurrency(assessment.highEstimate)}</div>
                            <div class="metric-label">High Estimate</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value">${assessment.overallScore}</div>
                            <div class="metric-label">Overall Grade</div>
                        </div>
                    </div>
                </div>
                
                <h3>What's Included in Your ${reportType} Report:</h3>
                <div class="feature-list">
                    <div class="feature-item">
                        <span class="feature-icon"></span>
                        <span>Complete business valuation analysis</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon"></span>
                        <span>A-F grades for key value drivers</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon"></span>
                        <span>Visual performance assessments</span>
                    </div>
                    ${isStrategic ? `
                    <div class="feature-item">
                        <span class="feature-icon"></span>
                        <span>Industry-specific NAICS multiplier analysis</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon"></span>
                        <span>AI-powered strategic insights and recommendations</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon"></span>
                        <span>Market positioning bell curve analysis</span>
                    </div>
                    ` : ''}
                    <div class="feature-item">
                        <span class="feature-icon"></span>
                        <span>Actionable improvement recommendations</span>
                    </div>
                </div>
                
                ${assessment.followUpIntent === 'yes' ? `
                <p><strong>Next Steps:</strong> We noticed you're interested in follow-up discussions. Our team will be reaching out within 24-48 hours to schedule a personalized strategy session to discuss your specific goals and value enhancement opportunities.</p>
                ` : ''}
                
                ${!isStrategic ? `
                <p><strong>Want More Insights?</strong> Upgrade to our Strategic Report for industry-specific multipliers, AI-powered analysis, and comprehensive market positioning insights.</p>
                ` : ''}
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://meritageadvisors.com/contact" class="cta-button">
                        Schedule Your Strategy Session
                    </a>
                </div>
                
                <p>If you have any questions about your report or would like to discuss your valuation results, please don't hesitate to reach out.</p>
                
                <p>Best regards,<br>
                <strong>The Meritage Partners Team</strong><br>
                Business Valuation Specialists</p>
            </div>
            
            <div class="footer">
                <p><strong>Meritage Partners</strong></p>
                <p>Helping business owners maximize value and achieve successful exits</p>
                
                <div class="social-links">
                    <a href="https://meritageadvisors.com">Website</a> |
                    <a href="mailto:support@meritageadvisors.com">Contact</a> |
                    <a href="https://linkedin.com/company/meritage-partners">LinkedIn</a>
                </div>
                
                <div class="disclaimer">
                    <strong>Disclaimer:</strong> This valuation report is provided for informational purposes only and should not be considered as a formal business appraisal. ${isStrategic ? 'The strategic analysis includes industry-specific data and AI-generated insights.' : 'This starter report uses general industry metrics and may not reflect industry-specific conditions.'} For formal valuation purposes, we recommend consulting with a certified business appraiser. The actual value of a business may vary significantly based on market conditions, due diligence findings, and other factors not captured in this assessment.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private generateFollowUpHTML(assessment: ValuationAssessment, followUpType: string): string {
    const templates = {
      consultation: `
        <h2>Ready to Maximize Your Business Value?</h2>
        <p>Based on your recent valuation assessment for ${assessment.company}, we've identified several opportunities to enhance your business value.</p>
        <p>Our experts would like to schedule a complimentary 30-minute strategy session to discuss:</p>
        <ul>
          <li>Specific improvements that could increase your valuation</li>
          <li>Market positioning strategies</li>
          <li>Exit planning considerations</li>
          <li>Value driver optimization</li>
        </ul>
      `,
      value_improvement: `
        <h2>Value Enhancement Opportunities for ${assessment.company}</h2>
        <p>Your business shows strong potential, and we've identified specific areas where strategic improvements could significantly increase your valuation.</p>
        <p>Let's discuss how to optimize your value drivers and positioning for future growth or exit opportunities.</p>
      `,
      thank_you: `
        <h2>Thank You for Using Our Valuation Platform</h2>
        <p>We hope the valuation report for ${assessment.company} provided valuable insights into your business value and growth opportunities.</p>
        <p>Our team is here to support your continued success with strategic guidance and expert advice.</p>
      `
    };

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Follow-up from Meritage Partners</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .cta-button { 
                display: inline-block; 
                background: #059669; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 6px; 
                margin: 20px 0; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Meritage Partners</h1>
            </div>
            <div class="content">
                <p>Dear ${assessment.firstName},</p>
                ${templates[followUpType as keyof typeof templates]}
                <div style="text-align: center;">
                    <a href="https://meritageadvisors.com/contact" class="cta-button">Schedule a Call</a>
                </div>
                <p>Best regards,<br>The Meritage Partners Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private getFollowUpSubject(assessment: ValuationAssessment, followUpType: string): string {
    const subjects = {
      consultation: `Next Steps for ${assessment.company} - Strategic Value Enhancement`,
      value_improvement: `Maximize Your Business Value - ${assessment.company}`,
      thank_you: `Thank You - Your Business Valuation Report`
    };

    return subjects[followUpType as keyof typeof subjects] || 'Follow-up from Meritage Partners';
  }
}

export const resendEmailService = new ResendEmailService();