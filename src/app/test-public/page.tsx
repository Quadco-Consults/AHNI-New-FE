"use client";

export default function TestPublicPage() {
  console.log("🧪 TEST PUBLIC PAGE LOADED SUCCESSFULLY");
  console.log("🧪 Current URL:", typeof window !== 'undefined' ? window.location.href : 'SSR');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Public Page</h1>
      <p>This is a test page to verify public access works.</p>
      <p>If you can see this page, then public routes are working correctly.</p>
    </div>
  );
}