'use client';

import { useState } from 'react';
import { CheckSquare, Search, Filter, Calendar, User, AlertCircle, CheckCircle, Clock, DollarSign, RefreshCw, Eye, Check, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTasksAndApprovals, UnifiedTask, ApprovalModule } from '@/hooks/useTasksAndApprovals';
import { useRouter } from 'next/navigation';

export default function TasksPage() {
  const router = useRouter();
  const { tasks, isLoading, approveTask, rejectTask, refetch } = useTasksAndApprovals();

  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [taskToReject, setTaskToReject] = useState<UnifiedTask | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

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

  // Filter tasks
  const filteredTasks = tasks.filter((task: any) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModule = moduleFilter === 'all' || task.type === moduleFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesModule && matchesPriority;
  });

  const highPriorityTasks = filteredTasks.filter((t: any) => t.priority === 'high');
  const mediumPriorityTasks = filteredTasks.filter((t: any) => t.priority === 'medium');
  const lowPriorityTasks = filteredTasks.filter((t: any) => t.priority === 'low');

  // Check for overdue tasks
  const overdueTasks = filteredTasks.filter((t: any) => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  });

  const getModuleBadge = (type: ApprovalModule) => {
    const moduleConfig: Record<ApprovalModule, { label: string; color: string }> = {
      purchase_request: { label: 'Procurement', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      leave_request: { label: 'HR - Leave', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      timesheet: { label: 'HR - Timesheet', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
      payment_request: { label: 'Finance', color: 'bg-green-100 text-green-800 border-green-200' },
      expense_authorization: { label: 'Expense', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      travel_request: { label: 'Travel', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      vehicle_request: { label: 'Fleet', color: 'bg-orange-100 text-orange-800 border-orange-200' },
      item_requisition: { label: 'Inventory', color: 'bg-pink-100 text-pink-800 border-pink-200' },
      contract_request: { label: 'C&G', color: 'bg-teal-100 text-teal-800 border-teal-200' },
      fund_request: { label: 'Programs', color: 'bg-violet-100 text-violet-800 border-violet-200' },
      asset_request: { label: 'Assets', color: 'bg-rose-100 text-rose-800 border-rose-200' },
      facility_maintenance: { label: 'Facility', color: 'bg-amber-100 text-amber-800 border-amber-200' },
      vehicle_maintenance: { label: 'Maintenance', color: 'bg-lime-100 text-lime-800 border-lime-200' },
      custom_task: { label: 'Task', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    };

    const config = moduleConfig[type];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const TaskCard = ({ task }: { task: UnifiedTask }) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

    return (
      <Card className="mb-3 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getModuleBadge(task.type)}
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority.toUpperCase()}
                </Badge>
                {isOverdue && (
                  <Badge className="bg-red-500 text-white">OVERDUE</Badge>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3 flex-wrap">
            {task.requestor && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{task.requestor}</span>
              </div>
            )}

            {task.amount != null && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>${task.amount?.toLocaleString()}</span>
              </div>
            )}

            {task.dueDate && (
              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : ''}`}>
                <Calendar className="h-4 w-4" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}

            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleApprove(task)}
              disabled={isApproving === task.id}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isApproving === task.id ? (
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-1" />
              )}
              Approve
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRejectClick(task)}
              disabled={isApproving === task.id || isRejecting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleViewDetails(task)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

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
                <p className="text-2xl font-bold text-gray-900">{filteredTasks.length}</p>
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
                  {filteredTasks.filter((t: any) => {
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

      {/* Search and Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Modules" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            <SelectItem value="purchase_request">Procurement</SelectItem>
            <SelectItem value="leave_request">HR - Leave</SelectItem>
            <SelectItem value="timesheet">HR - Timesheet</SelectItem>
            <SelectItem value="payment_request">Finance</SelectItem>
            <SelectItem value="expense_authorization">Expense</SelectItem>
            <SelectItem value="vehicle_request">Fleet</SelectItem>
            <SelectItem value="contract_request">C&G</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">All ({filteredTasks.length})</TabsTrigger>
          <TabsTrigger value="high">High Priority ({highPriorityTasks.length})</TabsTrigger>
          <TabsTrigger value="medium">Medium ({mediumPriorityTasks.length})</TabsTrigger>
          <TabsTrigger value="low">Low ({lowPriorityTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-3 animate-spin" />
                <p className="text-gray-600">Loading tasks and approvals...</p>
              </CardContent>
            </Card>
          ) : filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-900 font-semibold mb-1">All caught up!</p>
                <p className="text-gray-600">No pending approvals or tasks</p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task: any) => <TaskCard key={task.id} task={task} />)
          )}
        </TabsContent>

        <TabsContent value="high">
          {highPriorityTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No high priority tasks</p>
              </CardContent>
            </Card>
          ) : (
            highPriorityTasks.map((task: any) => <TaskCard key={task.id} task={task} />)
          )}
        </TabsContent>

        <TabsContent value="medium">
          {mediumPriorityTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No medium priority tasks</p>
              </CardContent>
            </Card>
          ) : (
            mediumPriorityTasks.map((task: any) => <TaskCard key={task.id} task={task} />)
          )}
        </TabsContent>

        <TabsContent value="low">
          {lowPriorityTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No low priority tasks</p>
              </CardContent>
            </Card>
          ) : (
            lowPriorityTasks.map((task: any) => <TaskCard key={task.id} task={task} />)
          )}
        </TabsContent>
      </Tabs>

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
