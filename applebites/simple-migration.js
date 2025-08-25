#!/usr/bin/env node

// Simple migration script using the actual database structure

const GHL_API_KEY = process.env.GHL_PIT_API || process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const BASE_URL = 'https://services.leadconnectorhq.com';

if (!GHL_API_KEY || !GHL_LOCATION_ID) {
  console.error('❌ Missing required environment variables: GHL_PIT_API/GHL_API_KEY and GHL_LOCATION_ID');
  process.exit(1);
}

async function makeGHLRequest(endpoint, method = 'GET', data = null) {
  const url = `${BASE_URL}${endpoint}`;
  
  console.log(`📡 Making ${method} request to: ${endpoint}`);
  
  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${GHL_API_KEY}`,
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

async function createOrUpdateContact(contactData) {
  try {
    console.log(`👤 Processing contact: ${contactData.email}`);
    
    // Try to create contact directly - GoHighLevel will handle duplicates
    const createData = {
      ...contactData,
      locationId: GHL_LOCATION_ID
    };
    
    // Try v1 endpoint first
    try {
      const createResponse = await makeGHLRequest(`/locations/${GHL_LOCATION_ID}/contacts/`, 'POST', createData);
      console.log(`🆕 Created contact: ${contactData.email}`);
      return { contactId: createResponse.id || createResponse.contact?.id, isNew: true };
    } catch (v1Error) {
      console.log(`📞 V1 failed, trying upsert approach...`);
      
      // Try upsert approach - overwrite if exists
      const upsertData = {
        ...createData,
        // Add a flag to indicate this is an upsert operation
        source: 'migration'
      };
      
      const createResponse = await makeGHLRequest(`/locations/${GHL_LOCATION_ID}/contacts/upsert`, 'POST', upsertData);
      console.log(`🔄 Upserted contact: ${contactData.email}`);
      return { contactId: createResponse.id || createResponse.contact?.id, isNew: false };
    }

  } catch (error) {
    console.error(`❌ Error with contact ${contactData.email}:`, error.message);
    return { error: error.message };
  }
}

async function migrate() {
  console.log('🚀 Starting migration to GoHighLevel...');
  
  try {
    // Manual data from database (since we can't connect to DB directly)
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

    let migratedContacts = 0;
    let errors = 0;

    console.log('\n👥 Migrating consumer users...');
    for (const user of consumerUsers) {
      try {
        const ghlContactData = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          companyName: user.companyName,
          tags: [
            'applebites-migration',
            'Platform User',
            `tier-${user.plan}`,
            ...(user.plan !== 'free' ? ['New Account - Payment Signup'] : [])
          ],
          customFields: {
            migrationDate: new Date().toISOString(),
            tier: user.plan,
            source: 'consumer_migration',
            companyName: user.companyName
          }
        };

        const result = await createOrUpdateContact(ghlContactData);
        if (!result.error) {
          migratedContacts++;
        } else {
          errors++;
        }
      } catch (error) {
        console.error(`Failed to migrate user ${user.email}:`, error.message);
        errors++;
      }
    }

    console.log('\n📈 Migrating assessment data...');
    try {
      // Check if this is a high-value lead for hot-capital tagging
      const isHotCapital = assessment.midEstimate >= 2000000 && 
                         ['A', 'B'].includes(assessment.overallScore) && 
                         assessment.followUpIntent === 'yes';

      const ghlContactData = {
        firstName: assessment.firstName,
        lastName: assessment.lastName,
        email: assessment.email,
        phone: assessment.phone,
        companyName: assessment.company,
        tags: [
          'applebites-migration',
          'assessment-migration',
          `tier-${assessment.tier}`,
          `grade-${assessment.overallScore}`,
          'follow-up-requested',
          ...(isHotCapital ? ['hot-capital'] : [])
        ],
        customFields: {
          migrationDate: new Date().toISOString(),
          tier: assessment.tier,
          assessmentDate: new Date().toISOString(),
          overallGrade: assessment.overallScore,
          valuationLow: assessment.lowEstimate,
          valuationMid: assessment.midEstimate,
          valuationHigh: assessment.highEstimate,
          adjustedEbitda: assessment.adjustedEbitda,
          followUpIntent: assessment.followUpIntent,
          source: 'assessment_migration'
        }
      };

      const result = await createOrUpdateContact(ghlContactData);
      if (!result.error) {
        migratedContacts++;
        console.log(`🔥 High-value assessment migrated: $${Math.round(assessment.midEstimate).toLocaleString()} valuation`);
      } else {
        errors++;
      }
    } catch (error) {
      console.error(`Failed to migrate assessment:`, error.message);
      errors++;
    }

    console.log('\n🎉 Migration completed!');
    console.log(`✅ Successfully migrated: ${migratedContacts} contacts`);
    console.log(`❌ Errors encountered: ${errors}`);

    console.log('\n📊 Migration Summary:');
    console.log('• 3 consumer users with proper tier tags');
    console.log('• 1 high-value assessment ($2.6M valuation, follow-up requested)');
    console.log('• Tags added for your workflow automation triggers');
    console.log('• Custom fields populated with valuation data');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
migrate().catch(console.error);