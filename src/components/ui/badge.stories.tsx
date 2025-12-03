import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible badge component for displaying status, priority, and categorical information. Supports multiple variants for different use cases.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'default', 'secondary', 'destructive', 'outline',
        'success', 'warning', 'error', 'info',
        'approved', 'rejected', 'pending', 'underReview',
        'urgent', 'high', 'medium', 'low', 'system',
        'darkYellow'
      ],
      description: 'Visual style variant of the badge'
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic variants
export const Default: Story = {
  args: {
    children: 'Default',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
}

// Status variants
export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Error',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
}

// Approval status variants
export const Approved: Story = {
  args: {
    variant: 'approved',
    children: 'Approved',
  },
}

export const Rejected: Story = {
  args: {
    variant: 'rejected',
    children: 'Rejected',
  },
}

export const Pending: Story = {
  args: {
    variant: 'pending',
    children: 'Pending',
  },
}

export const UnderReview: Story = {
  args: {
    variant: 'underReview',
    children: 'Under Review',
  },
}

// Priority variants
export const Urgent: Story = {
  args: {
    variant: 'urgent',
    children: 'Urgent',
  },
}

export const High: Story = {
  args: {
    variant: 'high',
    children: 'High Priority',
  },
}

export const Medium: Story = {
  args: {
    variant: 'medium',
    children: 'Medium Priority',
  },
}

export const Low: Story = {
  args: {
    variant: 'low',
    children: 'Low Priority',
  },
}

export const System: Story = {
  args: {
    variant: 'system',
    children: 'System',
  },
}

export const DarkYellow: Story = {
  args: {
    variant: 'darkYellow',
    children: 'Dark Yellow',
  },
}

// Status badges showcase
export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="pending">Pending</Badge>
      <Badge variant="approved">Approved</Badge>
      <Badge variant="rejected">Rejected</Badge>
      <Badge variant="underReview">Under Review</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common status badges used throughout the application.',
      },
    },
  },
}

// Priority badges showcase
export const PriorityBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="urgent">Urgent</Badge>
      <Badge variant="high">High</Badge>
      <Badge variant="medium">Medium</Badge>
      <Badge variant="low">Low</Badge>
      <Badge variant="system">System</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Priority level badges for task and request management.',
      },
    },
  },
}

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="approved">Approved</Badge>
      <Badge variant="rejected">Rejected</Badge>
      <Badge variant="pending">Pending</Badge>
      <Badge variant="underReview">Under Review</Badge>
      <Badge variant="urgent">Urgent</Badge>
      <Badge variant="high">High</Badge>
      <Badge variant="medium">Medium</Badge>
      <Badge variant="low">Low</Badge>
      <Badge variant="system">System</Badge>
      <Badge variant="darkYellow">Dark Yellow</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available badge variants displayed in a grid for easy comparison.',
      },
    },
  },
}