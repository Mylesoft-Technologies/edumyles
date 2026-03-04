#!/usr/bin/env node

/**
 * Test script to verify WorkOS authentication setup
 * This script tests the authentication endpoints without requiring a browser
 */

const http = require('http');
const https = require('https');

// Test configuration
const LANDING_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:3000';

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testAuthEndpoints() {
  console.log('🔍 Testing EduMyles Authentication Setup\n');
  
  // Test 1: Landing page is accessible
  console.log('1. Testing landing page accessibility...');
  try {
    const response = await makeRequest(LANDING_URL);
    if (response.status === 200) {
      console.log('✅ Landing page is accessible');
    } else {
      console.log(`❌ Landing page returned status ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Landing page error: ${error.message}`);
  }
  
  // Test 2: Login page is accessible
  console.log('\n2. Testing login page accessibility...');
  try {
    const response = await makeRequest(`${LANDING_URL}/auth/login`);
    if (response.status === 200) {
      console.log('✅ Login page is accessible');
    } else {
      console.log(`❌ Login page returned status ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Login page error: ${error.message}`);
  }
  
  // Test 3: Signup page is accessible
  console.log('\n3. Testing signup page accessibility...');
  try {
    const response = await makeRequest(`${LANDING_URL}/auth/signup`);
    if (response.status === 200) {
      console.log('✅ Signup page is accessible');
    } else {
      console.log(`❌ Signup page returned status ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Signup page error: ${error.message}`);
  }
  
  // Test 4: Login API endpoint
  console.log('\n4. Testing login API endpoint...');
  try {
    const response = await makeRequest(`${LANDING_URL}/auth/login/api`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@edumyles.com' })
    });
    
    if (response.status === 200) {
      const data = JSON.parse(response.data);
      if (data.authUrl && data.authUrl.includes('workos.com')) {
        console.log('✅ Login API endpoint works and returns WorkOS URL');
        console.log(`   Auth URL: ${data.authUrl.substring(0, 100)}...`);
      } else {
        console.log('❌ Login API returned invalid response');
      }
    } else {
      console.log(`❌ Login API returned status ${response.status}`);
      console.log(`   Response: ${response.data}`);
    }
  } catch (error) {
    console.log(`❌ Login API error: ${error.message}`);
  }
  
  // Test 5: Signup API endpoint
  console.log('\n5. Testing signup API endpoint...');
  try {
    const response = await makeRequest(`${LANDING_URL}/auth/signup/api`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'test@edumyles.com',
        schoolName: 'Test School'
      })
    });
    
    if (response.status === 200) {
      const data = JSON.parse(response.data);
      if (data.authUrl && data.authUrl.includes('workos.com')) {
        console.log('✅ Signup API endpoint works and returns WorkOS URL');
        console.log(`   Auth URL: ${data.authUrl.substring(0, 100)}...`);
      } else {
        console.log('❌ Signup API returned invalid response');
      }
    } else {
      console.log(`❌ Signup API returned status ${response.status}`);
      console.log(`   Response: ${response.data}`);
    }
  } catch (error) {
    console.log(`❌ Signup API error: ${error.message}`);
  }
  
  // Test 6: Frontend callback endpoint
  console.log('\n6. Testing frontend callback endpoint...');
  try {
    const response = await makeRequest(`${FRONTEND_URL}/auth/callback`);
    // Should redirect to login if no code parameter
    if (response.status === 302 || response.status === 200) {
      console.log('✅ Frontend callback endpoint is accessible');
    } else {
      console.log(`❌ Frontend callback returned status ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Frontend callback error: ${error.message}`);
  }
  
  console.log('\n🎯 Authentication Setup Test Complete');
  console.log('\n📝 Next Steps:');
  console.log('1. Ensure WorkOS environment variables are set in Vercel');
  console.log('2. Update WorkOS dashboard with production redirect URLs');
  console.log('3. Test authentication flow in production environment');
}

// Run the tests
testAuthEndpoints().catch(console.error);
