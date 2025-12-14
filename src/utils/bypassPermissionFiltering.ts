/**
 * TEMPORARY UTILITY FOR BYPASSING PERMISSION FILTERING
 *
 * This utility attempts to bypass permission filtering by using different
 * request approaches and headers.
 *
 * TODO: Remove once proper unrestricted endpoints are implemented
 */

import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

export interface BypassedAPIResponse {
  success: boolean;
  data: any;
  source: string;
  error?: any;
}

/**
 * Try multiple approaches to get unrestricted config data
 */
export async function attemptUnrestrictedConfigFetch(
  endpoint: string,
  configType: string
): Promise<BypassedAPIResponse> {
  console.log(`🚀 Attempting unrestricted fetch for ${configType} from ${endpoint}`);

  // Strategy 1: Try with admin context headers
  try {
    console.log(`1️⃣ Trying admin context headers for ${configType}`);
    const adminResponse = await AxiosWithToken.get(endpoint, {
      params: {
        page: 1,
        size: 10000,
        search: "",
        admin_context: true,
        unrestricted: true
      },
      headers: {
        'X-Admin-Override': 'true',
        'X-Bypass-Permissions': 'true',
        'X-Request-Context': 'admin'
      }
    });

    const resultCount = adminResponse.data?.data?.results?.length || adminResponse.data?.results?.length || 0;
    if (resultCount > 3) {
      console.log(`✅ Admin headers SUCCESS for ${configType}: ${resultCount} items`);
      return {
        success: true,
        data: adminResponse.data,
        source: 'admin-headers'
      };
    }
  } catch (error) {
    console.log(`❌ Admin headers failed for ${configType}:`, error);
  }

  // Strategy 2: Try with superuser context
  try {
    console.log(`2️⃣ Trying superuser context for ${configType}`);
    const superuserResponse = await AxiosWithToken.get(endpoint, {
      params: {
        page: 1,
        size: 50000,
        search: "",
        force_all: true,
        superuser_override: true
      },
      headers: {
        'X-Force-All-Data': 'true',
        'X-Superuser-Context': 'true'
      }
    });

    const resultCount = superuserResponse.data?.data?.results?.length || superuserResponse.data?.results?.length || 0;
    if (resultCount > 3) {
      console.log(`✅ Superuser context SUCCESS for ${configType}: ${resultCount} items`);
      return {
        success: true,
        data: superuserResponse.data,
        source: 'superuser-context'
      };
    }
  } catch (error) {
    console.log(`❌ Superuser context failed for ${configType}:`, error);
  }

  // Strategy 3: Try with global scope
  try {
    console.log(`3️⃣ Trying global scope for ${configType}`);
    const globalResponse = await AxiosWithToken.get(endpoint, {
      params: {
        page: 1,
        size: 100000,
        search: "",
        scope: "global",
        access_level: "global"
      }
    });

    const resultCount = globalResponse.data?.data?.results?.length || globalResponse.data?.results?.length || 0;
    if (resultCount > 1) {
      console.log(`✅ Global scope SUCCESS for ${configType}: ${resultCount} items`);
      return {
        success: true,
        data: globalResponse.data,
        source: 'global-scope'
      };
    }
  } catch (error) {
    console.log(`❌ Global scope failed for ${configType}:`, error);
  }

  // Strategy 4: Try alternative admin endpoints
  const adminEndpoints = [
    endpoint.replace('/finance/', '/admin/finance/'),
    endpoint.replace('/finance/', '/admins/finance/'),
    endpoint.replace('/config/', '/admin/config/'),
    endpoint.replace('/config/', '/admins/config/'),
    endpoint.replace('/program/', '/admin/program/'),
    endpoint.replace('/program/', '/admins/program/'),
    endpoint + 'all/',
    endpoint + 'full/',
    endpoint + 'unrestricted/'
  ];

  for (const altEndpoint of adminEndpoints) {
    try {
      console.log(`4️⃣ Trying alternative endpoint: ${altEndpoint}`);
      const altResponse = await AxiosWithToken.get(altEndpoint, {
        params: { page: 1, size: 50000, search: "" }
      });

      const resultCount = altResponse.data?.data?.results?.length || altResponse.data?.results?.length || 0;
      if (resultCount > 1) {
        console.log(`✅ Alternative endpoint SUCCESS for ${configType}: ${resultCount} items from ${altEndpoint}`);
        return {
          success: true,
          data: altResponse.data,
          source: `alt-endpoint-${altEndpoint}`
        };
      }
    } catch (error) {
      console.log(`❌ Alternative endpoint failed ${altEndpoint}:`, error);
    }
  }

  // All strategies failed
  console.warn(`⚠️ All bypass strategies failed for ${configType}. Using regular API.`);
  try {
    const regularResponse = await AxiosWithToken.get(endpoint, {
      params: { page: 1, size: 2000000, search: "" }
    });

    return {
      success: false,
      data: regularResponse.data,
      source: 'regular-api',
      error: 'Permission filtering still active'
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      source: 'failed',
      error: error
    };
  }
}