/**
 * Icon Migration Helpers - Temporary Wrappers
 *
 * These components provide backward compatibility during the migration
 * from custom SVG icons to Lucide React icons.
 *
 * MIGRATION STATUS: Phase 1 - In Progress
 * Created: 2026-05-20
 *
 * Purpose:
 * - Maintain same interface as old custom icons (size prop)
 * - Apply same colors as old icons for visual consistency
 * - Allow gradual migration without breaking existing code
 *
 * TODO: Remove this file after all migrations are complete (est. 6 weeks)
 */

import {
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  PlusSquare,
  User,
  Printer,
  ArrowDown,
  ChevronDown,
  Send,
  MoreHorizontal,
  MoreVertical,
  CheckCircle
} from 'lucide-react';

/**
 * Props interface matching old custom icon pattern
 */
type IconProps = {
  size?: string;
  className?: string;
};

/**
 * Extended props for icons that support fill/stroke colors
 */
type IconPropsWithColors = IconProps & {
  fillColor?: string;
  strokeColor?: string;
};

/**
 * EyeIcon Migration
 * Old: Custom SVG with green color (#107D38)
 * New: Lucide Eye with matching green
 */
export const EyeIconMigrated = ({ size = '16', className = '' }: IconProps) => {
  return (
    <Eye
      size={parseInt(size)}
      className={`text-green-600 ${className}`}
    />
  );
};

/**
 * DeleteIcon Migration
 * Old: Custom SVG with red color (#FF0000)
 * New: Lucide Trash2 with matching red
 */
export const DeleteIconMigrated = ({ size = '16', className = '' }: IconProps) => {
  return (
    <Trash2
      size={parseInt(size)}
      className={`text-red-600 ${className}`}
    />
  );
};

/**
 * PencilIcon Migration
 * Old: Custom SVG with red color (#FF0000)
 * New: Lucide Edit with amber color (more appropriate for edit)
 */
export const PencilIconMigrated = ({ className = '' }: Omit<IconProps, 'size'>) => {
  return (
    <Edit
      className={`h-4 w-4 text-amber-600 ${className}`}
    />
  );
};

/**
 * EditIcon Migration
 * Old: Custom SVG with yellow/gold color (#BE8800)
 * New: Lucide Edit with matching amber color
 */
export const EditIconMigrated = ({ className = '' }: Omit<IconProps, 'size'>) => {
  return (
    <Edit
      className={`h-4 w-4 text-amber-600 ${className}`}
    />
  );
};

/**
 * DownloadIcon Migration
 * Old: Custom SVG
 * New: Lucide Download
 */
export const DownloadIconMigrated = ({ size = '16', className = '' }: IconProps) => {
  return (
    <Download
      size={parseInt(size)}
      className={className || 'text-gray-600'}
    />
  );
};

/**
 * UploadIcon Migration
 * Old: Custom SVG with yellow/gold color (#DEA004)
 * New: Lucide Upload with matching yellow/amber color
 */
export const UploadIconMigrated = ({ size = '24', className = '', fillColor, strokeColor }: IconPropsWithColors) => {
  return (
    <Upload
      size={parseInt(size)}
      className={className || 'text-yellow-600'}
    />
  );
};

/**
 * SearchIcon Migration
 * Old: Custom SVG with dark stroke color (#20293A)
 * New: Lucide Search with matching dark color
 */
export const SearchIconMigrated = ({ size = '24', className = '' }: IconProps) => {
  return (
    <Search
      size={parseInt(size)}
      className={className || 'text-gray-800'}
    />
  );
};

/**
 * FilterIcon Migration
 * Old: Custom SVG with dark fill color (#141B34)
 * New: Lucide Filter with matching dark color
 */
export const FilterIconMigrated = ({ size = '24', className = '' }: IconProps) => {
  return (
    <Filter
      size={parseInt(size)}
      className={className || 'text-gray-800'}
    />
  );
};

/**
 * AddSquareIcon Migration
 * Old: Custom SVG with fillColor prop (default: currentColor)
 * New: Lucide PlusSquare with currentColor support
 */
export const AddSquareIconMigrated = ({ size = '24', className = '', fillColor = 'currentColor' }: IconPropsWithColors) => {
  // Use currentColor by default to match old behavior
  const colorClass = fillColor === 'currentColor' ? '' : className;
  return (
    <PlusSquare
      size={parseInt(size)}
      className={colorClass}
      style={fillColor === 'currentColor' ? undefined : { color: fillColor }}
    />
  );
};

/**
 * UserIcon Migration
 * Old: Custom SVG
 * New: Lucide User
 */
export const UserIconMigrated = ({ size = '16', className = '' }: IconProps) => {
  return (
    <User
      size={parseInt(size)}
      className={className || 'text-gray-600'}
    />
  );
};

/**
 * PrinterIcon Migration
 * Old: Custom SVG
 * New: Lucide Printer
 */
export const PrinterIconMigrated = ({ size = '16', className = '' }: IconProps) => {
  return (
    <Printer
      size={parseInt(size)}
      className={className || 'text-gray-600'}
    />
  );
};

/**
 * ArrowDownIcon Migration
 * Old: Custom SVG
 * New: Lucide ArrowDown
 */
export const ArrowDownIconMigrated = ({ size = '16', className = '' }: IconProps) => {
  return (
    <ArrowDown
      size={parseInt(size)}
      className={className || 'text-gray-600'}
    />
  );
};

/**
 * DownIcon Migration (for dropdowns)
 * Old: Custom SVG
 * New: Lucide ChevronDown
 */
export const DownIconMigrated = ({ size = '16', className = '' }: IconProps) => {
  return (
    <ChevronDown
      size={parseInt(size)}
      className={className || 'text-gray-600'}
    />
  );
};

/**
 * SendIcon Migration
 * Old: Custom SVG
 * New: Lucide Send
 */
export const SendIconMigrated = ({ size = '16', className = '' }: IconProps) => {
  return (
    <Send
      size={parseInt(size)}
      className={className || 'text-gray-600'}
    />
  );
};

/**
 * MoreOptionsHorizontalIcon Migration
 * Old: Custom SVG
 * New: Lucide MoreHorizontal
 */
export const MoreOptionsHorizontalIconMigrated = ({ size = '16', className = '' }: IconProps) => {
  return (
    <MoreHorizontal
      size={parseInt(size)}
      className={className || 'text-gray-600'}
    />
  );
};

/**
 * VerticalDotsIcon Migration
 * Old: Custom SVG
 * New: Lucide MoreVertical
 */
export const VerticalDotsIconMigrated = ({ size = '16', className = '' }: IconProps) => {
  return (
    <MoreVertical
      size={parseInt(size)}
      className={className || 'text-gray-600'}
    />
  );
};

/**
 * ApproveIcon Migration
 * Old: Custom SVG
 * New: Lucide CheckCircle
 */
export const ApproveIconMigrated = ({ size = '16', className = '' }: IconProps) => {
  return (
    <CheckCircle
      size={parseInt(size)}
      className={className || 'text-green-600'}
    />
  );
};

// Export as aliases matching old names for drop-in replacement
export const EyeIcon = EyeIconMigrated;
export const DeleteIcon = DeleteIconMigrated;
export const PencilIcon = PencilIconMigrated;
export const EditIcon = EditIconMigrated;
export const DownloadIcon = DownloadIconMigrated;
export const UploadIcon = UploadIconMigrated;
export const SearchIcon = SearchIconMigrated;
export const FilterIcon = FilterIconMigrated;
export const AddSquareIcon = AddSquareIconMigrated;
export const UserIcon = UserIconMigrated;
export const PrinterIcon = PrinterIconMigrated;
export const ArrowDownIcon = ArrowDownIconMigrated;
export const DownIcon = DownIconMigrated;
export const SendIcon = SendIconMigrated;
export const MoreOptionsHorizontalIcon = MoreOptionsHorizontalIconMigrated;
export const VerticalDotsIcon = VerticalDotsIconMigrated;
export const ApproveIcon = ApproveIconMigrated;

/**
 * Default export for convenience
 */
export default {
  EyeIcon,
  DeleteIcon,
  PencilIcon,
  EditIcon,
  DownloadIcon,
  UploadIcon,
  SearchIcon,
  FilterIcon,
  AddSquareIcon,
  UserIcon,
  PrinterIcon,
  ArrowDownIcon,
  DownIcon,
  SendIcon,
  MoreOptionsHorizontalIcon,
  VerticalDotsIcon,
  ApproveIcon,
};
