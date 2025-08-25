#!/usr/bin/env node

// Standalone migration script to send all existing data to GoHighLevel
// This bypasses the TypeScript errors in the main API routes

import pkg from 'pg';
const { Client } = pkg;

// GoHighLevel configuration
const GHL_API_KEY = process.env.GHL_PIT_API || process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const BASE_URL = 'https://services.leadconnectorhq.com';

if (!GHL_API_KEY || !GHL_LOCATION_ID) {
  console.error('Missing required environment variables: GHL_PIT_API/GHL_API_KEY and GHL_LOCATION_ID');
  process.exit(1);
}

// Database connection
const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function makeGHLRequest(endpoint, method = 'GET', data = null) {
  const url = `${BASE_URL}${endpoint}`;
  
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
    // Search for existing contact by email
    const searchResponse = await makeGHLRequest(
      `/contacts/v2/search?locationId=${GHL_LOCATION_ID}&email=${encodeURIComponent(contactData.email)}`
    );

    let contactId;

    if (searchResponse.contacts && searchResponse.contacts.length > 0) {
      // Update existing contact
      contactId = searchResponse.contacts[0].id;
      const updateData = {
        ...contactData,
        locationId: GHL_LOCATION_ID
      };
      await makeGHLRequest(`/contacts/v2/${contactId}`, 'PUT', updateData);
      console.log(`✅ Updated contact: ${contactData.email}`);
    } else {
      // Create new contact
      const createData = {
        ...contactData,
        locationId: GHL_LOCATION_ID
      };
      const createResponse = await makeGHLRequest(`/contacts/v2/`, 'POST', createData);
      contactId = createResponse.contact.id;
      console.log(`🆕 Created contact: ${contactData.email}`);
    }

    return { contactId, isNew: !searchResponse.contacts?.length };
  } catch (error) {
    console.error(`❌ Error with contact ${contactData.email}:`, error.message);
    throw error;
  }
}

async function migrate() {
  try {
    console.log('🚀 Starting migration to GoHighLevel...');
    await client.connect();

    // Get all data from database
    const usersResult = await client.query('SELECT * FROM users ORDER BY created_at DESC');
    const leadsResult = await client.query('SELECT * FROM leads ORDER BY created_at DESC');
    const assessmentsResult = await client.query('SELECT * FROM valuation_assessments ORDER BY created_at DESC');

    const users = usersResult.rows;
    const leads = leadsResult.rows;
    const assessments = assessmentsResult.rows;

    console.log(`📊 Found ${users.length} users, ${leads.length} leads, ${assessments.length} assessments`);

    let migratedContacts = 0;
    let errors = 0;

    // Migrate Users
    console.log('\n👥 Migrating users...');
    for (const user of users) {
      try {
        const ghlContactData = {
          firstName: user.first_name || undefined,
          lastName: user.last_name || undefined,
          email: user.email,
          tags: [
            'applebites-migration',
            'Platform User',
            user.tier ? `tier-${user.tier}` : 'tier-free',
            ...(user.auth_provider === 'stripe_purchase' ? ['New Account - Payment Signup'] : [])
          ],
          customFields: {
            migrationDate: new Date().toISOString(),
            originalUserId: user.id,
            tier: user.tier || 'free',
            authProvider: user.auth_provider || 'email',
            signupDate: user.created_at || new Date().toISOString(),
            source: 'user_migration',
            awaitingPasswordCreation: user.awaiting_password_creation || false
          }
        };

        await createOrUpdateContact(ghlContactData);
        migratedContacts++;
      } catch (error) {
        console.error(`Failed to migrate user ${user.id}:`, error.message);
        errors++;
      }
    }

    // Migrate Leads
    console.log('\n📋 Migrating leads...');
    for (const lead of leads) {
      try {
        // Skip if we already have a user with this email
        const userExists = users.find(u => u.email === lead.email);
        if (userExists) {
          console.log(`⏭️  Skipping lead ${lead.id} - user already exists for ${lead.email}`);
          continue;
        }

        const ghlContactData = {
          firstName: lead.first_name || undefined,
          lastName: lead.last_name || undefined,
          email: lead.email,
          phone: lead.phone || undefined,
          companyName: lead.company || undefined,
          tags: [
            'applebites-migration',
            'lead-migration',
            lead.lead_status ? `status-${lead.lead_status}` : 'status-new',
          ],
          customFields: {
            migrationDate: new Date().toISOString(),
            originalLeadId: lead.id,
            leadSource: lead.lead_source || 'unknown',
            leadStatus: lead.lead_status || 'new',
            leadScore: lead.lead_score || 0,
            estimatedValue: lead.estimated_value || 0,
            followUpIntent: lead.follow_up_intent || 'unknown',
            source: 'lead_migration',
            notes: lead.notes || ''
          }
        };

        await createOrUpdateContact(ghlContactData);
        migratedContacts++;
      } catch (error) {
        console.error(`Failed to migrate lead ${lead.id}:`, error.message);
        errors++;
      }
    }

    // Enhance contacts with assessment data
    console.log('\n📈 Processing assessments...');
    for (const assessment of assessments) {
      try {
        // Find if we already have this contact (by email)
        const existingUser = users.find(u => u.email === assessment.email);
        const existingLead = leads.find(l => l.email === assessment.email);

        // Determine hot-capital tagging
        const isHotCapital = assessment.mid_estimate >= 2000000 && 
                           ['A', 'B'].includes(assessment.overall_score) && 
                           assessment.follow_up_intent === 'yes';

        if (!existingUser && !existingLead) {
          // Create new contact from assessment data
          const ghlContactData = {
            firstName: assessment.first_name || undefined,
            lastName: assessment.last_name || undefined,
            email: assessment.email,
            phone: assessment.phone || undefined,
            companyName: assessment.company || undefined,
            tags: [
              'applebites-migration',
              'assessment-migration',
              `tier-${assessment.tier || 'free'}`,
              `grade-${assessment.overall_score}`,
              ...(assessment.follow_up_intent === 'yes' ? ['follow-up-requested'] : []),
              ...(isHotCapital ? ['hot-capital'] : [])
            ],
            customFields: {
              migrationDate: new Date().toISOString(),
              originalAssessmentId: assessment.id,
              tier: assessment.tier || 'free',
              assessmentDate: assessment.created_at,
              overallGrade: assessment.overall_score,
              valuationLow: Number(assessment.low_estimate) || 0,
              valuationMid: Number(assessment.mid_estimate) || 0,
              valuationHigh: Number(assessment.high_estimate) || 0,
              adjustedEbitda: Number(assessment.adjusted_ebitda) || 0,
              financialPerformance: assessment.financial_performance,
              customerConcentration: assessment.customer_concentration,
              managementTeam: assessment.management_team,
              competitivePosition: assessment.competitive_position,
              growthProspects: assessment.growth_prospects,
              systemsProcesses: assessment.systems_processes,
              assetQuality: assessment.asset_quality,
              industryOutlook: assessment.industry_outlook,
              riskFactors: assessment.risk_factors,
              ownerDependency: assessment.owner_dependency,
              followUpIntent: assessment.follow_up_intent || 'unknown',
              source: 'assessment_migration'
            }
          };

          await createOrUpdateContact(ghlContactData);
          migratedContacts++;
        } else {
          // Update existing contact with assessment data
          const ghlContactData = {
            email: assessment.email,
            tags: [
              `grade-${assessment.overall_score}`,
              ...(assessment.follow_up_intent === 'yes' ? ['follow-up-requested'] : []),
              ...(isHotCapital ? ['hot-capital'] : [])
            ],
            customFields: {
              latestAssessmentId: assessment.id,
              latestAssessmentDate: assessment.created_at,
              overallGrade: assessment.overall_score,
              valuationLow: Number(assessment.low_estimate) || 0,
              valuationMid: Number(assessment.mid_estimate) || 0,
              valuationHigh: Number(assessment.high_estimate) || 0,
              adjustedEbitda: Number(assessment.adjusted_ebitda) || 0,
              financialPerformance: assessment.financial_performance,
              customerConcentration: assessment.customer_concentration,
              managementTeam: assessment.management_team,
              competitivePosition: assessment.competitive_position,
              growthProspects: assessment.growth_prospects,
              systemsProcesses: assessment.systems_processes,
              assetQuality: assessment.asset_quality,
              industryOutlook: assessment.industry_outlook,
              riskFactors: assessment.risk_factors,
              ownerDependency: assessment.owner_dependency,
              followUpIntent: assessment.follow_up_intent || 'unknown'
            }
          };

          await createOrUpdateContact(ghlContactData);
          console.log(`🔄 Enhanced contact with assessment data: ${assessment.email}`);
        }
      } catch (error) {
        console.error(`Failed to process assessment ${assessment.id}:`, error.message);
        errors++;
      }
    }

    console.log('\n🎉 Migration completed!');
    console.log(`✅ Successfully migrated: ${migratedContacts} contacts`);
    console.log(`❌ Errors encountered: ${errors}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await client.end();
  }
}

// Run the migration
migrate().catch(console.error);