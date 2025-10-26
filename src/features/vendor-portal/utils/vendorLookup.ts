// Utility to check if a vendor exists in the system
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

export class VendorLookupUtil {
  // Check if vendor exists by email
  static async checkVendorExists(email: string): Promise<{
    exists: boolean;
    vendor?: any;
    error?: string;
  }> {
    try {
      // Try to get vendor list and search for the email
      const response = await AxiosWithToken.get('/procurements/vendors/', {
        params: {
          search: email,
          page_size: 100 // Get more results
        }
      });

      const vendors = response.data.results || response.data.data || response.data;

      if (Array.isArray(vendors)) {
        const foundVendor = vendors.find(
          vendor => vendor.email?.toLowerCase() === email.toLowerCase()
        );

        if (foundVendor) {
          return {
            exists: true,
            vendor: foundVendor
          };
        }
      }

      return {
        exists: false
      };
    } catch (error: any) {
      console.error('Error checking vendor:', error);
      return {
        exists: false,
        error: error.message
      };
    }
  }

  // Try vendor login to check if account exists
  static async testVendorLogin(email: string): Promise<{
    accountExists: boolean;
    canLogin: boolean;
    message: string;
  }> {
    try {
      // Try login with a dummy password to see if account exists
      const response = await fetch('/api/procurements/vendors/portal-auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: 'dummy-password-test'
        })
      });

      const result = await response.json();

      if (response.status === 400 || response.status === 401) {
        // Bad credentials usually means account exists but wrong password
        if (result.message?.includes('Invalid credentials') ||
            result.error?.includes('Invalid credentials')) {
          return {
            accountExists: true,
            canLogin: false,
            message: 'Account exists but password is incorrect'
          };
        }

        // User not found
        if (result.message?.includes('not found') ||
            result.error?.includes('not found')) {
          return {
            accountExists: false,
            canLogin: false,
            message: 'No account found with this email'
          };
        }
      }

      return {
        accountExists: false,
        canLogin: false,
        message: `Unexpected response: ${result.message || result.error || 'Unknown error'}`
      };
    } catch (error: any) {
      return {
        accountExists: false,
        canLogin: false,
        message: `Error testing login: ${error.message}`
      };
    }
  }

  // Console helper for developers
  static async quickCheck(email: string) {
    console.log(`🔍 Checking vendor: ${email}`);
    console.log('=====================================');

    // Method 1: Search in vendor list
    console.log('📋 Method 1: Searching vendor database...');
    const vendorCheck = await this.checkVendorExists(email);

    if (vendorCheck.exists && vendorCheck.vendor) {
      console.log('✅ FOUND in vendor database!');
      console.log('📊 Vendor Details:', {
        id: vendorCheck.vendor.id,
        company_name: vendorCheck.vendor.company_name,
        email: vendorCheck.vendor.email,
        status: vendorCheck.vendor.status,
        approved_categories: vendorCheck.vendor.approved_categories,
        created_date: vendorCheck.vendor.registration_date || vendorCheck.vendor.created_date
      });
    } else {
      console.log('❌ NOT FOUND in vendor database');
      if (vendorCheck.error) {
        console.log('⚠️ Error:', vendorCheck.error);
      }
    }

    // Method 2: Test login
    console.log('\n🔐 Method 2: Testing login endpoint...');
    const loginCheck = await this.testVendorLogin(email);
    console.log(`📝 Result: ${loginCheck.message}`);

    if (loginCheck.accountExists) {
      console.log('✅ Account exists in authentication system');
    } else {
      console.log('❌ No account in authentication system');
    }

    // Summary
    console.log('\n📋 SUMMARY FOR:', email);
    console.log('=====================================');
    if (vendorCheck.exists || loginCheck.accountExists) {
      console.log('✅ VENDOR ACCOUNT EXISTS');
      if (vendorCheck.exists) {
        console.log(`📊 Status: ${vendorCheck.vendor?.status || 'Unknown'}`);
        console.log(`🏢 Company: ${vendorCheck.vendor?.company_name || 'Unknown'}`);
      }
      console.log('🔐 To login: Go to /vendor-portal/login');
      console.log('💡 If password unknown, admin can reset it');
    } else {
      console.log('❌ NO VENDOR ACCOUNT FOUND');
      console.log('💡 Options:');
      console.log('   1. Register via EOI process');
      console.log('   2. Admin can create account manually');
      console.log('   3. Use admin dashboard to add vendor');
    }

    return {
      exists: vendorCheck.exists || loginCheck.accountExists,
      vendor: vendorCheck.vendor,
      loginTest: loginCheck
    };
  }
}

// Make available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).VendorLookupUtil = VendorLookupUtil;
}

export default VendorLookupUtil;