// Diagnostic script to test purchase request approval
// Run this in the browser console while logged in

async function diagnoseApprovalError() {
  console.log('='.repeat(60));
  console.log('🔬 PURCHASE REQUEST APPROVAL DIAGNOSTIC');
  console.log('='.repeat(60));

  // Step 1: Check authentication
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  console.log('\n📋 STEP 1: Authentication Check');
  console.log('Token exists:', !!token);
  console.log('Token preview:', token ? `${token.substring(0, 30)}...` : 'NO TOKEN');

  if (!token) {
    console.error('❌ No authentication token found. Please log in first.');
    return;
  }

  const baseURL = 'http://4.222.217.212:8000/api/v1';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    // Step 2: Find the purchase request
    console.log('\n📋 STEP 2: Finding Purchase Request');
    const listResponse = await fetch(`${baseURL}/procurements/purchase-request/`, { headers });
    console.log('List response status:', listResponse.status);

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error('❌ Failed to get purchase requests:', errorText);
      return;
    }

    const listData = await listResponse.json();
    console.log('Total PRs found:', listData.data?.results?.length || 0);

    const purchaseRequest = listData.data?.results?.find(
      pr => pr.ref_number === 'PR-PEPFAR-2026-001-Q1'
    );

    if (!purchaseRequest) {
      console.error('❌ Purchase request PR-PEPFAR-2026-001-Q1 not found');
      console.log('Available PRs:', listData.data?.results?.map(pr => pr.ref_number));
      return;
    }

    console.log('✅ Found purchase request:', purchaseRequest.ref_number);
    console.log('   ID:', purchaseRequest.id);
    console.log('   Current status:', purchaseRequest.status);
    console.log('   Total cost:', purchaseRequest.total_cost);
    console.log('   Requested by:', purchaseRequest.requested_by?.email);

    const prId = purchaseRequest.id;

    // Step 3: Get detailed purchase request info
    console.log('\n📋 STEP 3: Get Detailed Purchase Request');
    const detailResponse = await fetch(`${baseURL}/procurements/purchase-request/${prId}/`, { headers });
    const detailData = await detailResponse.json();
    console.log('Detail response status:', detailResponse.status);
    console.log('Full PR data:', JSON.stringify(detailData, null, 2).substring(0, 500) + '...');

    // Step 4: Get approval info
    console.log('\n📋 STEP 4: Get Approval Info');
    const approvalInfoResponse = await fetch(`${baseURL}/procurements/purchase-request/${prId}/approval_info/`, { headers });
    console.log('Approval info response status:', approvalInfoResponse.status);

    if (approvalInfoResponse.ok) {
      const approvalInfo = await approvalInfoResponse.json();
      console.log('Approval info:', JSON.stringify(approvalInfo, null, 2));
    } else {
      const errorText = await approvalInfoResponse.text();
      console.warn('⚠️ Could not get approval info:', errorText);
    }

    // Step 5: Test review action with different approaches
    console.log('\n📋 STEP 5: Testing Review Action');

    // Test 1: Standard JSON payload
    console.log('\n🧪 Test 1: Standard JSON payload');
    const payload1 = { action: "review" };
    console.log('Payload:', JSON.stringify(payload1));
    console.log('Payload stringified:', JSON.stringify(payload1));
    console.log('Payload action field:', payload1.action);
    console.log('Payload action type:', typeof payload1.action);

    const test1Response = await fetch(
      `${baseURL}/procurements/purchase-request/${prId}/`,
      {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(payload1)
      }
    );

    console.log('Test 1 Response status:', test1Response.status);
    console.log('Test 1 Response headers:', Object.fromEntries(test1Response.headers.entries()));

    const test1Text = await test1Response.text();
    console.log('Test 1 Response body (raw):', test1Text);

    try {
      const test1Data = JSON.parse(test1Text);
      console.log('Test 1 Response body (parsed):', JSON.stringify(test1Data, null, 2));

      if (test1Response.ok) {
        console.log('✅ SUCCESS! Purchase request was reviewed.');
      } else {
        console.error('❌ FAILED:', test1Data);
        console.error('\n📝 Error Analysis:');
        console.error('   - Status Code:', test1Response.status);
        console.error('   - Error Type:', test1Data.error_code || 'unknown');
        console.error('   - Message:', test1Data.message || test1Data.detail || 'no message');
        console.error('   - Details:', test1Data);
      }
    } catch (e) {
      console.error('❌ Could not parse response as JSON');
      console.error('   Raw response:', test1Text);
    }

  } catch (error) {
    console.error('\n❌ DIAGNOSTIC ERROR:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🏁 DIAGNOSTIC COMPLETE');
  console.log('='.repeat(60));
}

// Auto-run
diagnoseApprovalError();
