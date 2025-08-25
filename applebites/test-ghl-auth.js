#!/usr/bin/env node

// Test script to verify GoHighLevel authentication

const GHL_API_KEY = process.env.GHL_PIT_API || process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

if (!GHL_API_KEY || !GHL_LOCATION_ID) {
  console.error('❌ Missing required environment variables');
  console.log('GHL_API_KEY exists:', !!process.env.GHL_API_KEY);
  console.log('GHL_PIT_API exists:', !!process.env.GHL_PIT_API);
  console.log('GHL_LOCATION_ID exists:', !!process.env.GHL_LOCATION_ID);
  process.exit(1);
}

console.log('🔐 Testing GoHighLevel Authentication...');
console.log(`📍 Location ID: ${GHL_LOCATION_ID}`);
console.log(`🔑 API Key: ${GHL_API_KEY.substring(0, 10)}...`);

async function testGHLEndpoints() {
  const baseUrls = [
    'https://services.leadconnectorhq.com',
    'https://rest.gohighlevel.com'
  ];
  
  const endpoints = [
    '/locations/',
    `/locations/${GHL_LOCATION_ID}`,
    `/locations/${GHL_LOCATION_ID}/contacts`,
    '/contacts/',
    '/contacts',
    '/users/search',
    '/users'
  ];

  for (const baseUrl of baseUrls) {
    console.log(`\n🌐 Testing base URL: ${baseUrl}`);
    
    for (const endpoint of endpoints) {
      try {
        const url = `${baseUrl}${endpoint}`;
        console.log(`🔍 Testing: ${endpoint}`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Version': '2021-07-28'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ SUCCESS: ${endpoint} - Status: ${response.status}`);
          console.log(`   Response keys: ${Object.keys(data).join(', ')}`);
        } else {
          const errorText = await response.text();
          console.log(`❌ FAILED: ${endpoint} - Status: ${response.status}`);
          console.log(`   Error: ${errorText.substring(0, 100)}...`);
        }
      } catch (error) {
        console.log(`💥 ERROR: ${endpoint} - ${error.message}`);
      }
    }
  }
}

testGHLEndpoints().catch(console.error);