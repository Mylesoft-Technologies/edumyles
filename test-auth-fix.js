const axios = require('axios');

async function testAuthFlow() {
  console.log('🧪 Testing EduMyles Authentication Flow Fix...\n');

  try {
    // 1. Test landing page is accessible
    console.log('1️⃣ Testing landing page...');
    const landingResponse = await axios.get('http://localhost:3001');
    console.log(`   Status: ${landingResponse.status}`);
    console.log('   ✅ Landing page accessible\n');

    // 2. Test frontend admin page without auth (should redirect to login)
    console.log('2️⃣ Testing frontend admin page without auth...');
    try {
      const adminResponse = await axios.get('http://localhost:3000/admin', {
        maxRedirects: 0,
        validateStatus: () => true
      });
      console.log(`   Status: ${adminResponse.status}`);
      if (adminResponse.status === 307) {
        console.log('   ✅ Correctly redirects unauthenticated users\n');
      }
    } catch (error) {
      if (error.response && error.response.status === 307) {
        console.log('   ✅ Correctly redirects unauthenticated users\n');
      } else {
        console.log(`   ❌ Error: ${error.message}\n`);
      }
    }

    // 3. Test auth login page
    console.log('3️⃣ Testing auth login page...');
    const loginResponse = await axios.get('http://localhost:3001/auth/login');
    console.log(`   Status: ${loginResponse.status}`);
    console.log('   ✅ Auth login page accessible\n');

    console.log('🎉 Authentication flow test completed!');
    console.log('\n📋 Manual Testing Steps:');
    console.log('1. Visit http://localhost:3001 (landing page)');
    console.log('2. Click "Get Started" button');
    console.log('3. Should redirect to http://localhost:3001/auth/login');
    console.log('4. Complete authentication with WorkOS');
    console.log('5. Should redirect to http://localhost:3000/admin (frontend dashboard)');
    console.log('6. Should see proper admin header with user info and logout');
    console.log('7. Click logout - should return to landing page');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuthFlow();
