import React from 'react';
import { useOrganizationalAccess } from '../../hooks/useOrganizationalAccess';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  Target,
  Clock
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(change)}% from last month
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Program Officer Dashboard
export const ProgramOfficerDashboard: React.FC = () => {
  const { user, organizationalContext } = useOrganizationalAccess();

  const projectData = [
    { name: 'Health', active: 12, completed: 8 },
    { name: 'Education', active: 8, completed: 15 },
    { name: 'Water', active: 6, completed: 4 },
    { name: 'Agriculture', active: 4, completed: 7 }
  ];

  const budgetData = [
    { name: 'Allocated', value: 75 },
    { name: 'Spent', value: 45 },
    { name: 'Remaining', value: 30 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white p-6">
        <h1 className="text-2xl font-bold">Welcome back, {user?.first_name}!</h1>
        <p className="mt-2 opacity-90">
          You have 3 pending workplan approvals and 2 fund requests awaiting review.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Projects"
          value={30}
          change={12}
          icon={<Target className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Budget Utilization"
          value="68%"
          change={-3}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="Pending Approvals"
          value={5}
          change={25}
          icon={<AlertCircle className="w-6 h-6" />}
          color="yellow"
        />
        <MetricCard
          title="Site Visits"
          value={12}
          change={20}
          icon={<Calendar className="w-6 h-6" />}
          color="blue"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status by Theme */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Theme</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="active" fill="#3B82F6" name="Active" />
              <Bar dataKey="completed" fill="#10B981" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={budgetData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {budgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#3B82F6', '#EF4444', '#10B981'][index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities and Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[
              { action: 'Created workplan', project: 'Clean Water Initiative', time: '2 hours ago', status: 'completed' },
              { action: 'Submitted fund request', project: 'Education Program', time: '1 day ago', status: 'pending' },
              { action: 'Site visit completed', project: 'Health Clinic Project', time: '2 days ago', status: 'completed' },
              { action: 'Budget revision', project: 'Agriculture Support', time: '3 days ago', status: 'under_review' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'completed' ? 'bg-green-500' :
                  activity.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.project}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Tasks</h3>
          <div className="space-y-4">
            {[
              { task: 'Review Q4 workplan draft', priority: 'high', due: 'Today' },
              { task: 'Submit monthly site visit report', priority: 'medium', due: 'Tomorrow' },
              { task: 'Update project timeline', priority: 'low', due: 'This week' },
              { task: 'Prepare budget presentation', priority: 'high', due: 'Friday' }
            ].map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{task.task}</p>
                  <p className="text-xs text-gray-600 mt-1">Due: {task.due}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  task.priority === 'high' ? 'bg-red-100 text-red-600' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// HR Staff Dashboard
export const HRStaffDashboard: React.FC = () => {
  const { user } = useOrganizationalAccess();

  const leaveData = [
    { month: 'Jan', requests: 15, approved: 12 },
    { month: 'Feb', requests: 18, approved: 16 },
    { month: 'Mar', requests: 22, approved: 20 },
    { month: 'Apr', requests: 19, approved: 17 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white p-6">
        <h1 className="text-2xl font-bold">HR Dashboard - {user?.first_name}</h1>
        <p className="mt-2 opacity-90">
          Managing people operations for {user?.location?.name}
        </p>
      </div>

      {/* HR Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Employees"
          value={245}
          change={8}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Leave Requests"
          value={23}
          change={15}
          icon={<Calendar className="w-6 h-6" />}
          color="yellow"
        />
        <MetricCard
          title="Open Positions"
          value={12}
          change={-10}
          icon={<Target className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="Timesheet Compliance"
          value="94%"
          change={5}
          icon={<Clock className="w-6 h-6" />}
          color="green"
        />
      </div>

      {/* Leave Trends */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Request Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={leaveData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="requests" stroke="#8884d8" name="Requests" />
            <Line type="monotone" dataKey="approved" stroke="#82ca9d" name="Approved" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions for HR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
              <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-blue-600">Leave Request</span>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-green-600">Timesheet</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
              <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-purple-600">Directory</span>
            </button>
            <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-center transition-colors">
              <FileText className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-yellow-600">Policies</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {[
              { event: 'Team Meeting', date: 'Today, 2:00 PM', type: 'meeting' },
              { event: 'Performance Reviews Due', date: 'Friday', type: 'deadline' },
              { event: 'New Employee Orientation', date: 'Next Monday', type: 'training' },
              { event: 'Policy Update Training', date: 'Next Wednesday', type: 'training' }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  item.type === 'meeting' ? 'bg-blue-500' :
                  item.type === 'deadline' ? 'bg-red-500' : 'bg-green-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.event}</p>
                  <p className="text-xs text-gray-600">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Finance Staff Dashboard
export const FinanceStaffDashboard: React.FC = () => {
  const { user } = useOrganizationalAccess();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white p-6">
        <h1 className="text-2xl font-bold">Finance Dashboard - {user?.first_name}</h1>
        <p className="mt-2 opacity-90">
          Financial operations and reporting for {user?.department?.name}
        </p>
      </div>

      {/* Finance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Monthly Budget"
          value="$125K"
          change={12}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="Expenses Pending"
          value={18}
          change={-8}
          icon={<FileText className="w-6 h-6" />}
          color="yellow"
        />
        <MetricCard
          title="Approved This Month"
          value="$98K"
          change={15}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="Variance"
          value="-2.3%"
          change={5}
          icon={<TrendingDown className="w-6 h-6" />}
          color="red"
        />
      </div>

      {/* Finance specific content would go here */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Financial Activities</h3>
        <p className="text-gray-600">Finance dashboard content...</p>
      </div>
    </div>
  );
};

// Procurement Staff Dashboard
export const ProcurementStaffDashboard: React.FC = () => {
  const { user } = useOrganizationalAccess();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-white p-6">
        <h1 className="text-2xl font-bold">Procurement Dashboard - {user?.first_name}</h1>
        <p className="mt-2 opacity-90">
          Procurement operations and vendor management
        </p>
      </div>

      {/* Procurement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Requests"
          value={34}
          change={18}
          icon={<FileText className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Vendors"
          value={156}
          change={5}
          icon={<Users className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="This Month's Value"
          value="$87K"
          change={22}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="Avg. Processing Time"
          value="3.2 days"
          change={-15}
          icon={<Clock className="w-6 h-6" />}
          color="green"
        />
      </div>

      {/* Procurement specific content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Procurement Pipeline</h3>
        <p className="text-gray-600">Procurement dashboard content...</p>
      </div>
    </div>
  );
};