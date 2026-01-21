// Simple test script to verify the resume templates API
const fetch = require('node-fetch');

async function testTemplatesAPI() {
  try {
    console.log('Testing resume templates API...');

    const response = await fetch('http://localhost:3000/api/resumes/templates');
    const data = await response.json();

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ API is working correctly!');
      console.log(`Found ${data.templates?.length || 0} templates`);
    } else {
      console.log('❌ API returned an error');
    }
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testTemplatesAPI();
