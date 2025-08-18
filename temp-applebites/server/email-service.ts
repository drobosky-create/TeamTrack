import nodemailer from 'nodemailer';
import { ValuationAssessment } from '@shared/schema';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure with environment variables or use a test account
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'ethereal.pass'
      }
    });
  }

  async sendValuationReport(assessment: ValuationAssessment, pdfBuffer: Buffer): Promise<void> {
    const formatCurrency = (value: string | null) => {
      if (!value) return '$0';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseFloat(value));
    };

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@applebites.com',
      to: assessment.email,
      subject: `Your Business Valuation Report - ${assessment.company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Apple Bites</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Business Valuation Platform</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #1e40af; margin-top: 0;">Your Valuation Report is Ready</h2>
            
            <p>Dear ${assessment.firstName} ${assessment.lastName},</p>
            
            <p>Thank you for using Apple Bites to assess the value of ${assessment.company}. Your comprehensive business valuation report has been completed and is attached to this email.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
              <h3 style="margin-top: 0; color: #1e40af;">Valuation Summary</h3>
              <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                <span>Estimated Value Range:</span>
                <strong>${formatCurrency(assessment.lowEstimate)} - ${formatCurrency(assessment.highEstimate)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                <span>Most Likely Value:</span>
                <strong style="color: #1e40af;">${formatCurrency(assessment.midEstimate)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                <span>Overall Score:</span>
                <strong>${assessment.overallScore}</strong>
              </div>
            </div>
            
            <p>The attached PDF report includes:</p>
            <ul>
              <li>Detailed valuation analysis and methodology</li>
              <li>Value driver assessment breakdown</li>
              <li>Executive summary and recommendations</li>
              <li>Benchmarking insights</li>
            </ul>
            
            ${assessment.followUpIntent === 'yes' ? `
            <div style="background: #eff6ff; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #1e40af;">
              <p style="margin: 0;"><strong>Next Steps:</strong> We noticed you're interested in discussing your results. Our team will reach out within 1-2 business days to schedule a consultation.</p>
            </div>
            ` : ''}
            
            <p>If you have any questions about your valuation report or would like to discuss your results, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>
            The Apple Bites Team</p>
          </div>
          
          <div style="background: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">
              This valuation is provided for informational purposes only. For formal appraisal needs, please consult with a certified business appraiser.
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `${assessment.company.replace(/[^a-zA-Z0-9]/g, '_')}_Valuation_Report.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send valuation report email');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
