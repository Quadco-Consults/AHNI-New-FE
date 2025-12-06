#!/usr/bin/env node

/**
 * API Endpoint Testing Script
 * Tests all major endpoints used by the AHNI ERP dashboard
 * Base URL: https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/
 */

const https = require('https');
const readline = require('readline');

const BASE_URL = 'https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/';

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

// Test results storage
const results = {
  working: [],
  errors: [],
  responses: {}
};

/**
 * Make HTTP request to test endpoint
 */
function testEndpoint(endpoint, token = null, method = 'GET') {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: method,
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

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : null;
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData,
            rawData: data
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: null,
            rawData: data,
            parseError: error.message
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

/**
 * Print section header
 */
function printHeader(text) {
  console.log(`\n${colors.bold}${colors.cyan}${'='.repeat(80)}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}${text}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}${'='.repeat(80)}${colors.reset}\n`);
}

/**
 * Print test result
 */
function printResult(endpoint, statusCode, success, message, responseData = null) {
  const statusColor = success ? colors.green : colors.red;
  const icon = success ? '✓' : '✗';

  console.log(`${statusColor}${icon} ${endpoint}${colors.reset}`);
  console.log(`  Status: ${statusColor}${statusCode}${colors.reset} - ${message}`);

  if (responseData) {
    console.log(`  Response Preview:`, JSON.stringify(responseData).substring(0, 200) + '...');
  }
  console.log('');
}

/**
 * Main testing function
 */
async function runTests(token) {
  printHeader('AHNI ERP API Endpoint Testing');
  console.log(`${colors.yellow}Testing endpoints without authentication first...${colors.reset}\n`);

  // Define endpoints to test
  const endpoints = [
    // Authentication endpoints
    { path: 'auth/me/', name: 'Get Current User', requiresAuth: true },
    { path: 'auth/login/', name: 'Login Endpoint (POST)', requiresAuth: false, method: 'POST' },

    // User endpoints
    { path: 'users/', name: 'Get All Users', requiresAuth: true },
    { path: 'users/profile/', name: 'Get User Profile', requiresAuth: true },

    // Project endpoints
    { path: 'projects/', name: 'Get All Projects', requiresAuth: true },
    { path: 'projects/partners/', name: 'Get Partners', requiresAuth: true },

    // Fund Request endpoints
    { path: 'programs/fund-requests/', name: 'Get All Fund Requests', requiresAuth: true },

    // Admin endpoints
    { path: 'admins/inventory/assets/', name: 'Get Assets', requiresAuth: true },
    { path: 'admins/inventory/consumables/', name: 'Get Consumables', requiresAuth: true },
    { path: 'admins/inventory/stores/', name: 'Get Stores', requiresAuth: true },
    { path: 'admins/fleets/fuel-consumptions/', name: 'Get Fuel Consumptions', requiresAuth: true },
    { path: 'admins/payments/requests/', name: 'Get Payment Requests', requiresAuth: true },

    // Procurement endpoints
    { path: 'procurement/vendors/', name: 'Get Vendors', requiresAuth: true },
    { path: 'procurement/purchase-requests/', name: 'Get Purchase Requests', requiresAuth: true },

    // HR endpoints
    { path: 'hr/employees/', name: 'Get Employees', requiresAuth: true },
    { path: 'hr/leave-requests/', name: 'Get Leave Requests', requiresAuth: true },

    // Finance endpoints
    { path: 'finance/reports/', name: 'Get Finance Reports', requiresAuth: true },

    // Programs endpoints
    { path: 'programs/stakeholders/', name: 'Get Stakeholders', requiresAuth: true },
    { path: 'programs/work-plans/', name: 'Get Work Plans', requiresAuth: true },
  ];

  // Test without authentication first
  printHeader('Testing Endpoints WITHOUT Authentication');

  for (const endpoint of endpoints) {
    try {
      const response = await testEndpoint(endpoint.path, null, endpoint.method || 'GET');

      if (response.statusCode === 401) {
        console.log(`${colors.yellow}⚠ ${endpoint.name}${colors.reset}`);
        console.log(`  Path: ${endpoint.path}`);
        console.log(`  Status: ${colors.yellow}401 Unauthorized${colors.reset} - Requires authentication (expected)`);
        console.log('');
      } else if (response.statusCode === 200) {
        results.working.push({
          endpoint: endpoint.path,
          name: endpoint.name,
          statusCode: response.statusCode,
          requiresAuth: false
        });
        results.responses[endpoint.path] = response.data;
        printResult(endpoint.name, response.statusCode, true, 'Works without authentication!', response.data);
      } else if (response.statusCode === 404) {
        results.errors.push({
          endpoint: endpoint.path,
          name: endpoint.name,
          error: 'Not Found',
          statusCode: 404
        });
        printResult(endpoint.name, response.statusCode, false, 'Endpoint not found', response.data);
      } else {
        results.errors.push({
          endpoint: endpoint.path,
          name: endpoint.name,
          error: response.rawData || 'Unknown error',
          statusCode: response.statusCode
        });
        printResult(endpoint.name, response.statusCode, false, 'Error response', response.data);
      }
    } catch (error) {
      results.errors.push({
        endpoint: endpoint.path,
        name: endpoint.name,
        error: error.message
      });
      printResult(endpoint.name, 'ERROR', false, error.message);
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Test with authentication if token provided
  if (token) {
    printHeader('Testing Endpoints WITH Authentication');

    for (const endpoint of endpoints.filter(e => e.requiresAuth)) {
      try {
        const response = await testEndpoint(endpoint.path, token, endpoint.method || 'GET');

        if (response.statusCode === 200) {
          results.working.push({
            endpoint: endpoint.path,
            name: endpoint.name,
            statusCode: response.statusCode,
            requiresAuth: true
          });
          results.responses[endpoint.path] = response.data;
          printResult(endpoint.name, response.statusCode, true, 'Success with authentication', response.data);
        } else if (response.statusCode === 401) {
          results.errors.push({
            endpoint: endpoint.path,
            name: endpoint.name,
            error: 'Authentication failed - invalid token',
            statusCode: 401
          });
          printResult(endpoint.name, response.statusCode, false, 'Authentication failed - invalid token', response.data);
        } else if (response.statusCode === 403) {
          results.errors.push({
            endpoint: endpoint.path,
            name: endpoint.name,
            error: 'Forbidden - insufficient permissions',
            statusCode: 403
          });
          printResult(endpoint.name, response.statusCode, false, 'Forbidden - insufficient permissions', response.data);
        } else if (response.statusCode === 404) {
          results.errors.push({
            endpoint: endpoint.path,
            name: endpoint.name,
            error: 'Not Found',
            statusCode: 404
          });
          printResult(endpoint.name, response.statusCode, false, 'Endpoint not found', response.data);
        } else if (response.statusCode === 500) {
          results.errors.push({
            endpoint: endpoint.path,
            name: endpoint.name,
            error: 'Server Error',
            statusCode: 500
          });
          printResult(endpoint.name, response.statusCode, false, 'Server error (500)', response.data);
        } else {
          results.errors.push({
            endpoint: endpoint.path,
            name: endpoint.name,
            error: response.rawData || 'Unknown error',
            statusCode: response.statusCode
          });
          printResult(endpoint.name, response.statusCode, false, 'Unexpected response', response.data);
        }
      } catch (error) {
        results.errors.push({
          endpoint: endpoint.path,
          name: endpoint.name,
          error: error.message
        });
        printResult(endpoint.name, 'ERROR', false, error.message);
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  // Print summary
  printHeader('Test Summary');

  console.log(`${colors.green}✓ Working Endpoints: ${results.working.length}${colors.reset}`);
  results.working.forEach(r => {
    console.log(`  - ${r.name} (${r.endpoint}) - ${r.statusCode}`);
  });

  console.log(`\n${colors.red}✗ Error Endpoints: ${results.errors.length}${colors.reset}`);
  results.errors.forEach(r => {
    console.log(`  - ${r.name} (${r.endpoint}) - ${r.statusCode || 'ERROR'}: ${r.error}`);
  });

  // Sample response structures
  if (Object.keys(results.responses).length > 0) {
    printHeader('Sample Response Structures (Working Endpoints)');
    for (const [endpoint, response] of Object.entries(results.responses)) {
      console.log(`${colors.cyan}${endpoint}:${colors.reset}`);
      console.log(JSON.stringify(response, null, 2).substring(0, 500) + '...\n');
    }
  }

  console.log(`\n${colors.bold}${colors.magenta}Testing completed!${colors.reset}\n`);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  let token = null;

  if (args.length > 0) {
    if (args[0] === '--token' && args[1]) {
      token = args[1];
      console.log(`${colors.green}Using provided authentication token${colors.reset}`);
    } else if (args[0] === '--help' || args[0] === '-h') {
      console.log(`
${colors.bold}AHNI ERP API Endpoint Tester${colors.reset}

Usage:
  node test-api-endpoints.js [--token YOUR_TOKEN]

Options:
  --token TOKEN    Provide authentication token for testing protected endpoints
  --help, -h       Show this help message

Examples:
  node test-api-endpoints.js
  node test-api-endpoints.js --token "your_auth_token_here"
      `);
      process.exit(0);
    }
  } else {
    console.log(`${colors.yellow}No authentication token provided. Testing without authentication.${colors.reset}`);
    console.log(`${colors.yellow}Use --token YOUR_TOKEN to test authenticated endpoints.${colors.reset}\n`);
  }

  await runTests(token);
}

main().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});
