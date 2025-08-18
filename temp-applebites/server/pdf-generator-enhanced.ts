import puppeteer from 'puppeteer';
import { ValuationAssessment } from '@shared/schema';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getMultiplierByNAICS, calculateWeightedMultiplier } from './config/naicsMultipliers';

const execAsync = promisify(exec);

export async function generateEnhancedValuationPDF(
  assessment: ValuationAssessment,
  tier: 'free' | 'paid' = 'paid'
): Promise<Buffer> {
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
    
    const htmlContent = generateEnhancedHTMLReport(assessment, tier);
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

function generateValuationSliderSVG(currentGrade: string, tier: 'free' | 'paid'): string {
  const gradePositions = { 'F': 10, 'D': 30, 'C': 50, 'B': 70, 'A': 90 };
  const position = gradePositions[currentGrade as keyof typeof gradePositions] || 50;
  
  const watermark = tier === 'free' ? '<text x="200" y="45" font-family="Arial" font-size="12" fill="#e2e8f0" text-anchor="middle">STARTER REPORT</text>' : '';
  
  return `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="400" height="80" viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="performanceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#dc2626;stop-opacity:1" />
          <stop offset="25%" style="stop-color:#ea580c;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#0891b2;stop-opacity:1" />
          <stop offset="75%" style="stop-color:#0d9488;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background track -->
      <rect x="50" y="25" width="300" height="12" rx="6" fill="url(#performanceGradient)" />
      
      <!-- Grade labels -->
      <text x="50" y="20" font-family="Arial" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">F</text>
      <text x="125" y="20" font-family="Arial" font-size="12" font-weight="bold" fill="#ea580c" text-anchor="middle">D</text>
      <text x="200" y="20" font-family="Arial" font-size="12" font-weight="bold" fill="#0891b2" text-anchor="middle">C</text>
      <text x="275" y="20" font-family="Arial" font-size="12" font-weight="bold" fill="#0d9488" text-anchor="middle">B</text>
      <text x="350" y="20" font-family="Arial" font-size="12" font-weight="bold" fill="#059669" text-anchor="middle">A</text>
      
      <!-- Current position indicator -->
      <circle cx="${50 + (position / 100) * 300}" cy="31" r="8" fill="white" stroke="#1e40af" stroke-width="3" />
      <text x="${50 + (position / 100) * 300}" y="36" font-family="Arial" font-size="10" font-weight="bold" fill="#1e40af" text-anchor="middle">${currentGrade}</text>
      
      <!-- Current grade label -->
      <text x="200" y="60" font-family="Arial" font-size="14" font-weight="bold" fill="#1e40af" text-anchor="middle">Your Current Grade: ${currentGrade}</text>
      
      ${watermark}
    </svg>
  `).toString('base64')}`;
}

function generateBellCurveSVG(
  currentMultiple: number,
  industryRange: { low: number; high: number; base: number },
  tier: 'free' | 'paid'
): string {
  if (tier === 'free') {
    return ''; // No bell curve for free tier
  }
  
  const width = 400;
  const height = 200;
  const xScale = width / (industryRange.high - industryRange.low + 2);
  const currentX = (currentMultiple - industryRange.low + 1) * xScale;
  
  return `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bellGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.3" />
        </linearGradient>
      </defs>
      
      <!-- Bell curve path -->
      <path d="M 50 150 Q 200 50 350 150" stroke="#3b82f6" stroke-width="2" fill="url(#bellGradient)" />
      
      <!-- Industry range markers -->
      <line x1="${(industryRange.low - industryRange.low + 1) * xScale}" y1="140" x2="${(industryRange.low - industryRange.low + 1) * xScale}" y2="160" stroke="#64748b" stroke-width="2" />
      <line x1="${(industryRange.high - industryRange.low + 1) * xScale}" y1="140" x2="${(industryRange.high - industryRange.low + 1) * xScale}" y2="160" stroke="#64748b" stroke-width="2" />
      
      <!-- Current position -->
      <line x1="${currentX}" y1="30" x2="${currentX}" y2="170" stroke="#dc2626" stroke-width="3" stroke-dasharray="5,5" />
      <circle cx="${currentX}" cy="25" r="6" fill="#dc2626" />
      
      <!-- Labels -->
      <text x="50" y="180" font-family="Arial" font-size="12" fill="#64748b" text-anchor="middle">${industryRange.low}x</text>
      <text x="200" y="180" font-family="Arial" font-size="12" fill="#64748b" text-anchor="middle">${industryRange.base}x</text>
      <text x="350" y="180" font-family="Arial" font-size="12" fill="#64748b" text-anchor="middle">${industryRange.high}x</text>
      <text x="${currentX}" y="15" font-family="Arial" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">Your Multiple: ${currentMultiple}x</text>
      
      <text x="200" y="195" font-family="Arial" font-size="14" font-weight="bold" fill="#1e40af" text-anchor="middle">Industry Valuation Range</text>
    </svg>
  `).toString('base64')}`;
}

function generateEnhancedHTMLReport(assessment: ValuationAssessment, tier: 'free' | 'paid'): string {
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

  // Get industry multiplier data
  const multiplierData = assessment.naicsCode ? 
    getMultiplierByNAICS(assessment.naicsCode) : 
    { label: 'General Business', lowMultiple: 3, baseMultiple: 4, highMultiple: 8 };

  const reportTitle = tier === 'paid' ? 'Strategic Business Valuation Report' : 'Business Valuation - Starter Report';
  const tierBadge = tier === 'free' ? '<div style="position: absolute; top: 20px; right: 30px; background: #f59e0b; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold;">STARTER REPORT</div>' : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportTitle} - ${assessment.company}</title>
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
            font-size: ${tier === 'paid' ? '28px' : '24px'};
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
            ${tier === 'free' ? 'opacity: 0.9;' : ''}
        }
        
        .tier-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
        }
        
        .valuation-summary {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 30px;
            border: 1px solid #bfdbfe;
            position: relative;
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
            ${tier === 'free' ? 'page-break-inside: avoid;' : ''}
        }
        
        .section h2 {
            color: #1e40af;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: ${tier === 'paid' ? '1fr 1fr' : '1fr'};
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
            grid-template-columns: ${tier === 'paid' ? '1fr 1fr' : '1fr'};
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
        
        .visual-section {
            background: #fefefe;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .narrative {
            background: #fefefe;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            line-height: 1.8;
        }
        
        .limitation-notice {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            font-size: 14px;
        }
        
        .upgrade-cta {
            background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
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
        ${tierBadge}
        <img src="${getMeritageLogoBase64()}" alt="Meritage Partners Logo" class="logo">
        <h1>${reportTitle}</h1>
        <p>${tier === 'paid' ? 'Comprehensive Industry-Specific Analysis' : 'Basic Valuation Assessment'}</p>
    </div>
    
    <div class="content">
        <div class="company-info">
            <h2 style="margin-top: 0; color: #0f172a;">Company Information</h2>
            <p><strong>Company:</strong> ${assessment.company}</p>
            <p><strong>Contact:</strong> ${assessment.firstName} ${assessment.lastName}</p>
            ${tier === 'paid' && assessment.foundingYear ? `<p><strong>Founded:</strong> ${assessment.foundingYear}</p>` : ''}
            ${tier === 'paid' && assessment.industryDescription ? `<p><strong>Industry:</strong> ${assessment.industryDescription}</p>` : ''}
            ${tier === 'paid' && assessment.naicsCode ? `<p><strong>NAICS Code:</strong> ${assessment.naicsCode}</p>` : ''}
            <p><strong>Report Date:</strong> ${formatDate(assessment.createdAt)}</p>
            <p><strong>Report Type:</strong> ${tier === 'paid' ? 'Strategic Analysis' : 'Starter Assessment'}</p>
        </div>
        
        ${tier === 'free' ? `
        <div class="limitation-notice">
            <strong>Starter Report Limitations:</strong> This report uses general industry metrics and does not include NAICS-specific multipliers, AI-generated narratives, or downloadable formats. For comprehensive analysis with industry-specific valuations and strategic insights, upgrade to our Strategic Report.
        </div>
        ` : ''}
        
        <div class="valuation-summary">
            <h2 style="margin-top: 0; color: #1e40af;">Estimated Business Value</h2>
            ${tier === 'paid' ? `<p><strong>Industry:</strong> ${multiplierData.label}</p>` : ''}
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
                    <div class="metric-label">Adjusted EBITDA</div>
                    <div class="metric-value">${formatCurrency(assessment.adjustedEbitda)}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Valuation Multiple</div>
                    <div class="metric-value">${assessment.valuationMultiple}x</div>
                </div>
                ${tier === 'paid' ? `
                <div class="metric-card">
                    <div class="metric-label">Industry Range</div>
                    <div class="metric-value">${multiplierData.lowMultiple}x - ${multiplierData.highMultiple}x</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Overall Score</div>
                    <div class="metric-value">${assessment.overallScore}</div>
                </div>
                ` : `
                <div class="metric-card">
                    <div class="metric-label">Overall Score</div>
                    <div class="metric-value">${assessment.overallScore}</div>
                </div>
                `}
            </div>
        </div>
        
        <div class="section">
            <h2>Value Driver Assessment</h2>
            <div class="visual-section">
                <img src="${generateValuationSliderSVG(assessment.overallScore || 'C', tier)}" alt="Valuation Score Slider" style="max-width: 100%; height: auto;" />
            </div>
            
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
                    ${tier === 'paid' ? `
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
                    ` : ''}
                </div>
            </div>
        </div>
        
        ${tier === 'paid' && assessment.valuationMultiple ? `
        <div class="section">
            <h2>Industry Valuation Analysis</h2>
            <div class="visual-section">
                <img src="${generateBellCurveSVG(
                  parseFloat(assessment.valuationMultiple), 
                  { low: multiplierData.lowMultiple, high: multiplierData.highMultiple, base: multiplierData.baseMultiple },
                  tier
                )}" alt="Industry Valuation Bell Curve" style="max-width: 100%; height: auto;" />
                <p style="margin-top: 15px; color: #64748b; font-size: 14px;">
                    Your business multiple of ${assessment.valuationMultiple}x is positioned ${
                      parseFloat(assessment.valuationMultiple) > multiplierData.baseMultiple ? 'above' : 
                      parseFloat(assessment.valuationMultiple) < multiplierData.baseMultiple ? 'below' : 'at'
                    } the industry average of ${multiplierData.baseMultiple}x for ${multiplierData.label} businesses.
                </p>
            </div>
        </div>
        ` : ''}
        
        ${tier === 'paid' && assessment.executiveSummary ? `
        <div class="section">
            <h2>Executive Summary</h2>
            <div class="narrative">
                <p>${assessment.executiveSummary}</p>
            </div>
        </div>
        ` : ''}
        
        ${tier === 'free' ? `
        <div class="upgrade-cta">
            <h3 style="margin-top: 0; color: white;">Unlock Full Strategic Analysis</h3>
            <p style="margin-bottom: 0; color: white;">Get industry-specific multipliers, AI-generated insights, professional PDF reports, and comprehensive strategic recommendations.</p>
        </div>
        ` : ''}
        
        <div class="footer">
            <p><strong>Meritage Partners - Business Valuation Specialists</strong></p>
            <p>This ${tier === 'paid' ? 'strategic' : 'starter'} report was generated on ${formatDate(assessment.createdAt)}</p>
            
            <div class="disclaimer">
                <p><strong>Disclaimer:</strong> This valuation report is provided for informational purposes only and should not be considered as a formal business appraisal. ${tier === 'free' ? 'This starter report uses general industry metrics and may not reflect industry-specific conditions. ' : 'The strategic analysis includes industry-specific data and AI-generated insights. '}For formal valuation purposes, we recommend consulting with a certified business appraiser.</p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}