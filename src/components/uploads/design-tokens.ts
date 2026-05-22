/**
 * Design Tokens for Standardized Upload Components
 * Used across all upload interfaces for consistent UX
 */

export const UPLOAD_DESIGN = {
  // Progress bar styling
  progressBar: {
    height: '8px',
    containerClass: 'w-full bg-gray-200 rounded-full overflow-hidden',
    colors: {
      background: 'bg-gray-200',
      fill: 'bg-blue-600',
      success: 'bg-green-600',
      error: 'bg-red-600',
      warning: 'bg-amber-600'
    },
    animation: 'transition-all duration-300 ease-in-out'
  },

  // Drop zone styling
  dropZone: {
    height: '200px',
    borderStyle: 'border-2 border-dashed rounded-lg',
    borderColor: {
      default: 'border-gray-300',
      hover: 'border-blue-400',
      active: 'border-blue-500',
      error: 'border-red-500',
      success: 'border-green-500'
    },
    background: {
      default: 'bg-gray-50',
      hover: 'bg-blue-50',
      active: 'bg-blue-100',
      error: 'bg-red-50',
      success: 'bg-green-50'
    },
    text: {
      default: 'text-gray-600',
      hover: 'text-blue-600',
      active: 'text-blue-700',
      error: 'text-red-600',
      success: 'text-green-600'
    }
  },

  // File display
  fileDisplay: {
    container: 'flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg',
    icon: 'h-10 w-10 text-blue-500',
    name: 'text-sm font-medium text-gray-900',
    size: 'text-xs text-gray-500',
    removeButton: 'text-red-500 hover:text-red-700 transition-colors'
  },

  // Error display
  errors: {
    maxVisible: 10,
    container: 'mt-4 p-4 bg-red-50 border border-red-200 rounded-lg',
    title: 'text-sm font-semibold text-red-800 mb-2',
    list: 'space-y-2 max-h-60 overflow-y-auto',
    item: 'text-sm text-red-700 flex items-start space-x-2',
    icon: 'h-4 w-4 text-red-500 mt-0.5 flex-shrink-0',
    badge: 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800'
  },

  // Success display
  success: {
    container: 'mt-4 p-4 bg-green-50 border border-green-200 rounded-lg',
    title: 'text-sm font-semibold text-green-800 mb-2',
    text: 'text-sm text-green-700',
    icon: 'h-5 w-5 text-green-500',
    badge: 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800'
  },

  // Warning display
  warning: {
    container: 'mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg',
    title: 'text-sm font-semibold text-amber-800 mb-2',
    text: 'text-sm text-amber-700',
    icon: 'h-5 w-5 text-amber-500'
  },

  // Progress stages
  stages: [
    {
      name: 'Validating',
      range: [0, 30] as [number, number],
      color: 'text-blue-600',
      icon: '🔍'
    },
    {
      name: 'Uploading',
      range: [30, 60] as [number, number],
      color: 'text-indigo-600',
      icon: '⬆️'
    },
    {
      name: 'Processing',
      range: [60, 90] as [number, number],
      color: 'text-purple-600',
      icon: '⚙️'
    },
    {
      name: 'Complete',
      range: [90, 100] as [number, number],
      color: 'text-green-600',
      icon: '✅'
    }
  ],

  // Buttons
  buttons: {
    primary: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors',
    secondary: 'px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors',
    danger: 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors',
    success: 'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
  },

  // Template download
  template: {
    button: 'inline-flex items-center space-x-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors',
    icon: 'h-4 w-4',
    text: 'text-gray-700 font-medium'
  },

  // Statistics/counts display
  stats: {
    container: 'grid grid-cols-2 md:grid-cols-4 gap-4 mt-4',
    card: 'bg-white p-4 rounded-lg border border-gray-200',
    label: 'text-xs text-gray-600 mb-1',
    value: 'text-2xl font-bold',
    colors: {
      total: 'text-gray-900',
      success: 'text-green-600',
      error: 'text-red-600',
      warning: 'text-amber-600'
    }
  },

  // Loading spinner
  spinner: {
    container: 'animate-spin rounded-full border-b-2',
    small: 'h-4 w-4 border-blue-600',
    medium: 'h-8 w-8 border-blue-600',
    large: 'h-12 w-12 border-blue-600'
  },

  // Validation limits
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
    maxRows: 1000,
    minRows: 1
  }
} as const;

export type UploadStage = typeof UPLOAD_DESIGN.stages[number];
