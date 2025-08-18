import puppeteer from 'puppeteer';
import { ValuationAssessment } from '@shared/schema';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

export async function generateValuationPDF(assessment: ValuationAssessment): Promise<Buffer> {
  // Get the correct chromium path
  let executablePath: string | undefined;
  try {
    const { stdout } = await execAsync('which chromium');
    executablePath = stdout.trim();
  } catch (error) {
    console.error('Could not find chromium executable:', error);
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    
    const htmlContent = generateHTMLReport(assessment);
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

function getMeritageLogoBase64(): string {
  try {
    const logoPath = join(process.cwd(), 'attached_assets/Meritage Logo2.png');
    const logoBuffer = readFileSync(logoPath);
    return `data:image/png;base64,${logoBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Could not load Meritage logo:', error);
    // Fallback to a simple SVG version
    return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjQwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjQwIiBoZWlnaHQ9IjgwIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjMWU0MGFmIiBzdHJva2Utd2lkdGg9IjIiLz4KPHR5ZXh0IHg9IjEyMCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMxZTQwYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1FUklUQUdFPC90ZXh0Pgo8dGV4dCB4PSIxMjAiIHk9IjU4IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZjViZDQyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QQVJUTEVSU0s8L3RleHQ+Cjwvc3ZnPgo=`;
  }
}

function generateHTMLReport(assessment: ValuationAssessment): string {
  const formatCurrency = (value: string | null) => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return new Date().toLocaleDateString();
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Valuation Report - ${assessment.company}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        
        .header {
            background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
            min-height: 120px;
        }
        
        .logo {
            position: absolute;
            top: 20px;
            left: 30px;
            max-height: 80px;
            max-width: 240px;
        }
        
        .header h1 {
            margin: 20px 0 0 0;
            font-size: 28px;
            font-weight: bold;
        }
        
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px;
        }
        
        .company-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .valuation-summary {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 30px;
            border: 1px solid #bfdbfe;
        }
        
        .valuation-range {
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
        }
        
        .valuation-item {
            text-align: center;
        }
        
        .valuation-amount {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
        }
        
        .valuation-label {
            font-size: 14px;
            color: #64748b;
            margin-top: 5px;
        }
        
        .primary-amount {
            font-size: 32px !important;
            color: #0f172a !important;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section h2 {
            color: #1e40af;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .metric-card {
            background: #f8fafc;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        
        .metric-label {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 5px;
        }
        
        .metric-value {
            font-size: 18px;
            font-weight: bold;
            color: #0f172a;
        }
        
        .value-drivers {
            background: #fefefe;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        
        .driver-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
        }
        
        .driver-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: #f8fafc;
            border-radius: 4px;
        }
        
        .grade {
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
            color: white;
        }
        
        .grade-a { background-color: #059669; }
        .grade-b { background-color: #0d9488; }
        .grade-c { background-color: #0891b2; }
        .grade-d { background-color: #ea580c; }
        .grade-f { background-color: #dc2626; }
        
        .narrative {
            background: #fefefe;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            line-height: 1.8;
        }
        
        .footer {
            background: #f1f5f9;
            padding: 20px;
            text-align: center;
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
        }
        
        .disclaimer {
            font-size: 12px;
            color: #64748b;
            margin-top: 15px;
            text-align: left;
        }
        
        @media print {
            .content { padding: 20px; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="${getMeritageLogoBase64()}" alt="Meritage Partners Logo" class="logo">
        <h1>Business Valuation Report</h1>
        <p>Comprehensive Analysis & Assessment</p>
    </div>
    
    <div class="content">
        <div class="company-info">
            <h2 style="margin-top: 0; color: #0f172a;">Company Information</h2>
            <p><strong>Company:</strong> ${assessment.company}</p>
            <p><strong>Contact:</strong> ${assessment.firstName} ${assessment.lastName}</p>
            <p><strong>Email:</strong> ${assessment.email}</p>
            <p><strong>Report Date:</strong> ${formatDate(assessment.createdAt)}</p>
        </div>
        
        <div class="valuation-summary">
            <h2 style="margin-top: 0; color: #1e40af;">Estimated Business Value</h2>
            <div class="valuation-range">
                <div class="valuation-item">
                    <div class="valuation-amount">${formatCurrency(assessment.lowEstimate)}</div>
                    <div class="valuation-label">Low Estimate</div>
                </div>
                <div class="valuation-item">
                    <div class="valuation-amount primary-amount">${formatCurrency(assessment.midEstimate)}</div>
                    <div class="valuation-label">Most Likely Value</div>
                </div>
                <div class="valuation-item">
                    <div class="valuation-amount">${formatCurrency(assessment.highEstimate)}</div>
                    <div class="valuation-label">High Estimate</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2>Financial Summary</h2>
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-label">Base EBITDA</div>
                    <div class="metric-value">${formatCurrency(assessment.baseEbitda)}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Adjusted EBITDA</div>
                    <div class="metric-value">${formatCurrency(assessment.adjustedEbitda)}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Valuation Multiple</div>
                    <div class="metric-value">${assessment.valuationMultiple}x</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Overall Score</div>
                    <div class="metric-value">${assessment.overallScore}</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2>Value Driver Assessment</h2>
            <div class="value-drivers">
                <div class="driver-grid">
                    <div class="driver-item">
                        <span>Financial Performance</span>
                        <span class="grade grade-${assessment.financialPerformance?.toLowerCase()}">${assessment.financialPerformance}</span>
                    </div>
                    <div class="driver-item">
                        <span>Customer Concentration</span>
                        <span class="grade grade-${assessment.customerConcentration?.toLowerCase()}">${assessment.customerConcentration}</span>
                    </div>
                    <div class="driver-item">
                        <span>Management Team</span>
                        <span class="grade grade-${assessment.managementTeam?.toLowerCase()}">${assessment.managementTeam}</span>
                    </div>
                    <div class="driver-item">
                        <span>Competitive Position</span>
                        <span class="grade grade-${assessment.competitivePosition?.toLowerCase()}">${assessment.competitivePosition}</span>
                    </div>
                    <div class="driver-item">
                        <span>Growth Prospects</span>
                        <span class="grade grade-${assessment.growthProspects?.toLowerCase()}">${assessment.growthProspects}</span>
                    </div>
                    <div class="driver-item">
                        <span>Systems & Processes</span>
                        <span class="grade grade-${assessment.systemsProcesses?.toLowerCase()}">${assessment.systemsProcesses}</span>
                    </div>
                    <div class="driver-item">
                        <span>Asset Quality</span>
                        <span class="grade grade-${assessment.assetQuality?.toLowerCase()}">${assessment.assetQuality}</span>
                    </div>
                    <div class="driver-item">
                        <span>Industry Outlook</span>
                        <span class="grade grade-${assessment.industryOutlook?.toLowerCase()}">${assessment.industryOutlook}</span>
                    </div>
                    <div class="driver-item">
                        <span>Risk Factors</span>
                        <span class="grade grade-${assessment.riskFactors?.toLowerCase()}">${assessment.riskFactors}</span>
                    </div>
                    <div class="driver-item">
                        <span>Owner Dependency</span>
                        <span class="grade grade-${assessment.ownerDependency?.toLowerCase()}">${assessment.ownerDependency}</span>
                    </div>
                </div>
            </div>
        </div>
        
        ${assessment.narrativeSummary ? `
        <div class="section">
            <h2>Executive Summary</h2>
            <div class="narrative">
                <p>${assessment.narrativeSummary}</p>
            </div>
        </div>
        ` : ''}
        
        <div class="footer">
            <p><strong>Meritage Partners - Business Valuation Specialists</strong></p>
            <p>This report was generated on ${formatDate(assessment.createdAt)}</p>
            
            <div class="disclaimer">
                <p><strong>Disclaimer:</strong> This valuation report is provided for informational purposes only and should not be considered as a formal business appraisal. The estimates provided are based on the information submitted and industry benchmarks. For formal valuation purposes, we recommend consulting with a certified business appraiser. The actual value of a business may vary significantly based on market conditions, due diligence findings, and other factors not captured in this assessment.</p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}