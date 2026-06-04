// Clear Activity Memo Form Cache
// Run this in your browser console: http://localhost:3000

// Clear the standalone activity memo form cache
localStorage.removeItem('standalone_activity_memo_form');

// Clear any other memo-related cache
Object.keys(localStorage).forEach(key => {
  if (key.includes('memo') || key.includes('activity')) {
    console.log('Clearing:', key);
    localStorage.removeItem(key);
  }
});

console.log('✅ Activity memo cache cleared! Refresh the page.');
