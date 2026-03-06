#!/usr/bin/env node

/**
 * Debug authentication flow to see where it's failing
 */

const http = require('http');
const https = require('https');

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

async function debugAuthFlow() {
  console.log('🔍 Debugging Authentication Flow\n');
  
  const LANDING_URL = 'http://localhost:3001';
  const FRONTEND_URL = 'http://localhost:3000';
  
  // Test 1: Get auth URL from landing page
  console.log('1. Getting auth URL from landing page...');
  try {
    const response = await makeRequest(`${LANDING_URL}/auth/login/api`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@edumyles.com' })
    });
    
    if (response.status === 200) {
      const data = JSON.parse(response.data);
      console.log('✅ Got auth URL');
      console.log(`   Auth URL: ${data.authUrl}`);
      
      // Extract the redirect URI
      const authUrl = new URL(data.authUrl);
      const redirectUri = authUrl.searchParams.get('redirect_uri');
      console.log(`   Redirect URI: ${redirectUri}`);
      
      // Test 2: Simulate callback with a fake code
      console.log('\n2. Testing callback with fake code...');
      const callbackResponse = await makeRequest(`${redirectUri}?code=fake_test_code&state=fake_state`, {
        redirect: 'manual' // Don't follow redirects automatically
      });
      
      console.log(`   Callback status: ${callbackResponse.status}`);
      console.log(`   Callback location: ${callbackResponse.headers.location || 'No redirect'}`);
      
      if (callbackResponse.status === 302) {
        const finalRedirect = callbackResponse.headers.location;
        console.log(`   Final redirect: ${finalRedirect}`);
        
        if (finalRedirect.includes('localhost:3000')) {
          console.log('✅ Redirects to frontend');
          
          // Test 3: Check if frontend callback works
          console.log('\n3. Testing frontend callback...');
          const frontendCallback = await makeRequest(`${FRONTEND_URL}/auth/callback?code=fake_test_code&state=fake_state`, {
            redirect: 'manual'
          });
          
          console.log(`   Frontend callback status: ${frontendCallback.status}`);
          console.log(`   Frontend callback location: ${frontendCallback.headers.location || 'No redirect'}`);
          
          if (frontendCallback.status === 302) {
            const dashboardRedirect = frontendCallback.headers.location;
            console.log(`   Dashboard redirect: ${dashboardRedirect}`);
            
            if (dashboardRedirect.includes('/dashboard')) {
              console.log('❌ ISSUE: Redirecting to /dashboard which may not exist');
            } else if (dashboardRedirect.includes('/admin') || dashboardRedirect.includes('/portal')) {
              console.log('✅ Redirecting to proper dashboard');
            } else {
              console.log(`❓ Unknown redirect: ${dashboardRedirect}`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  console.log('\n🎯 Debug Summary:');
  console.log('The issue might be:');
  console.log('1. Frontend callback is redirecting to /dashboard instead of role-based paths');
  console.log('2. User role is not being determined correctly');
  console.log('3. Tenant lookup is failing');
  console.log('4. Convex connection issues');
}

// Run the debug
debugAuthFlow().catch(console.error);
