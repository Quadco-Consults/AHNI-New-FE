import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  item?: any; // Will be properly typed based on ProcurementTrackerResults
  status?: string; // Simple status string for direct rendering
}

const StatusBadge = ({ item, status }: StatusBadgeProps) => {
  // If a simple status string is provided, render it directly
  if (status && !item) {
    const getStatusDisplay = (statusValue: string) => {
      const statusLower = statusValue?.toLowerCase() || 'pending';

      switch (statusLower) {
        case 'completed':
          return { text: 'COMPLETED', colorClass: 'bg-green-100 text-green-800' };
        case 'in_progress':
        case 'in progress':
          return { text: 'IN PROGRESS', colorClass: 'bg-blue-100 text-blue-800' };
        case 'pending':
          return { text: 'PENDING', colorClass: 'bg-yellow-100 text-yellow-800' };
        case 'cancelled':
        case 'rejected':
        case 'cancelled/suspended':
          return { text: 'CANCELLED/SUSPENDED', colorClass: 'bg-red-100 text-red-800' };
        case 'approved':
          return { text: 'APPROVED', colorClass: 'bg-green-100 text-green-800' };
        default:
          return { text: statusValue?.toUpperCase() || 'PENDING', colorClass: 'bg-gray-100 text-gray-800' };
      }
    };

    const { text, colorClass } = getStatusDisplay(status);
    return (
      <Badge className={cn('px-2 py-1 rounded-full text-xs font-medium', colorClass)}>
        {text}
      </Badge>
    );
  }

  // Guard against undefined item
  if (!item) {
    return (
      <Badge className={cn('px-2 py-1 rounded-full text-xs font-medium', 'bg-gray-100 text-gray-800')}>
        N/A
      </Badge>
    );
  }

  // Determine overall status based on procurement stage
  let statusValue = 'pending';
  let text = 'Pending';
  let colorClass = 'bg-yellow-100 text-yellow-800';

  if (item.purchase_order) {
    if (item.is_service) {
      const serviceStatus = item.purchase_order.service_status?.toLowerCase() || 'pending';
      statusValue = serviceStatus;
      text = item.purchase_order.service_status || 'Pending';

      switch (serviceStatus) {
        case 'completed':
          colorClass = 'bg-green-100 text-green-800';
          break;
        case 'in_progress':
          colorClass = 'bg-blue-100 text-blue-800';
          break;
        case 'rejected':
          colorClass = 'bg-red-100 text-red-800';
          break;
        default:
          colorClass = 'bg-yellow-100 text-yellow-800';
      }
    } else {
      if (item.purchase_order.grn_details) {
        statusValue = 'completed';
        text = 'Received';
        colorClass = 'bg-green-100 text-green-800';
      } else {
        statusValue = 'in_progress';
        text = 'Ordered';
        colorClass = 'bg-blue-100 text-blue-800';
      }
    }
  } else if (item.solicitation) {
    statusValue = 'in_progress';
    text = 'RFQ Stage';
    colorClass = 'bg-blue-100 text-blue-800';
  }

  return (
    <Badge className={cn('px-2 py-1 rounded-full text-xs font-medium', colorClass)}>
      {text}
    </Badge>
  );
};

export const TypeBadge = ({ itemType }: { itemType: string }) => {
  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'service':
        return 'bg-orange-100 text-orange-800';
      case 'goods':
        return 'bg-blue-100 text-blue-800';
      case 'work':
        return 'bg-purple-100 text-purple-800';
      case 'others':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={cn('px-2 py-1 rounded text-xs font-medium', getTypeColor(itemType))}>
      {itemType || 'Unknown'}
    </Badge>
  );
};

export default StatusBadge;