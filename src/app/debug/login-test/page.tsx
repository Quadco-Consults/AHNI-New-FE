import LoginDebugComponent from '@/components/debug/LoginDebugComponent';

export default function LoginTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8">Login Authentication Test</h1>
        <LoginDebugComponent />
      </div>
    </div>
  );
}