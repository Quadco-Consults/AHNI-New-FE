import type { Meta, StoryObj } from '@storybook/react'
import { Icon, IconMap, type IconName } from './IconMap'

const meta: Meta<typeof Icon> = {
  title: 'UI/Icon System',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Centralized icon system using Lucide React icons. Provides consistent icons throughout the application with a unified API.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'select' },
      options: Object.keys(IconMap),
      description: 'Icon name from the centralized icon map'
    },
    size: {
      control: { type: 'number', min: 12, max: 48, step: 4 },
      description: 'Size of the icon in pixels'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling'
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'add',
    size: 24,
  },
}

// Action icons
export const ActionIcons: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4 p-4">
      <div className="flex flex-col items-center gap-2">
        <Icon name="add" size={24} />
        <span className="text-xs">add</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="edit" size={24} />
        <span className="text-xs">edit</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="save" size={24} />
        <span className="text-xs">save</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="close" size={24} />
        <span className="text-xs">close</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="download" size={24} />
        <span className="text-xs">download</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="upload" size={24} />
        <span className="text-xs">upload</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common action icons used for buttons and interactive elements.',
      },
    },
  },
}

// File type icons
export const FileTypeIcons: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4 p-4">
      <div className="flex flex-col items-center gap-2">
        <Icon name="file-text" size={24} />
        <span className="text-xs">file-text</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="file-csv" size={24} />
        <span className="text-xs">file-csv</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="file-doc" size={24} />
        <span className="text-xs">file-doc</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="file-pdf" size={24} />
        <span className="text-xs">file-pdf</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="folder" size={24} />
        <span className="text-xs">folder</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="folder-open" size={24} />
        <span className="text-xs">folder-open</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'File type icons for document and folder representations.',
      },
    },
  },
}

// Status icons
export const StatusIcons: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4 p-4">
      <div className="flex flex-col items-center gap-2">
        <Icon name="success" size={24} className="text-green-600" />
        <span className="text-xs">success</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="warning" size={24} className="text-yellow-600" />
        <span className="text-xs">warning</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="error" size={24} className="text-red-600" />
        <span className="text-xs">error</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="info" size={24} className="text-blue-600" />
        <span className="text-xs">info</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="pending" size={24} className="text-orange-600" />
        <span className="text-xs">pending</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="approved" size={24} className="text-green-600" />
        <span className="text-xs">approved</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Status icons with appropriate colors for different states.',
      },
    },
  },
}

// Navigation icons
export const NavigationIcons: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4 p-4">
      <div className="flex flex-col items-center gap-2">
        <Icon name="back" size={24} />
        <span className="text-xs">back</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="forward" size={24} />
        <span className="text-xs">forward</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="up" size={24} />
        <span className="text-xs">up</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="down" size={24} />
        <span className="text-xs">down</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="home" size={24} />
        <span className="text-xs">home</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="dashboard" size={24} />
        <span className="text-xs">dashboard</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Navigation icons for directing user flow and orientation.',
      },
    },
  },
}

// Different sizes
export const IconSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4">
      <div className="flex flex-col items-center gap-2">
        <Icon name="settings" size={16} />
        <span className="text-xs">16px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="settings" size={20} />
        <span className="text-xs">20px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="settings" size={24} />
        <span className="text-xs">24px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="settings" size={32} />
        <span className="text-xs">32px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="settings" size={48} />
        <span className="text-xs">48px</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different icon sizes available in the system.',
      },
    },
  },
}

// All available icons
export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-8 gap-4 p-4">
      {Object.keys(IconMap).map((iconName) => (
        <div key={iconName} className="flex flex-col items-center gap-2">
          <Icon name={iconName as IconName} size={24} />
          <span className="text-xs text-center">{iconName}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete set of all available icons in the centralized icon system.',
      },
    },
  },
}