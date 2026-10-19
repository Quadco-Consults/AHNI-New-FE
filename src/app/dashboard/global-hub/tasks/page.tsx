'use client';

import { useState, useMemo } from 'react';
import { CheckSquare, Search, Filter, Calendar, User, AlertCircle, CheckCircle, Clock, DollarSign, RefreshCw, Eye, Check, X, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTasksAndApprovals, UnifiedTask, ApprovalModule } from '@/hooks/useTasksAndApprovals';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

type SortField = 'title' | 'priority' | 'createdAt' | 'dueDate' | 'amount' | 'type';
type SortOrder = 'asc' | 'desc';

export default function TasksPage() {
  const router = useRouter();
  const { tasks, isLoading, approveTask, rejectTask, refetch } = useTasksAndApprovals();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [taskToReject, setTaskToReject] = useState<UnifiedTask | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [visibleColumns, setVisibleColumns] = useState({
    requestType: true,
    actionRequired: true,
    priority: true,
    requestor: true,
    amount: true,
    dueDate: true,
    createdAt: true,
  });
  const [activeTab, setActiveTab] = useState<string>('all');

  const handleApprove = async (task: UnifiedTask) => {
    setIsApproving(task.id);
    try {
      await approveTask(task);
      setFetchError(null);
    } catch (error) {
      console.error('Error approving task:', error);
      setFetchError('Failed to approve task. Please try again.');
    } finally {
      setIsApproving(null);
    }
  };

  const handleRejectClick = (task: UnifiedTask) => {
    setTaskToReject(task);
    setIsRejectDialogOpen(true);
  };

  const handleConfirmReject = async () => {
    if (taskToReject) {
      setIsRejecting(true);
      try {
        await rejectTask(taskToReject, rejectReason);
        setIsRejectDialogOpen(false);
        setTaskToReject(null);
        setRejectReason('');
        setFetchError(null);
      } catch (error) {
        console.error('Error rejecting task:', error);
        setFetchError('Failed to reject task. Please try again.');
      } finally {
        setIsRejecting(false);
      }
    }
  };

  const handleViewDetails = (task: UnifiedTask) => {
    if (task.detailsUrl) {
      router.push(task.detailsUrl);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Count tasks by request type
  const tasksByType = useMemo(() => {
    const counts: Record<string, number> = {
      all: tasks.length,
    };

    tasks.forEach((task) => {
      counts[task.type] = (counts[task.type] || 0) + 1;
    });

    return counts;
  }, [tasks]);

  // Get unique task types present in tasks
  const availableTaskTypes = useMemo(() => {
    return Array.from(new Set(tasks.map(t => t.type)));
  }, [tasks]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.requestor?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesTab = activeTab === 'all' || task.type === activeTab;

      let matchesDate = true;
      if (dateFilter === 'today') {
        matchesDate = new Date(task.createdAt).toDateString() === new Date().toDateString();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = new Date(task.createdAt) > weekAgo;
      } else if (dateFilter === 'overdue') {
        matchesDate = task.dueDate ? new Date(task.dueDate) < new Date() : false;
      }

      return matchesSearch && matchesPriority && matchesDate && matchesTab;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          comparison = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'amount':
          comparison = (a.amount ?? 0) - (b.amount ?? 0);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [tasks, searchQuery, priorityFilter, dateFilter, sortField, sortOrder, activeTab]);

  const highPriorityTasks = filteredAndSortedTasks.filter((t) => t.priority === 'high');
  const overdueTasks = filteredAndSortedTasks.filter((t) => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  });

  const getRequestTypeBadge = (type: ApprovalModule) => {
    const requestTypeConfig: Record<ApprovalModule, { label: string; color: string }> = {
      purchase_request: { label: 'Purchase Request', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      leave_request: { label: 'Leave Request', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      timesheet: { label: 'Timesheet Approval', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
      payment_request: { label: 'Payment Request', color: 'bg-green-100 text-green-800 border-green-200' },
      expense_authorization: { label: 'Expense Authorization', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      travel_request: { label: 'Travel Request', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      vehicle_request: { label: 'Vehicle Request', color: 'bg-orange-100 text-orange-800 border-orange-200' },
      item_requisition: { label: 'Item Requisition', color: 'bg-pink-100 text-pink-800 border-pink-200' },
      contract_request: { label: 'Contract Request', color: 'bg-teal-100 text-teal-800 border-teal-200' },
      fund_request: { label: 'Fund Request', color: 'bg-violet-100 text-violet-800 border-violet-200' },
      asset_request: { label: 'Asset Request', color: 'bg-rose-100 text-rose-800 border-rose-200' },
      facility_maintenance: { label: 'Facility Maintenance', color: 'bg-amber-100 text-amber-800 border-amber-200' },
      vehicle_maintenance: { label: 'Vehicle Maintenance', color: 'bg-lime-100 text-lime-800 border-lime-200' },
      cba_review: { label: 'CBA Review', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      cba_authorise: { label: 'CBA Authorisation', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      cba_approve: { label: 'CBA Approval', color: 'bg-violet-100 text-violet-800 border-violet-200' },
      interview_panel: { label: 'Interview Panel', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      staff_requisition: { label: 'Staff Requisition', color: 'bg-sky-100 text-sky-800 border-sky-200' },
      adhoc_staff: { label: 'Adhoc Staff Request', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      custom_task: { label: 'General Task', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    };

    const config = requestTypeConfig[type] || requestTypeConfig.custom_task;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getActionRequired = (type: ApprovalModule) => {
    const actionConfig: Record<ApprovalModule, string> = {
      purchase_request: 'Approve Purchase',
      leave_request: 'Approve Leave',
      timesheet: 'Approve Timesheet',
      payment_request: 'Approve Payment',
      expense_authorization: 'Authorize Expense',
      travel_request: 'Approve Travel',
      vehicle_request: 'Approve Vehicle',
      item_requisition: 'Approve Requisition',
      contract_request: 'Approve Contract',
      fund_request: 'Approve Fund Request',
      asset_request: 'Approve Asset',
      facility_maintenance: 'Approve Maintenance',
      vehicle_maintenance: 'Approve Maintenance',
      cba_review: 'Review CBA',
      cba_authorise: 'Authorise CBA',
      cba_approve: 'Approve CBA',
      interview_panel: 'Conduct Interview',
      staff_requisition: 'Approve Requisition',
      adhoc_staff: 'Approve Request',
      custom_task: 'Complete Task',
    };

    return actionConfig[type] || 'Review & Approve';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriorityFilter('all');
    setDateFilter('all');
  };

  const hasActiveFilters = searchQuery !== '' || priorityFilter !== 'all' || dateFilter !== 'all';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Error Alert */}
      {fetchError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{fetchError}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFetchError(null)}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CheckSquare className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Tasks & Approvals</h1>
            <p className="text-sm text-gray-600">All your pending approvals in one place</p>
          </div>
        </div>
        <Button onClick={refetch} variant="outline" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pending</p>
                <p className="text-2xl font-bold text-gray-900">{filteredAndSortedTasks.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{highPriorityTasks.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-orange-600">{overdueTasks.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredAndSortedTasks.filter((t) => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(t.createdAt) > weekAgo;
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="flex flex-wrap gap-2 h-auto bg-transparent p-0">
          <TabsTrigger value="all" className="relative">
            All Tasks
            {tasksByType.all > 0 && (
              <Badge className="ml-2 bg-blue-600 text-white text-xs px-2 py-0">
                {tasksByType.all}
              </Badge>
            )}
          </TabsTrigger>
          {availableTaskTypes.map((taskType) => {
            const config = getRequestTypeBadge(taskType);
            const label = config.props.children;
            const count = tasksByType[taskType] || 0;

            return (
              <TabsTrigger key={taskType} value={taskType} className="relative">
                {label}
                {count > 0 && (
                  <Badge className="ml-2 bg-blue-600 text-white text-xs px-2 py-0">
                    {count}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks, requestor..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {/* Column Visibility */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Columns
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.requestType}
                    onCheckedChange={(checked) => setVisibleColumns({ ...visibleColumns, requestType: checked })}
                  >
                    Request Type
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.actionRequired}
                    onCheckedChange={(checked) => setVisibleColumns({ ...visibleColumns, actionRequired: checked })}
                  >
                    Action Required
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.priority}
                    onCheckedChange={(checked) => setVisibleColumns({ ...visibleColumns, priority: checked })}
                  >
                    Priority
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.requestor}
                    onCheckedChange={(checked) => setVisibleColumns({ ...visibleColumns, requestor: checked })}
                  >
                    Requestor
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.amount}
                    onCheckedChange={(checked) => setVisibleColumns({ ...visibleColumns, amount: checked })}
                  >
                    Amount
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.dueDate}
                    onCheckedChange={(checked) => setVisibleColumns({ ...visibleColumns, dueDate: checked })}
                  >
                    Due Date
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.createdAt}
                    onCheckedChange={(checked) => setVisibleColumns({ ...visibleColumns, createdAt: checked })}
                  >
                    Created Date
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Results and Clear Filters */}
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
                {hasActiveFilters && <span className="text-blue-600 ml-2">(filtered)</span>}
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Tasks Table */}
      <Card>
        {isLoading ? (
          <CardContent className="p-8 text-center">
            <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-3 animate-spin" />
            <p className="text-gray-600">Loading tasks and approvals...</p>
          </CardContent>
        ) : filteredAndSortedTasks.length === 0 ? (
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-900 font-semibold mb-1">
              {hasActiveFilters ? 'No tasks match your filters' : 'All caught up!'}
            </p>
            <p className="text-gray-600">
              {hasActiveFilters ? 'Try adjusting your search or filter criteria' : 'No pending approvals or tasks'}
            </p>
          </CardContent>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('title')} className="h-8 px-2">
                    Task
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                {visibleColumns.requestType && (
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort('type')} className="h-8 px-2">
                      Request Type
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.actionRequired && <TableHead>Action Required</TableHead>}
                {visibleColumns.priority && (
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort('priority')} className="h-8 px-2">
                      Priority
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.requestor && <TableHead>Requestor</TableHead>}
                {visibleColumns.amount && (
                  <TableHead className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('amount')} className="h-8 px-2">
                      Amount
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.dueDate && (
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort('dueDate')} className="h-8 px-2">
                      Due Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.createdAt && (
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort('createdAt')} className="h-8 px-2">
                      Created
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                )}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTasks.map((task) => {
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
                return (
                  <TableRow key={task.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{task.description}</div>
                      </div>
                    </TableCell>
                    {visibleColumns.requestType && <TableCell>{getRequestTypeBadge(task.type)}</TableCell>}
                    {visibleColumns.actionRequired && (
                      <TableCell>
                        <div className="text-sm font-medium text-blue-700">
                          {getActionRequired(task.type)}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.priority && (
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority.toUpperCase()}
                          </Badge>
                          {isOverdue && <Badge className="bg-red-500 text-white">OVERDUE</Badge>}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.requestor && (
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-3 w-3 text-gray-400" />
                          <span className="font-medium">{task.requestor || '-'}</span>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.amount && (
                      <TableCell className="text-right">
                        {task.amount != null ? (
                          <div className="flex items-center justify-end gap-1 text-sm">
                            <DollarSign className="h-3 w-3" />
                            {task.amount.toLocaleString()}
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    )}
                    {visibleColumns.dueDate && (
                      <TableCell>
                        {task.dueDate ? (
                          <div className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-600 font-semibold' : ''}`}>
                            <Calendar className="h-3 w-3" />
                            {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    )}
                    {visibleColumns.createdAt && (
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(task)}
                          disabled={isApproving === task.id}
                          className="bg-green-600 hover:bg-green-700 text-white h-8"
                        >
                          {isApproving === task.id ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectClick(task)}
                          disabled={isApproving === task.id || isRejecting}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                        >
                          <X className="h-3 w-3" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(task)}
                          className="h-8"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Reject Confirmation Dialog */}
      <AlertDialog
        open={isRejectDialogOpen}
        onOpenChange={(open) => {
          setIsRejectDialogOpen(open);
          if (!open) {
            setTaskToReject(null);
            setRejectReason('');
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject {taskToReject?.title}?</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this request. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4">
            <Label htmlFor="reason">Reason for Rejection</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setTaskToReject(null);
                setRejectReason('');
              }}
              disabled={isRejecting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReject}
              disabled={!rejectReason.trim() || isRejecting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isRejecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject Request'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
