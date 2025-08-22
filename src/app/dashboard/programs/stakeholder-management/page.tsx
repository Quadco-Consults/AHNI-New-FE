export default function StakeholderManagementPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Stakeholder Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Analysis & Mapping</h2>
          <p className="text-gray-600">Analyze and map stakeholders</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Stakeholder Register</h2>
          <p className="text-gray-600">Maintain stakeholder records</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Engagement Plan</h2>
          <p className="text-gray-600">Plan stakeholder engagement</p>
        </div>
      </div>
    </div>
  );
}