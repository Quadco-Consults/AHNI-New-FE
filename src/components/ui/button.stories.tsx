import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'
import { Plus, Download, Edit, Settings } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants and sizes. Built on top of Radix UI with consistent styling using Class Variance Authority.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'custom', 'shallow'],
      description: 'Visual style variant of the button'
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Size variant of the button'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled'
    },
    asChild: {
      control: 'boolean',
      description: 'Change the default rendered element for the one passed as a child'
    }
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic variants
export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Cancel',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link',
  },
}

export const Custom: Story = {
  args: {
    variant: 'custom',
    children: 'Custom',
  },
}

export const Shallow: Story = {
  args: {
    variant: 'shallow',
    children: 'Shallow',
  },
}

// Size variants
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
}

export const IconOnly: Story = {
  args: {
    size: 'icon',
    children: <Settings className="h-4 w-4" />,
  },
}

// With icons
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </>
    ),
  },
}

export const DownloadButton: Story = {
  args: {
    variant: 'outline',
    children: (
      <>
        <Download className="mr-2 h-4 w-4" />
        Download
      </>
    ),
  },
}

export const EditButton: Story = {
  args: {
    variant: 'secondary',
    size: 'sm',
    children: (
      <>
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </>
    ),
  },
}

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
}

export const Loading: Story = {
  args: {
    disabled: true,
    children: 'Loading...',
  },
}

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="custom">Custom</Button>
      <Button variant="shallow">Shallow</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button variants displayed together for comparison.',
      },
    },
  },
}

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button sizes displayed together for comparison.',
      },
    },
  },
}