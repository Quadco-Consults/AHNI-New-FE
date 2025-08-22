export default function PlanPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Work Plan</h2>
          <p className="text-gray-600">Create and manage work plans</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Activity Tracker</h2>
          <p className="text-gray-600">Track work plan activities</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Activity Plan</h2>
          <p className="text-gray-600">Plan program activities</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Risk Management</h2>
          <p className="text-gray-600">Manage program risks</p>
        </div>
      </div>
    </div>
  );
}