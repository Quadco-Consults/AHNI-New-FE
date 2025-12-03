/**
 * @iconify/react to Lucide React Migration Map
 *
 * This file contains mappings from @iconify icons to their Lucide React equivalents.
 * Used for systematic migration from @iconify/react to Lucide React.
 */

import {
  // Actions & Controls
  Edit, Pencil, Delete, Trash2, X, Check, CheckCircle, CheckCircle2,
  Plus, Minus, Upload, Download, Save, Search, Filter, Eye, EyeOff,

  // Navigation & Arrows
  ArrowLeft, ArrowRight, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  DoubleArrowLeft, DoubleArrowRight,

  // Documents & Files
  File, FileText, FilePdf, FileSpreadsheet, FileImage, FileArchive,
  FolderOpen, Folder, FileDown, FileUp, FileCheck, FilePlus,
  ClipboardList, ClipboardCheck, Clipboard,

  // Users & Groups
  User, Users, UserPlus, UserCheck, UserFocus, Building, Building2,

  // Status & Feedback
  AlertCircle, AlertTriangle, Info, CheckCircle2 as CheckCircleOutline,
  XCircle, Clock, Calendar, CalendarCheck, CalendarClock, Star,

  // Communication
  Mail, Bell, BellOff, Inbox, Send, Phone,

  // Charts & Analytics
  TrendingUp, TrendingDown, BarChart3, LineChart, PieChart, Target,

  // Business & Finance
  DollarSign, CreditCard, Receipt, Briefcase, Package, ShoppingCart,

  // System & Tech
  Settings, Cog, Database, Server, Shield, ShieldCheck, Lock,
  Loader2, RefreshCw, Power, Zap,

  // Interface Elements
  MoreVertical, Grid3x3, List, Table, Layout, Layers,

  // Misc
  Award, Gift, Lightbulb, Flag, Tag, Home, MapPin, Globe
} from 'lucide-react';

/**
 * Map of @iconify icon names to Lucide React components
 */
export const IconifyToLucideMap = {
  // Solar Icons - High Usage
  'solar:pen-bold-duotone': Edit,
  'solar:check-circle-bold': CheckCircle,
  'solar:verified-check-bold': CheckCircle2,
  'solar:document-bold-duotone': FileText,
  'solar:shield-check-bold': ShieldCheck,
  'solar:shield-check-bold-duotone': ShieldCheck,
  'solar:notes-bold-duotone': ClipboardList,
  'solar:download-bold': Download,
  'solar:download-minimalistic-bold': Download,
  'solar:document-text-bold': FileText,
  'solar:document-text-bold-duotone': FileText,
  'solar:document-bold': File,
  'solar:document-add-bold': FilePlus,
  'solar:box-bold-duotone': Package,
  'solar:users-group-two-rounded-bold-duotone': Users,
  'solar:users-group-rounded-bold-duotone': Users,
  'solar:user-id-bold-duotone': UserCheck,
  'solar:user-bold': User,
  'solar:restart-bold': RefreshCw,
  'solar:clipboard-check-bold': ClipboardCheck,
  'solar:chart-square-bold': BarChart3,
  'solar:chart-square-bold-duotone': BarChart3,
  'solar:calendar-bold-duotone': Calendar,
  'solar:lock-password-bold-duotone': Lock,
  'solar:list-bold': List,
  'solar:layers-minimalistic-bold-duotone': Layers,
  'solar:info-circle-bold': Info,
  'solar:eye-bold-duotone': Eye,
  'solar:eye-bold': Eye,
  'solar:danger-triangle-bold-duotone': AlertTriangle,
  'solar:cup-star-bold': Award,
  'solar:checklist-bold-duotone': ClipboardCheck,
  'solar:case-minimalistic-bold-duotone': Briefcase,
  'solar:arrow-left-bold': ArrowLeft,

  // Phosphor Icons - Medium-High Usage
  'ph:upload': Upload,
  'ph:eye-duotone': Eye,
  'ph:download': Download,
  'ph:check-circle': CheckCircle,
  'ph:check-circle-duotone': CheckCircle,
  'ph:target-duotone': Target,
  'ph:spinner': Loader2,
  'ph:pencil-duotone': Pencil,
  'ph:file-arrow-up-duotone': FileUp,
  'ph:file-arrow-down-duotone': FileDown,
  'ph:x': X,
  'ph:users-three-duotone': Users,
  'ph:trend-up': TrendingUp,
  'ph:trend-down': TrendingDown,
  'ph:star-fill': Star,
  'ph:info-duotone': Info,
  'ph:envelope-duotone': Mail,
  'ph:database-duotone': Database,
  'ph:clipboard-text-duotone': ClipboardList,
  'ph:calendar-duotone': Calendar,
  'ph:calendar-check-duotone': CalendarCheck,
  'ph:arrow-left': ArrowLeft,
  'ph:arrow-right': ArrowRight,
  'ph:arrow-left-duotone': ArrowLeft,
  'ph:warning-circle': AlertCircle,
  'ph:warning': AlertTriangle,
  'ph:user-focus-duotone': UserFocus,
  'ph:user-circle-duotone': User,
  'ph:printer-duotone': FileText, // No printer in Lucide, using FileText
  'ph:paper-plane-tilt-duotone': Send,
  'ph:package-duotone': Package,
  'ph:magnifying-glass': Search,
  'ph:list-checks-duotone': ClipboardCheck,
  'ph:lightbulb-duotone': Lightbulb,
  'ph:file-text-duotone': FileText,
  'ph:file-pdf-duotone': FilePdf,
  'ph:dots-three-vertical-bold': MoreVertical,
  'ph:clock-duotone': Clock,
  'ph:clock-countdown-duotone': Clock,
  'ph:clock-countdown': Clock,
  'ph:chart-line-duotone': LineChart,
  'ph:chart-line-down': TrendingDown,
  'ph:chart-line': LineChart,
  'ph:chart-bar': BarChart3,
  'ph:briefcase-duotone': Briefcase,

  // Material Design Icons - Medium Usage
  'mdi:alert-circle': AlertCircle,
  'mdi:check-circle': CheckCircle,
  'mdi:notification-clear-all': Bell,
  'mdi:information-outline': Info,
  'mdi:file-outline': File,
  'mdi:eye-outline': Eye,
  'mdi:eye': Eye,
  'mdi:download': Download,
  'mdi:download-multiple': Download,
  'mdi:clock-outline': Clock,
  'mdi:clock-fast': Clock,
  'mdi:account-switch': Users,
  'mdi:account-plus': UserPlus,
  'mdi:account-group-outline': Users,
  'mdi:trending-up': TrendingUp,
  'mdi:tag-outline': Tag,
  'mdi:pencil': Pencil,
  'mdi:lightbulb-outline': Lightbulb,
  'mdi:inbox-outline': Inbox,
  'mdi:flag-outline': Flag,
  'mdi:filter': Filter,
  'mdi:file-export': FileDown,
  'mdi:file-document-outline': FileText,
  'mdi:file-document-alert-outline': FileText,
  'mdi:email-outline': Mail,
  'mdi:close-circle': XCircle,
  'mdi:clipboard-text-outline': ClipboardList,
  'mdi:chevron-down': ChevronDown,
  'mdi:checkbox-marked-circle-outline': CheckCircle,
  'mdi:check-circle-outline': CheckCircle,
  'mdi:check-all': CheckCircle2,
  'mdi:chart-line': LineChart,
  'mdi:calendar-clock': CalendarClock,
  'mdi:bell-outline': Bell,

  // Heroicons - Lower Usage
  'heroicons:x-circle': XCircle,
  'heroicons:printer': FileText, // No printer in Lucide
  'heroicons:pencil-square': Edit,
  'heroicons:information-circle': Info,
  'heroicons:inbox': Inbox,
  'heroicons:document-arrow-down': FileDown,
  'heroicons:clipboard-document-list': ClipboardList,
  'heroicons:clipboard-document-check': ClipboardCheck,
  'heroicons:check-circle': CheckCircle,
  'heroicons:building-office': Building,

  // Carbon Icons - Lower Usage
  'carbon:analytics': BarChart3,
  'carbon:view': Eye,
  'carbon:recommendation': Lightbulb,
  'carbon:list-checked': ClipboardCheck,
  'carbon:group': Users,
  'carbon:currency-dollar': DollarSign,
  'carbon:chemistry': Zap, // Scientific icon, using Zap

  // HugeIcons - Lower Usage
  'hugeicons:arrow-right-double': DoubleArrowRight,
  'hugeicons:arrow-left-double': DoubleArrowLeft,

  // Ant Design Icons - Lower Usage
  'ant-design:delete-twotone': Trash2,

  // Iconoir - Lower Usage
  'iconoir:slash': X, // Slash concept, using X

  // Iconamoon - Lower Usage
  'iconamoon:search-light': Search,

  // Loading Icons
  'lucide:loader-2': Loader2,
  'eos-icons:loading': Loader2,
  'line-md:loading-loop': Loader2,
} as const;

/**
 * Type for @iconify icon names that can be migrated
 */
export type IconifyIconName = keyof typeof IconifyToLucideMap;

/**
 * Get the Lucide component for an @iconify icon
 */
export function getLucideIcon(iconifyName: string) {
  return IconifyToLucideMap[iconifyName as IconifyIconName];
}

/**
 * Check if an @iconify icon has a Lucide equivalent
 */
export function hasLucideEquivalent(iconifyName: string): iconifyName is IconifyIconName {
  return iconifyName in IconifyToLucideMap;
}

/**
 * Migration helper: Convert @iconify Icon usage to Lucide
 */
export function migrateIconifyToLucide(
  iconifyName: string,
  size?: number | string,
  className?: string
) {
  const LucideComponent = getLucideIcon(iconifyName);

  if (!LucideComponent) {
    console.warn(`No Lucide equivalent found for @iconify icon: ${iconifyName}`);
    return null;
  }

  // Convert size handling (iconify uses fontSize, lucide uses size)
  const lucideSize = typeof size === 'string' ? parseInt(size) : size;

  return {
    component: LucideComponent,
    props: {
      size: lucideSize || 16,
      className: className || ''
    }
  };
}