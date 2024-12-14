import { Meta, StoryObj } from '@storybook/angular';
import { DropdownComponent, DropdownType, DropdownSize } from './dropdown.component';

// Define metadata for the component
const meta: Meta<DropdownComponent<any>> = {
  title: 'Example/Dropdown',
  component: DropdownComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'native'] as DropdownType[],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'] as DropdownSize[],
    },
    hasClearButton: {
      control: 'boolean',
    },
    maxVisibleItems: {
      control: { type: 'number', min: 1, max: 10 },
    },
    placeholder: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<DropdownComponent<any>>;

// Default story
export const Default: Story = {
  args: {
    type: 'default',
    size: 'md',
    placeholder: 'Select an option',
    maxVisibleItems: 5,
    data: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
  },
};

// Story with a clear button
export const WithClearButton: Story = {
  args: {
    type: 'default',
    size: 'md',
    placeholder: 'Select an option',
    hasClearButton: true,
    data: ['Item A', 'Item B', 'Item C'],
  },
};

// Large dropdown
export const Large: Story = {
  args: {
    type: 'default',
    size: 'lg',
    placeholder: 'Large Dropdown',
    data: ['Large 1', 'Large 2', 'Large 3', 'Large 4'],
  },
};

// Small dropdown
export const Small: Story = {
  args: {
    type: 'default',
    size: 'sm',
    placeholder: 'Small Dropdown',
    data: ['Small 1', 'Small 2', 'Small 3'],
  },
};

// Native dropdown type
export const Native: Story = {
  args: {
    type: 'native',
    size: 'md',
    placeholder: 'Native Dropdown',
    data: ['Native Option 1', 'Native Option 2', 'Native Option 3'],
  },
};

// Custom max visible items
export const CustomMaxVisibleItems: Story = {
  args: {
    type: 'default',
    size: 'md',
    maxVisibleItems: 3,
    placeholder: 'Custom Max Visible Items',
    data: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
  },
};

// Using the selection as a button
export const UseSelectionAsButton: Story = {
  args: {
    type: 'default',
    size: 'md',
    placeholder: 'Selection as Button',
    useSelectionAsButton: true,
    data: ['Item 1', 'Item 2', 'Item 3'],
  },
};
