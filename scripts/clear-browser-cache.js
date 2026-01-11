// Clear browser cache and localStorage script
// Run this in your browser console

console.log('🧹 Clearing browser cache and storage...');

// Clear localStorage
localStorage.clear();
console.log('✅ LocalStorage cleared');

// Clear sessionStorage
sessionStorage.clear();
console.log('✅ SessionStorage cleared');

// Clear cookies for current domain
document.cookie.split(";").forEach(function(c) {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
console.log('✅ Cookies cleared');

console.log('🎯 Browser cache cleared! Please refresh the page (Ctrl/Cmd + R)');