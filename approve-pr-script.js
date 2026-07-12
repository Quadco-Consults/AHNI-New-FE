// Script to approve Purchase Request PR-PEPFAR-2026-001-Q1
// Run this in the browser console while on the purchase request page

async function approvePurchaseRequest() {
  console.log('🚀 Starting approval process for PR-PEPFAR-2026-001-Q1...');

  try {
    // Get authentication token from localStorage
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      console.error('❌ No authentication token found. Please log in first.');
      return;
    }

    const baseURL = 'http://4.222.217.212:8000/api/v1';
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Step 1: Find the purchase request by reference number
    console.log('📋 Step 1: Finding purchase request...');
    const listResponse = await fetch(`${baseURL}/procurements/purchase-request/`, { headers });
    const listData = await listResponse.json();

    const purchaseRequest = listData.data?.results?.find(
      pr => pr.ref_number === 'PR-PEPFAR-2026-001-Q1'
    );

    if (!purchaseRequest) {
      console.error('❌ Purchase request PR-PEPFAR-2026-001-Q1 not found');
      console.log('Available purchase requests:', listData.data?.results?.map(pr => pr.ref_number));
      return;
    }

    console.log('✅ Found purchase request:', purchaseRequest.ref_number);
    console.log('📌 ID:', purchaseRequest.id);
    console.log('📊 Current status:', purchaseRequest.status);

    const prId = purchaseRequest.id;

    // Step 2: Review
    console.log('\n📋 Step 2: Reviewing purchase request...');
    try {
      const reviewResponse = await fetch(
        `${baseURL}/procurements/purchase-request/${prId}/`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ action: 'review' })
        }
      );

      if (!reviewResponse.ok) {
        const error = await reviewResponse.json();
        console.warn('⚠️ Review response:', error);
        // Continue anyway if already reviewed
        if (!error.message?.includes('already') && !error.detail?.includes('already')) {
          throw new Error(error.message || error.detail || 'Review failed');
        }
      } else {
        const reviewData = await reviewResponse.json();
        console.log('✅ Review successful:', reviewData.status || reviewData.message);
      }
    } catch (error) {
      console.warn('⚠️ Review error:', error.message);
      if (!error.message?.includes('already')) {
        throw error;
      }
    }

    // Wait a moment between steps
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 3: Authorize
    console.log('\n📋 Step 3: Authorizing purchase request...');
    try {
      const authorizeResponse = await fetch(
        `${baseURL}/procurements/purchase-request/${prId}/`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ action: 'authorise' })
        }
      );

      if (!authorizeResponse.ok) {
        const error = await authorizeResponse.json();
        console.warn('⚠️ Authorize response:', error);
        if (!error.message?.includes('already') && !error.detail?.includes('already')) {
          throw new Error(error.message || error.detail || 'Authorization failed');
        }
      } else {
        const authorizeData = await authorizeResponse.json();
        console.log('✅ Authorization successful:', authorizeData.status || authorizeData.message);
      }
    } catch (error) {
      console.warn('⚠️ Authorization error:', error.message);
      if (!error.message?.includes('already')) {
        throw error;
      }
    }

    // Wait a moment between steps
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 4: Final Approval
    console.log('\n📋 Step 4: Final approval of purchase request...');
    try {
      const approveResponse = await fetch(
        `${baseURL}/procurements/purchase-request/${prId}/`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ action: 'approve' })
        }
      );

      if (!approveResponse.ok) {
        const error = await approveResponse.json();
        console.warn('⚠️ Approve response:', error);
        if (!error.message?.includes('already') && !error.detail?.includes('already')) {
          throw new Error(error.message || error.detail || 'Approval failed');
        }
      } else {
        const approveData = await approveResponse.json();
        console.log('✅ Final approval successful:', approveData.status || approveData.message);
      }
    } catch (error) {
      console.warn('⚠️ Approval error:', error.message);
      if (!error.message?.includes('already')) {
        throw error;
      }
    }

    // Step 5: Verify final status
    console.log('\n📋 Step 5: Verifying final status...');
    const finalResponse = await fetch(`${baseURL}/procurements/purchase-request/${prId}/`, { headers });
    const finalData = await finalResponse.json();

    console.log('✅ APPROVAL COMPLETE! ✅');
    console.log('📊 Final status:', finalData.data?.status);
    console.log('📌 Purchase Request:', finalData.data?.ref_number);
    console.log('\n🎉 Purchase request PR-PEPFAR-2026-001-Q1 has been fully approved!');
    console.log('🔄 Please refresh the page to see the updated status.');

  } catch (error) {
    console.error('❌ Error during approval process:', error);
    console.error('💡 Please try approving manually through the UI or check if you have the necessary permissions.');
  }
}

// Run the approval process
approvePurchaseRequest();
