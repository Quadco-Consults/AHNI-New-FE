// Direct login test script
// Run this in your browser console or as a Node.js script

async function testLogin() {
  console.log('🧪 Testing login endpoint directly...');

  const testData = {
    email: "admin@example.com",
    password: "testpassword123"
  };

  console.log('📤 Sending request with data:', testData);
  console.log('📤 Data types:', {
    email: typeof testData.email,
    password: typeof testData.password
  });

  try {
    const response = await fetch('https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📥 Raw response text:', responseText);

    try {
      const responseJson = JSON.parse(responseText);
      console.log('📥 Parsed response:', responseJson);
    } catch (e) {
      console.log('❌ Failed to parse response as JSON');
    }
  } catch (error) {
    console.error('❌ Request failed:', error);
  }
}

// Test with different data types to isolate the issue
async function testWithDifferentTypes() {
  const testCases = [
    {
      name: 'Normal strings',
      data: { email: "admin@example.com", password: "test123" }
    },
    {
      name: 'Empty strings',
      data: { email: "", password: "" }
    },
    {
      name: 'Numbers (should fail)',
      data: { email: 123, password: 456 }
    },
    {
      name: 'Mixed types (should fail)',
      data: { email: "admin@example.com", password: 123 }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log('Data:', testCase.data);
    console.log('Types:', Object.fromEntries(
      Object.entries(testCase.data).map(([key, value]) => [key, typeof value])
    ));

    try {
      const response = await fetch('https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(testCase.data)
      });

      const responseText = await response.text();
      console.log(`Status: ${response.status}`);
      console.log(`Response: ${responseText.substring(0, 200)}...`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
}

console.log('🚀 Login test functions loaded. Run:');
console.log('• testLogin() - Test with valid string data');
console.log('• testWithDifferentTypes() - Test various data types');