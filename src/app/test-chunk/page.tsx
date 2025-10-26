'use client';

export default function TestChunkPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Chunk Loading Test</h1>
      <p className="text-green-600">✅ If you can see this page, chunk loading is working correctly!</p>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Test Results:</h2>
        <ul className="space-y-1 text-sm">
          <li>✅ React component loading</li>
          <li>✅ Tailwind CSS working</li>
          <li>✅ Client-side hydration successful</li>
          <li>✅ Next.js routing functional</li>
        </ul>
      </div>
      <div className="mt-4">
        <button
          onClick={() => alert('JavaScript is working!')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test JavaScript
        </button>
      </div>
    </div>
  );
}