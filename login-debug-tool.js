/**
 * Login Debug Tool
 *
 * This script helps debug the "Expected a string value" error
 * by capturing and analyzing the exact request data being sent.
 *
 * Usage:
 * 1. Open browser developer tools
 * 2. Go to Console tab
 * 3. Copy and paste this entire script
 * 4. Try to login and check the detailed logs
 */

// Store original fetch to intercept network requests
const originalFetch = window.fetch;

// Intercept fetch requests
window.fetch = function(...args) {
  const [url, options] = args;

  // Only intercept login requests
  if (url && url.includes('auth/login')) {
    console.group('🔍 LOGIN DEBUG - Request Interception');
    console.log('URL:', url);
    console.log('Options:', options);

    if (options && options.body) {
      console.log('Body type:', typeof options.body);
      console.log('Body constructor:', options.body.constructor.name);

      try {
        if (typeof options.body === 'string') {
          const parsedBody = JSON.parse(options.body);
          console.log('Parsed body:', parsedBody);

          // Check data types
          console.log('Email type:', typeof parsedBody.email);
          console.log('Email value:', parsedBody.email);
          console.log('Password type:', typeof parsedBody.password);
          console.log('Password value length:', parsedBody.password ? parsedBody.password.length : 'undefined');

          // Check for non-string values
          Object.entries(parsedBody).forEach(([key, value]) => {
            if (typeof value !== 'string') {
              console.warn(`⚠️  ${key} is not a string:`, {
                type: typeof value,
                value: value,
                constructor: value ? value.constructor.name : 'null/undefined'
              });
            }
          });
        }
      } catch (e) {
        console.error('Failed to parse body:', e);
      }
    }

    console.log('Headers:', options?.headers);
    console.groupEnd();
  }

  // Call original fetch
  return originalFetch.apply(this, args).then(response => {
    if (url && url.includes('auth/login')) {
      console.group('🔍 LOGIN DEBUG - Response');
      console.log('Status:', response.status);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));

      // Clone response to read body without consuming it
      const responseClone = response.clone();
      responseClone.text().then(text => {
        try {
          const data = JSON.parse(text);
          console.log('Response data:', data);
        } catch (e) {
          console.log('Response text:', text);
        }
      });
      console.groupEnd();
    }
    return response;
  });
};

// Also intercept XMLHttpRequest (if axios uses it)
const originalOpen = XMLHttpRequest.prototype.open;
const originalSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function(method, url, ...args) {
  this._debugUrl = url;
  this._debugMethod = method;
  return originalOpen.apply(this, [method, url, ...args]);
};

XMLHttpRequest.prototype.send = function(data) {
  if (this._debugUrl && this._debugUrl.includes('auth/login')) {
    console.group('🔍 LOGIN DEBUG - XMLHttpRequest');
    console.log('Method:', this._debugMethod);
    console.log('URL:', this._debugUrl);
    console.log('Data type:', typeof data);
    console.log('Data:', data);

    if (typeof data === 'string') {
      try {
        const parsedData = JSON.parse(data);
        console.log('Parsed data:', parsedData);
        Object.entries(parsedData).forEach(([key, value]) => {
          console.log(`${key} type:`, typeof value, 'value:', value);
        });
      } catch (e) {
        console.error('Failed to parse data:', e);
      }
    }
    console.groupEnd();
  }
  return originalSend.apply(this, [data]);
};

console.log('✅ Login debug tool installed. Try logging in now and check the console for detailed logs.');