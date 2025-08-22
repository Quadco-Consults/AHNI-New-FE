export default function ProgramPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Programs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Plans</h2>
          <p className="text-gray-600">Manage work plans, activities, and supervision</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Stakeholder Management</h2>
          <p className="text-gray-600">Handle stakeholder analysis and engagement</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Fund Requests</h2>
          <p className="text-gray-600">Process and track fund requests</p>
        </div>
      </div>
    </div>
  );
}