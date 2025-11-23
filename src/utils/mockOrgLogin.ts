/**
 * Temporary mock for testing Program Officer organizational access
 * Use this until your backend has the organizational structure implemented
 */

export const mockProgramOfficerLogin = () => {
  return {
    status: true,
    message: "Login successful",
    data: {
      access_token: "mock-jwt-token-12345",
      refresh_token: "mock-refresh-token-67890",
      user: {
        id: "prog-officer-001",
        username: "programofficer@ahni.test",
        email: "programofficer@ahni.test",
        first_name: "Program",
        last_name: "Officer",
        employee_id: "PROG001",
        is_active: true,
        is_staff: false,
        is_superuser: false,

        // Organizational Structure
        department: {
          id: "dept-prog-001",
          name: "Programs",
          code: "PROG",
          description: "Program implementation and management",
          color_code: "#3B82F6",
          icon_name: "folder-open"
        },
        position: {
          id: "pos-po-001",
          title: "Program Officer",
          code: "PO",
          level: "staff",
          can_approve: false,
          can_authorize: false,
          financial_approval_limit: 1000
        },
        role: {
          id: "role-po-001",
          name: "Program Officer Role",
          code: "PROGRAM_OFFICER",
          is_system_role: false,
          is_leadership_role: false
        },
        location: {
          id: "loc-kenya-001",
          name: "Kenya Country Office",
          code: "KE-CO",
          type: "country_office",
          country: "Kenya",
          region: "East Africa",
          city: "Nairobi"
        },
        data_access_level: "department",
        employment_type: "full_time"
      },

      // Full Program Officer Permissions
      permissions: [
        {
          module: "programs",
          permissions: [
            { id: 1, name: "Can add workplan", codename: "add_workplan" },
            { id: 2, name: "Can change workplan", codename: "change_workplan" },
            { id: 3, name: "Can view workplan", codename: "view_workplan" },
            { id: 4, name: "Can add fund request", codename: "add_fundrequest" },
            { id: 5, name: "Can change fund request", codename: "change_fundrequest" },
            { id: 6, name: "Can view fund request", codename: "view_fundrequest" },
            { id: 7, name: "Can add site visit", codename: "add_sitevisit" },
            { id: 8, name: "Can change site visit", codename: "change_sitevisit" },
            { id: 9, name: "Can view site visit", codename: "view_sitevisit" }
          ]
        },
        {
          module: "hr",
          permissions: [
            { id: 10, name: "Can add leave request", codename: "add_leaverequest" },
            { id: 11, name: "Can change leave request", codename: "change_leaverequest" },
            { id: 12, name: "Can view leave request", codename: "view_leaverequest" },
            { id: 13, name: "Can add timesheet", codename: "add_timesheet" },
            { id: 14, name: "Can change timesheet", codename: "change_timesheet" },
            { id: 15, name: "Can view timesheet", codename: "view_timesheet" }
          ]
        },
        {
          module: "procurements",
          permissions: [
            { id: 16, name: "Can add purchase request", codename: "add_purchaserequest" },
            { id: 17, name: "Can change purchase request", codename: "change_purchaserequest" },
            { id: 18, name: "Can view purchase request", codename: "view_purchaserequest" }
          ]
        },
        {
          module: "adminapp",
          permissions: [
            { id: 19, name: "Can add expense authorization", codename: "add_expenseauthorization" },
            { id: 20, name: "Can change expense authorization", codename: "change_expenseauthorization" },
            { id: 21, name: "Can view expense authorization", codename: "view_expenseauthorization" }
          ]
        }
      ]
    }
  };
};

// Helper function to mock login in console
export const testMockLogin = () => {
  const mockResponse = mockProgramOfficerLogin();

  // Simulate what your login controller would do
  console.log('🧪 MOCK LOGIN RESPONSE:', mockResponse);

  // Return formatted for dispatch
  return {
    access_token: mockResponse.data.access_token,
    refresh_token: mockResponse.data.refresh_token,
    isAuthenticated: true,
    loading: false,
    user: mockResponse.data.user,
    permissions: mockResponse.data.permissions,
    roles: []
  };
};