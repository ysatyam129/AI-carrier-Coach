const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testAPIConnection() {
  console.log('🔍 Testing API Connection...\n');
  
  const tests = [
    { name: 'Health Check', url: `${API_URL}/health` },
    { name: 'Quiz Categories', url: `${API_URL}/quiz/categories` },
    { name: 'Quiz Stats', url: `${API_URL}/quiz/stats` },
    { name: 'Dashboard Data (Public)', url: `${API_URL}/user/dashboard/public` },
    { name: 'Skills Demand', url: `${API_URL}/skills/demand` }
  ];
  
  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      const response = await axios.get(test.url, { timeout: 5000 });
      console.log(`✅ ${test.name}: Status ${response.status}`);
      if (test.name === 'Quiz Categories') {
        console.log(`   Categories found: ${response.data?.categories?.length || 0}`);
      }
      if (test.name === 'Quiz Stats') {
        console.log(`   Total questions: ${response.data?.totalQuestions || 0}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.log(`   No response received`);
      }
    }
    console.log('');
  }
}

testAPIConnection();