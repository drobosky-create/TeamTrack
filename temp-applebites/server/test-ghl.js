// Quick test script for GoHighLevel API connection
import { goHighLevelService } from './gohighlevel-service.js';

async function testGoHighLevel() {
  try {
    console.log('Testing GoHighLevel API connection...');
    
    // Test 1: Simple webhook test
    console.log('\n1. Testing webhook endpoint...');
    const webhookResult = await goHighLevelService.sendWebhook({
      event: 'test_connection',
      timestamp: new Date().toISOString(),
      data: { test: true }
    });
    console.log('Webhook result:', webhookResult);
    
    // Test 2: Contact creation test
    console.log('\n2. Testing contact creation...');
    const testContact = {
      firstName: 'Test',
      lastName: 'Integration',
      email: 'test-integration@example.com',
      phone: '555-123-4567',
      companyName: 'Test Company'
    };
    
    const contactResult = await goHighLevelService.createOrUpdateContact(testContact);
    console.log('Contact creation result:', contactResult);
    
    console.log('\n✅ GoHighLevel integration test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ GoHighLevel integration test failed:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testGoHighLevel();