#!/usr/bin/env node

/**
 * Targeted API Endpoint Testing Script
 * Tests specific endpoints found in the controller files
 */

const https = require('https');

const BASE_URL = 'https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function testEndpoint(endpoint, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : null;
          resolve({
            statusCode: res.statusCode,
            data: jsonData,
            rawData: data
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: null,
            rawData: data,
            parseError: error.message
          });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}

async function testAllEndpoints(token) {
  console.log(`${colors.bold}${colors.cyan}Testing Core Dashboard Endpoints${colors.reset}\n`);

  const endpoints = [
    // Auth
    'auth/me/',

    // Users
    'users/',
    'users/profile/',

    // Projects
    'projects/',
    'projects/partners/',

    // Programs - Fund Requests
    'programs/fund-requests/',
    'programs/fund-requests/next-sequence/',

    // Programs - Other
    'programs/stakeholders/',
    'programs/work-plans/',
    'programs/adhoc/applicants/',

    // Admin - Inventory
    'admins/inventory/assets/',
    'admins/inventory/consumables/',
    'admins/inventory/stores/',
    'admins/inventory/good-receive-notes/',
    'admins/inventory/item-store-stocks/',
    'admins/inventory/assets/history/',
    'admins/inventory/assets/maintenance/',

    // Admin - Fleets
    'admins/fleets/fuel-consumptions/',
    'admins/fleets/vehicles/maintenance/tickets/',

    // Admin - Facilities
    'admins/facilities/maintenance/tickets/',

    // Admin - Payments & Reports
    'admins/payments/requests/',
    'admins/reports/travel-expenses/',
    'admins/authorization/expenses/',

    // Procurement
    'procurement/vendors/',
    'procurement/purchase-requests/',
    'procurement/purchase-orders/',
    'procurement/solicitations/',
    'procurement/lots/',

    // HR
    'hr/employees/',
    'hr/leave-requests/',
    'hr/timesheets/',
    'hr/positions/',
    'hr/grades/',

    // Finance
    'finance/reports/',
    'finance/customers/',
    'finance/petty-cash/',

    // Other
    'adhoc-requisitions/',
  ];

  const results = { working: [], unauthorized: [], notFound: [], error: [], responses: {} };

  for (const endpoint of endpoints) {
    try {
      const response = await testEndpoint(endpoint, token);
      const status = response.statusCode;

      if (status === 200) {
        console.log(`${colors.green}✓ ${endpoint}${colors.reset} - ${status} OK`);
        results.working.push(endpoint);
        results.responses[endpoint] = response.data;

        // Print sample of response structure
        if (response.data) {
          const preview = JSON.stringify(response.data, null, 2);
          console.log(`  ${colors.blue}Response:${colors.reset} ${preview.substring(0, 150)}...`);
        }
      } else if (status === 401) {
        console.log(`${colors.yellow}⚠ ${endpoint}${colors.reset} - ${status} Unauthorized`);
        results.unauthorized.push(endpoint);
      } else if (status === 404) {
        console.log(`${colors.red}✗ ${endpoint}${colors.reset} - ${status} Not Found`);
        results.notFound.push(endpoint);
      } else if (status === 500) {
        console.log(`${colors.red}✗ ${endpoint}${colors.reset} - ${status} Server Error`);
        results.error.push({ endpoint, status, data: response.data });
        if (response.data) {
          console.log(`  ${colors.red}Error:${colors.reset}`, JSON.stringify(response.data).substring(0, 100));
        }
      } else {
        console.log(`${colors.yellow}? ${endpoint}${colors.reset} - ${status}`);
        results.error.push({ endpoint, status, data: response.data });
        if (response.data) {
          console.log(`  Data:`, JSON.stringify(response.data).substring(0, 100));
        }
      }
    } catch (error) {
      console.log(`${colors.red}✗ ${endpoint}${colors.reset} - ERROR: ${error.message}`);
      results.error.push({ endpoint, error: error.message });
    }

    await new Promise(resolve => setTimeout(resolve, 150));
  }

  // Summary
  console.log(`\n${colors.bold}${colors.cyan}${'='.repeat(80)}${colors.reset}`);
  console.log(`${colors.bold}SUMMARY${colors.reset}\n`);
  console.log(`${colors.green}Working (200): ${results.working.length}${colors.reset}`);
  results.working.forEach(e => console.log(`  ✓ ${e}`));

  console.log(`\n${colors.yellow}Unauthorized (401): ${results.unauthorized.length}${colors.reset}`);
  if (results.unauthorized.length > 0) {
    console.log(`  These require valid authentication token`);
    results.unauthorized.forEach(e => console.log(`  ⚠ ${e}`));
  }

  console.log(`\n${colors.red}Not Found (404): ${results.notFound.length}${colors.reset}`);
  results.notFound.forEach(e => console.log(`  ✗ ${e}`));

  console.log(`\n${colors.red}Errors/Other: ${results.error.length}${colors.reset}`);
  results.error.forEach(e => {
    if (typeof e === 'object') {
      console.log(`  ✗ ${e.endpoint} - ${e.status || 'ERROR'}`);
    }
  });

  // Detailed response structures for working endpoints
  if (Object.keys(results.responses).length > 0) {
    console.log(`\n${colors.bold}${colors.cyan}WORKING ENDPOINT RESPONSE STRUCTURES:${colors.reset}\n`);
    for (const [endpoint, data] of Object.entries(results.responses)) {
      console.log(`${colors.cyan}${endpoint}:${colors.reset}`);
      console.log(JSON.stringify(data, null, 2).substring(0, 400));
      console.log('...\n');
    }
  }

  return results;
}

async function main() {
  const token = process.argv[2];

  if (!token) {
    console.log(`${colors.yellow}No token provided. Testing without authentication.${colors.reset}`);
    console.log(`${colors.yellow}Usage: node test-specific-endpoints.js YOUR_AUTH_TOKEN${colors.reset}\n`);
  } else {
    console.log(`${colors.green}Using authentication token${colors.reset}\n`);
  }

  const results = await testAllEndpoints(token);

  console.log(`\n${colors.bold}${colors.green}Testing complete!${colors.reset}`);
}

main().catch(console.error);
