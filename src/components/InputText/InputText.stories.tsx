import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputText } from './InputText';

const meta = {
  title: 'Forms/InputText',
  component: InputText,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-chrome-surface p-8 w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An editable single-line field with a placeholder. */
export const Default: Story = {
  args: { placeholder: 'Search…' },
};

/**
 * `readOnly` — a non-editable display field. The value is still selectable
 * and copyable, and the field takes focus, but there's no caret and typing
 * does nothing. This is the form `MetaList` uses for its values.
 */
export const ReadOnly: Story = {
  args: { readOnly: true, value: '5 Mar 2026' },
};

/** `disabled` — dimmed and non-interactive. */
export const Disabled: Story = {
  args: { disabled: true, value: '5 Mar 2026' },
};
