#!/usr/bin/env node

/**
 * Test the actual callback with a real browser-like flow
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

async function testCallbackDebug() {
  console.log('🔍 Testing Callback Debug\n');
  
  const FRONTEND_URL = 'http://localhost:3000';
  
  // Test with a fake code to see what happens
  console.log('1. Testing frontend callback with fake code...');
  try {
    const response = await makeRequest(`${FRONTEND_URL}/auth/callback?code=fake_test_code&state=fake_state`, {
      redirect: 'manual' // Don't follow redirects automatically
    });
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Headers:`, JSON.stringify(response.headers, null, 2));
    
    if (response.status === 302) {
      const location = response.headers.location;
      console.log(`   Redirect location: ${location}`);
      
      if (location.includes('/dashboard')) {
        console.log('❌ ISSUE: Redirecting to /dashboard');
        console.log('   This suggests the callback is not working properly');
      } else if (location.includes('/admin')) {
        console.log('✅ Redirecting to /admin (correct for school_admin)');
      } else if (location.includes('/portal')) {
        console.log('✅ Redirecting to portal (correct for other roles)');
      } else {
        console.log(`❓ Unknown redirect: ${location}`);
      }
    } else if (response.status === 500) {
      console.log('❌ Server error in callback');
      console.log(`   Error data: ${response.data}`);
    } else {
      console.log(`❓ Unexpected status: ${response.status}`);
      console.log(`   Response data: ${response.data}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  console.log('\n🎯 Debug Summary:');
  console.log('If you see /dashboard redirect, the issue is likely:');
  console.log('1. Role is not being determined correctly');
  console.log('2. getRoleDashboard function is returning wrong value');
  console.log('3. There\'s a fallback to /dashboard somewhere');
  console.log('4. The session creation is failing');
}

// Run the debug
testCallbackDebug().catch(console.error);
