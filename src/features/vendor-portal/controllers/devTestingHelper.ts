// Development testing helper for vendor portal
import { mockVendorAuth, mockPurchaseOrders, mockGRNs, mockVendorOrderSummary } from './mockVendorData';

export class DevTestingHelper {
  // Enable mock mode for testing
  static enableMockMode() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('VENDOR_MOCK_MODE', 'true');
      localStorage.setItem('VENDOR_AUTH_TOKEN', JSON.stringify(mockVendorAuth));
      console.log('🧪 Mock mode enabled for vendor portal testing');
      console.log('📝 Mock vendor credentials:', {
        email: mockVendorAuth.email,
        company: mockVendorAuth.company_name
      });
    }
  }

  // Disable mock mode
  static disableMockMode() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('VENDOR_MOCK_MODE');
      localStorage.removeItem('VENDOR_AUTH_TOKEN');
      console.log('✅ Mock mode disabled');
    }
  }

  // Check if mock mode is enabled
  static isMockModeEnabled(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('VENDOR_MOCK_MODE') === 'true';
    }
    return false;
  }

  // Get mock data for testing
  static getMockData() {
    return {
      purchaseOrders: mockPurchaseOrders,
      grns: mockGRNs,
      orderSummary: mockVendorOrderSummary,
      vendorAuth: mockVendorAuth
    };
  }

  // Auto-login for testing
  static autoLogin() {
    if (typeof window !== 'undefined') {
      this.enableMockMode();
      // Redirect to dashboard
      window.location.href = '/vendor-portal/dashboard';
    }
  }

  // Console helper for developers
  static logTestingInstructions() {
    console.log(`
🧪 VENDOR PORTAL TESTING HELPER
================================

To test the vendor PO & GRN features, run these commands in the browser console:

1. Enable mock mode:
   DevTestingHelper.enableMockMode()

2. Auto-login (enables mock mode + redirects):
   DevTestingHelper.autoLogin()

3. Disable mock mode:
   DevTestingHelper.disableMockMode()

4. Check current mode:
   DevTestingHelper.isMockModeEnabled()

5. Get mock data:
   DevTestingHelper.getMockData()

📍 Testing URLs:
- Login: /vendor-portal/login
- Dashboard: /vendor-portal/dashboard
- Orders: /vendor-portal/orders
- GRNs: /vendor-portal/grn
- Notifications: /vendor-portal/notifications

🔍 Features to test:
✅ Dashboard statistics and widgets
✅ Purchase order listing and filtering
✅ PO acknowledgment and delivery updates
✅ GRN listing and status tracking
✅ GRN response and dispute system
✅ File uploads and document management
✅ Navigation and user experience
    `);
  }
}

// Make available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).DevTestingHelper = DevTestingHelper;

  // Auto-log instructions when the page loads
  setTimeout(() => {
    DevTestingHelper.logTestingInstructions();
  }, 1000);
}