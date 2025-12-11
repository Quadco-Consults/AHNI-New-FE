/**
 * Centralized Icon Mapping System
 *
 * This file provides a standardized way to access icons throughout the application.
 * All icons are sourced from lucide-react for consistency.
 */

import {
  // Navigation & Actions
  Plus,
  Edit,
  Save,
  X,
  Download,
  Upload,
  Eye,
  EyeOff,
  Search,
  Filter,
  Settings,
  MoreHorizontal,
  MoreVertical,

  // Files & Documents
  FileText,
  FileSpreadsheet,
  File,
  Folder,
  FolderOpen,

  // Status & Feedback
  Check,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,

  // Arrows & Navigation
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,

  // Business & Finance
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,

  // Communication
  Mail,
  Phone,
  MessageSquare,

  // User & Profile
  User,
  Users,
  UserPlus,

  // System
  Home,
  Dashboard as DashboardIcon,
  Calendar,
  Building,

  type LucideIcon
} from 'lucide-react'

// Icon mapping for migration from other libraries
export const IconMap = {
  // Actions
  add: Plus,
  edit: Edit,
  save: Save,
  close: X,
  download: Download,
  upload: Upload,
  view: Eye,
  hide: EyeOff,
  search: Search,
  filter: Filter,
  settings: Settings,
  menu: MoreHorizontal,

  // Files (replacing react-icons file types)
  'file-text': FileText,
  'file-csv': FileSpreadsheet,
  'file-doc': FileText,
  'file-pdf': FileText,
  'file-generic': File,
  folder: Folder,
  'folder-open': FolderOpen,

  // Status (replacing Font Awesome status icons)
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
  pending: Clock,
  approved: Check,

  // Navigation
  back: ArrowLeft,
  forward: ArrowRight,
  up: ArrowUp,
  down: ArrowDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,

  // Business
  currency: DollarSign,
  growth: TrendingUp,
  decline: TrendingDown,
  chart: BarChart,
  pie: PieChart,

  // Communication
  email: Mail,
  phone: Phone,
  message: MessageSquare,

  // User
  user: User,
  users: Users,
  'add-user': UserPlus,

  // System
  home: Home,
  dashboard: DashboardIcon,
  calendar: Calendar,
  building: Building,
} as const

// Type for all available icon names
export type IconName = keyof typeof IconMap

// Reusable Icon Component with consistent sizing and styling
interface IconProps {
  name: IconName
  size?: number | string
  className?: string
  'aria-label'?: string
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 16,
  className = '',
  'aria-label': ariaLabel
}) => {
  const IconComponent = IconMap[name] as LucideIcon

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in IconMap`)
    return null
  }

  return (
    <IconComponent
      size={size}
      className={className}
      aria-label={ariaLabel || name}
    />
  )
}

// Export individual icons for direct usage (maintains current API)
export {
  Plus,
  Edit,
  Save,
  X,
  Download,
  Upload,
  Eye,
  EyeOff,
  Search,
  Filter,
  Settings,
  MoreHorizontal,
  MoreVertical,
  FileText,
  FileSpreadsheet,
  File,
  Folder,
  FolderOpen,
  Check,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Mail,
  Phone,
  MessageSquare,
  User,
  Users,
  UserPlus,
  Home,
  DashboardIcon,
  Calendar,
  Building,
}

export type { LucideIcon }