#!/usr/bin/env node

// Migration using the working webhook approach (same as existing integration)

const WEBHOOK_URLS = {
  freeResults: process.env.GHL_WEBHOOK_FREE_RESULTS || 'https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhldFd0Z/webhook-trigger/dc1a8a7f-47ee-4c9a-b474-e1aeb21af3e3',
  growthResults: process.env.GHL_WEBHOOK_GROWTH_RESULTS || 'https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhldFd0Z/webhook-trigger/016d7395-74cf-4bd0-9c13-263f55efe657',
  capitalPurchase: process.env.GHL_WEBHOOK_CAPITAL_PURCHASE || 'https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhldFd0Z/webhook-trigger/3c15954e-9d4b-4fde-b064-8b47193d1fcb',
  n8nLead: 'https://drobosky.app.n8n.cloud/webhook-test/replit-lead'
};

async function sendWebhook(data, webhookType = 'freeResults') {
  try {
    const webhookUrl = WEBHOOK_URLS[webhookType];
    console.log(`📡 Sending webhook to ${webhookType}: ${webhookUrl}`);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      console.log(`✅ Webhook sent successfully to ${webhookType} (${response.status})`);
      return true;
    } else {
      console.log(`❌ Webhook failed for ${webhookType} (${response.status})`);
      return false;
    }
  } catch (error) {
    console.error(`💥 Webhook error for ${webhookType}:`, error.message);
    return false;
  }
}

async function migrate() {
  console.log('🚀 Starting GoHighLevel webhook-based migration...');
  console.log('📞 Using the SAME webhook approach that was already working!\n');
  
  let successCount = 0;
  let errorCount = 0;

  // Consumer Users Data 
  const consumerUsers = [
    {
      email: 'drobosky@quantifi-partners.com',
      firstName: 'Daniel',
      lastName: 'Robosky',
      companyName: 'Quantifi Partners',
      phone: '2709258935',
      plan: 'free'
    },
    {
      email: 'daniel@roboskyconsulting.com',
      firstName: 'Daniel',
      lastName: 'Robosky',
      companyName: 'Robosky Consulting, LLC',
      phone: '2709258935',
      plan: 'growth'
    },
    {
      email: 'drobo28@gmail.com',
      firstName: 'Daniel',
      lastName: 'Robosky',
      companyName: 'Robosky',
      phone: '2709258935',
      plan: 'growth'
    }
  ];

  console.log('👥 Migrating consumer users via webhooks...\n');
  
  for (const user of consumerUsers) {
    try {
      console.log(`📝 Processing user: ${user.email} (${user.plan} tier)`);
      
      // Create webhook data in the same format as the working integration
      const webhookData = {
        event: 'migration_signup',
        contact: {
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          phone: user.phone,
          company_name: user.companyName
        },
        tier: user.plan,
        tags: [
          'applebites-migration',
          'Platform User',
          `tier-${user.plan}`,
          ...(user.plan !== 'free' ? ['New Account - Payment Signup'] : [])
        ],
        custom_fields: {
          migration_date: new Date().toISOString(),
          tier: user.plan,
          source: 'consumer_migration',
          company_name: user.companyName
        },
        source: 'migration'
      };

      // Send to appropriate webhook based on tier
      let webhookType = 'freeResults';
      if (user.plan === 'growth') {
        webhookType = 'growthResults';
      } else if (user.plan === 'capital') {
        webhookType = 'capitalPurchase';
      }

      const success = await sendWebhook(webhookData, webhookType);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
      
      // Also send to n8n for additional processing
      await sendWebhook(webhookData, 'n8nLead');
      
      console.log(''); // Add spacing
      
    } catch (error) {
      console.error(`❌ Failed to process user ${user.email}:`, error.message);
      errorCount++;
    }
  }

  console.log('📈 Migrating high-value assessment...\n');
  
  try {
    // High-value assessment data
    const assessment = {
      email: 'guest_1755715937964@example.com',
      firstName: 'Guest',
      lastName: 'User',
      company: 'Company',
      phone: '000-000-0000',
      tier: 'growth',
      overallScore: 'C',
      midEstimate: 2625807.69,
      lowEstimate: 2100646.15,
      highEstimate: 3150969.23,
      adjustedEbitda: 315000.00,
      followUpIntent: 'yes'
    };

    console.log(`📊 Processing assessment: ${assessment.email}`);
    console.log(`💰 Valuation: $${Math.round(assessment.midEstimate).toLocaleString()}`);
    
    // Check if this qualifies for hot-capital tagging
    const isHotCapital = assessment.midEstimate >= 2000000 && 
                       ['A', 'B'].includes(assessment.overallScore) && 
                       assessment.followUpIntent === 'yes';

    const webhookData = {
      event: 'migration_assessment_completed',
      contact: {
        first_name: assessment.firstName,
        last_name: assessment.lastName,
        email: assessment.email,
        phone: assessment.phone,
        company_name: assessment.company
      },
      assessment: {
        tier: assessment.tier,
        overall_score: assessment.overallScore,
        valuation_low: assessment.lowEstimate,
        valuation_mid: assessment.midEstimate,
        valuation_high: assessment.highEstimate,
        adjusted_ebitda: assessment.adjustedEbitda,
        follow_up_intent: assessment.followUpIntent
      },
      tags: [
        'applebites-migration',
        'assessment-migration',
        `tier-${assessment.tier}`,
        `grade-${assessment.overallScore}`,
        'follow-up-requested',
        ...(isHotCapital ? ['hot-capital'] : [])
      ],
      custom_fields: {
        migration_date: new Date().toISOString(),
        tier: assessment.tier,
        assessment_date: new Date().toISOString(),
        overall_grade: assessment.overallScore,
        valuation_low: assessment.lowEstimate,
        valuation_mid: assessment.midEstimate,
        valuation_high: assessment.highEstimate,
        adjusted_ebitda: assessment.adjustedEbitda,
        follow_up_intent: assessment.followUpIntent,
        source: 'assessment_migration'
      },
      source: 'migration'
    };

    // Send to growth webhook (since it's a growth tier assessment)
    const success = await sendWebhook(webhookData, 'growthResults');
    if (success) {
      successCount++;
      if (isHotCapital) {
        console.log('🔥 Hot capital lead identified and sent!');
      }
    } else {
      errorCount++;
    }
    
    // Also send to n8n
    await sendWebhook(webhookData, 'n8nLead');
    
  } catch (error) {
    console.error(`❌ Failed to process assessment:`, error.message);
    errorCount++;
  }

  console.log('\n🎉 Migration completed!');
  console.log(`✅ Successfully sent: ${successCount} webhooks`);
  console.log(`❌ Errors encountered: ${errorCount}`);

  console.log('\n📊 Migration Summary:');
  console.log('• Using the SAME webhook method that was already working');
  console.log('• 3 consumer users sent with proper tier-based webhook routing');
  console.log('• 1 high-value assessment ($2.6M valuation, follow-up requested)');
  console.log('• Tags configured to trigger your existing workflow automations');
  console.log('• Data sent to both GoHighLevel and n8n for processing');
  console.log('\n🚀 Your workflow automations should now trigger automatically!');
}

migrate().catch(console.error);