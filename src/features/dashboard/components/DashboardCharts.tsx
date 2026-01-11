"use client";

import Card from "@/components/Card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Enhanced color palette for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658"];

interface ChartDataItem {
  name: string;
  value?: number;
  projects?: number;
  employees?: number;
  percentage?: string;
  fullName?: string;
}

interface DashboardChartsProps {
  chartData: {
    projectStatusChart?: ChartDataItem[];
    locationChart?: ChartDataItem[];
    fundingChart?: ChartDataItem[];
    departmentChart?: ChartDataItem[];
    fundRequestChart?: ChartDataItem[];
  };
  realProjectsAnalytics: {
    totalProjects: number;
  } | null;
  realWorkforceAnalytics: {
    totalEmployees: number;
    departmentGroups: Record<string, number>;
  } | null;
  isLoadingWorkforce: boolean;
  workforceError: any;
  canAccessHRFeatures: boolean;
}

export default function DashboardCharts({
  chartData,
  realProjectsAnalytics,
  realWorkforceAnalytics,
  isLoadingWorkforce,
  workforceError,
  canAccessHRFeatures,
}: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Project Status Distribution */}
      {chartData.projectStatusChart && chartData.projectStatusChart.length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Project Status Distribution</h3>
              <p className="text-sm text-gray-600">Real-time project status breakdown</p>
            </div>
            <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
              {realProjectsAnalytics?.totalProjects} Projects
            </Badge>
          </div>
          <div className="h-64 w-full min-h-[256px]" style={{ minHeight: '256px', height: '256px' }}>
            <ResponsiveContainer width="100%" height={256}>
              <PieChart>
                <Pie
                  data={chartData.projectStatusChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.projectStatusChart.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} projects`, name]}
                  labelFormatter={() => 'Project Status'}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {chartData.projectStatusChart.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Geographic Distribution */}
      {chartData.locationChart && chartData.locationChart.length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Geographic Distribution</h3>
              <p className="text-sm text-gray-600">Projects by location/state</p>
            </div>
            <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
              {chartData.locationChart.length} Locations
            </Badge>
          </div>
          <div className="h-64 w-full min-h-[256px]" style={{ minHeight: '256px', height: '256px' }}>
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={chartData.locationChart} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: any) => [`${value} projects`, 'Projects']}
                  labelFormatter={(label: any) => `Location: ${label}`}
                />
                <Bar dataKey="projects" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Funding Source Distribution */}
      {(chartData.fundingChart && chartData.fundingChart.length > 0) ? (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Funding Sources</h3>
              <p className="text-sm text-gray-600">Projects by funding organization</p>
            </div>
            <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
              {chartData.fundingChart.length} Sources
            </Badge>
          </div>
          <div className="h-80 w-full min-h-[320px]" style={{ minHeight: '320px', height: '320px' }}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData.fundingChart} layout="horizontal" margin={{ top: 20, right: 30, left: 120, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11 }}
                  width={110}
                  interval={0}
                />
                <Tooltip
                  formatter={(value: any) => [`${value} projects`, 'Projects']}
                  labelFormatter={(label: any, payload: any) => {
                    if (payload && payload.length > 0 && payload[0].payload.fullName) {
                      return `Source: ${payload[0].payload.fullName}`;
                    }
                    return `Source: ${label}`;
                  }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="projects" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Funding Sources</h3>
              <p className="text-sm text-gray-600">Projects by funding organization</p>
            </div>
            <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-600">
              0 Sources
            </Badge>
          </div>
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="w-16 h-16 mb-4 text-gray-300">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-2">No funding sources found</p>
            <p className="text-xs text-gray-500 text-center max-w-48">
              Projects with funding sources will appear here once you have project data
            </p>
          </div>
        </Card>
      )}

      {/* Workforce Distribution */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Workforce Distribution</h3>
            <p className="text-sm text-gray-600">
              {isLoadingWorkforce ? "Loading workforce data..." :
               workforceError ? "Error loading workforce data" :
               !canAccessHRFeatures ? "Requires HR access" :
               "Employees by department"}
            </p>
          </div>
          {realWorkforceAnalytics && realWorkforceAnalytics.totalEmployees > 0 && (
            <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
              {realWorkforceAnalytics.totalEmployees} Employees
            </Badge>
          )}
        </div>

        {isLoadingWorkforce ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-600 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Loading workforce data...</span>
          </div>
        ) : workforceError ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="w-12 h-12 mb-3 text-red-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-red-600 mb-1">Failed to load workforce data</p>
            <p className="text-xs text-gray-500 text-center max-w-64">
              {workforceError?.message || "Please check your connection and try refreshing the page"}
            </p>
          </div>
        ) : !canAccessHRFeatures ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="w-12 h-12 mb-3 text-amber-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-amber-600 mb-1">Access Required</p>
            <p className="text-xs text-gray-500 text-center max-w-64">
              You need HR department access to view workforce distribution
            </p>
          </div>
        ) : !chartData.departmentChart || chartData.departmentChart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="w-12 h-12 mb-3 text-gray-300">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">No workforce data found</p>
            <p className="text-xs text-gray-500 text-center max-w-48">
              Employee data will appear here once staff records are added
            </p>
          </div>
        ) : (
          <>
            <div className="h-64 w-full min-h-[256px]" style={{ minHeight: '256px', height: '256px' }}>
              <ResponsiveContainer width="100%" height={256}>
                <PieChart>
                  <Pie
                    data={chartData.departmentChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#82CA9D"
                    dataKey="employees"
                  >
                    {chartData.departmentChart.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value} employees`, name]}
                    labelFormatter={() => 'Department'}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2">
              {chartData.departmentChart.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] }}></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.employees} ({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
