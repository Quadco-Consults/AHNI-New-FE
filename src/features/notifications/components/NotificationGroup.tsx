import { useState } from "react";
import { TNotification } from "@/features/notifications/controllers/notificationController";
import NotificationItem from "./NotificationItem";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Icon } from "@iconify/react";


interface NotificationGroupProps {
  title: string;
  notifications: TNotification[];
  onSetActiveNotification: (notification: TNotification) => void;
  activeNotification?: TNotification;
  groupType: "date" | "module" | "priority" | "category";
  defaultExpanded?: boolean;
}

export default function NotificationGroup({
  title,
  notifications,
  onSetActiveNotification,
  activeNotification,
  groupType,
  defaultExpanded = true
}: NotificationGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const unreadCount = notifications.filter(n => !n.is_read || n.status === "Pending").length;
  const urgentCount = notifications.filter(n => n.priority === "urgent").length;
  
  const getGroupIcon = () => {
    switch (groupType) {
      case "date": return "mdi:calendar";
      case "module": return "mdi:folder";
      case "priority": return "mdi:flag";
      case "category": return "mdi:tag";
      default: return "mdi:folder";
    }
  };

  const getGroupColor = () => {
    if (urgentCount > 0) return "text-red-600 border-red-200";
    if (unreadCount > 0) return "text-blue-600 border-blue-200";
    return "text-gray-600 border-gray-200";
  };

  return (
    <div className={`border rounded-lg ${getGroupColor()} mb-4`}>
      <div 
        className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Icon icon={getGroupIcon()} className="w-5 h-5" />
          <h3 className="font-medium">{title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {notifications.length} total
            </Badge>
            {unreadCount > 0 && (
              <Badge className="text-xs bg-blue-100 text-blue-800">
                {unreadCount} unread
              </Badge>
            )}
            {urgentCount > 0 && (
              <Badge className="text-xs bg-red-100 text-red-800">
                {urgentCount} urgent
              </Badge>
            )}
          </div>
        </div>
        
        <Icon 
          icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"} 
          className="w-5 h-5"
        />
      </div>
      
      {isExpanded && (
        <div className="border-t px-2 pb-2">
          <ul className="space-y-2 mt-2">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onSetActiveNotification={onSetActiveNotification}
                active={activeNotification?.id === notification.id}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}