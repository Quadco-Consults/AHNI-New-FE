import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrganizationalAccess } from '../../hooks/useOrganizationalAccess';
import {
  FolderOpen,
  Users,
  DollarSign,
  ShoppingCart,
  Settings,
  Globe,
  Home,
  ChevronDown,
  ChevronRight,
  Plus,
  Bell,
  Search
} from 'lucide-react';

interface EnhancedSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({
  isCollapsed = false,
  onToggle
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isAuthenticated,
    loading,
    user,
    getMenuStructure,
    getDashboardConfig,
    organizationalContext
  } = useOrganizationalAccess();

  const [expandedSections, setExpandedSections] = useState<string[]>(['department']);
  const [activeTab, setActiveTab] = useState<'department' | 'global'>('department');

  if (!isAuthenticated || loading || !user) {
    return (
      <div className="w-64 bg-gray-100 border-r border-gray-200 animate-pulse">
        <div className="p-4 space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const menuStructure = getMenuStructure();
  const dashboardPath = `/dashboard/${getDashboardConfig()}`;

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const icons = {
    FolderOpen: FolderOpen,
    Users: Users,
    DollarSign: DollarSign,
    ShoppingCart: ShoppingCart,
    Settings: Settings,
    Globe: Globe,
    Home: Home
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="space-y-2">
            {/* User info */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {user.first_name[0]}{user.last_name[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.position?.title} - {user.department?.name}
                </p>
              </div>
            </div>

            {/* Navigation tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('department')}
                className={`flex-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'department'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Department
              </button>
              <button
                onClick={() => setActiveTab('global')}
                className={`flex-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'global'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Global Hub
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation content */}
      <div className="flex-1 overflow-y-auto">
        {/* Dashboard link */}
        <div className="p-2">
          <button
            onClick={() => navigate(dashboardPath)}
            className={`w-full flex items-center space-x-3 px-3 py-2 text-left text-sm font-medium rounded-lg transition-colors ${
              isActivePath(dashboardPath)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Home className="w-5 h-5" />
            {!isCollapsed && <span>Dashboard</span>}
          </button>
        </div>

        {/* Department Navigation */}
        {activeTab === 'department' && !isCollapsed && (
          <div className="px-2 pb-4">
            <div className="mb-2">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {user.department?.name} Department
              </h3>
            </div>

            {menuStructure.department_menus.map((section) => {
              const isExpanded = expandedSections.includes(section.id);
              const SectionIcon = icons[section.icon as keyof typeof icons] || FolderOpen;

              return (
                <div key={section.id} className="mb-1">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <SectionIcon className="w-5 h-5" />
                      <span>{section.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {isExpanded && section.children && (
                    <div className="ml-8 mt-1 space-y-1">
                      {section.children.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => navigate(item.path)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                            isActivePath(item.path)
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                        >
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quick Actions for Department */}
            <div className="mt-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Quick Actions
              </h3>
              {menuStructure.quick_actions
                .filter(action => action.department === user.department?.code)
                .map((action) => (
                  <button
                    key={action.id}
                    onClick={() => navigate(action.path)}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-700 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{action.title}</span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Global Hub */}
        {activeTab === 'global' && !isCollapsed && (
          <div className="px-2 pb-4">
            <div className="mb-4">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Global Hub
              </h3>
              <p className="px-3 text-xs text-gray-400 mt-1">
                Organization-wide tools and resources
              </p>
            </div>

            {/* Search in global hub */}
            <div className="px-3 mb-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search global resources..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Global hub categories */}
            {[
              { category: 'communication', title: 'Communication', icon: '💬' },
              { category: 'administrative', title: 'Administrative', icon: '📋' },
              { category: 'reporting', title: 'Reports & Analytics', icon: '📊' },
              { category: 'operational', title: 'Operations', icon: '⚙️' }
            ].map((categoryGroup) => {
              const items = menuStructure.global_hub_items.filter(
                item => item.category === categoryGroup.category
              );

              if (items.length === 0) return null;

              return (
                <div key={categoryGroup.category} className="mb-4">
                  <h4 className="px-3 text-xs font-medium text-gray-600 mb-2">
                    {categoryGroup.icon} {categoryGroup.title}
                  </h4>
                  <div className="space-y-1">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          isActivePath(item.path)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                        }`}
                      >
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Universal quick actions */}
            <div className="mt-6">
              <h4 className="px-3 text-xs font-medium text-gray-600 mb-2">
                🚀 Quick Actions
              </h4>
              {menuStructure.quick_actions
                .filter(action => !action.department)
                .map((action) => (
                  <button
                    key={action.id}
                    onClick={() => navigate(action.path)}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-700 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <div>
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Admin section (only for admins) */}
        {menuStructure.admin_menus && menuStructure.admin_menus.length > 0 && !isCollapsed && (
          <div className="px-2 pb-4 border-t border-gray-200 pt-4">
            <div className="mb-2">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Administration
              </h3>
            </div>
            {menuStructure.admin_menus.map((section) => (
              <div key={section.id}>
                {section.children?.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                      isActivePath(item.path)
                        ? 'bg-red-50 text-red-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>{item.title}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with notifications */}
      {!isCollapsed && (
        <div className="p-3 border-t border-gray-200">
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
            <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
              3
            </span>
          </button>
        </div>
      )}
    </div>
  );
};