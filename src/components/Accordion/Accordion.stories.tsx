import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Accordion, type AccordionItem } from './Accordion';
import { Text } from '@primitives/Text/Text';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const items: AccordionItem[] = [
  {
    id: 'summary',
    header: 'Summary',
    content: <Text variant="bodySmall">A brief overview of the project, its goals, and the outcome.</Text>,
  },
  {
    id: 'role',
    header: 'Role',
    content: <Text variant="bodySmall">Led design and front-end implementation, working with one engineer.</Text>,
  },
  {
    id: 'timeline',
    header: 'Timeline',
    content: <Text variant="bodySmall">Six weeks, from initial research through shipped v1.</Text>,
  },
  {
    id: 'tools',
    header: 'Tools',
    content: <Text variant="bodySmall">Figma, React, Tailwind CSS.</Text>,
  },
];

/**
 * Uncontrolled: manages its own open state, starting with the first item
 * (`defaultOpenId` omitted). Exactly one item is open at a time — clicking
 * another header closes the current one and opens the clicked one.
 */
export const Default: Story = {
  args: {
    items,
    onOpenChange: fn(),
  },
  play: async ({ args, canvas }) => {
    const summaryHeader = canvas.getByRole('button', { name: 'Summary' });
    const roleHeader = canvas.getByRole('button', { name: 'Role' });
    await expect(summaryHeader).toHaveAttribute('aria-expanded', 'true');
    await expect(roleHeader).toHaveAttribute('aria-expanded', 'false');

    await roleHeader.click();

    await expect(args.onOpenChange).toHaveBeenCalledWith('role');
    await expect(summaryHeader).toHaveAttribute('aria-expanded', 'false');
    await expect(roleHeader).toHaveAttribute('aria-expanded', 'true');

    // Clicking the already-open header keeps it open — can't collapse to none.
    await roleHeader.click();
    await expect(roleHeader).toHaveAttribute('aria-expanded', 'true');
  },
};

/**
 * `defaultOpenId` picks which item starts open, instead of the first.
 */
export const DefaultOpenId: Story = {
  name: 'Default Open Id',
  args: {
    items,
    defaultOpenId: 'timeline',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Timeline' })).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('button', { name: 'Summary' })).toHaveAttribute('aria-expanded', 'false');
  },
};

const itemsWithIcons: AccordionItem[] = [
  {
    id: 'summary',
    header: 'Summary',
    content: <Text variant="bodySmall">A brief overview of the project, its goals, and the outcome.</Text>,
    headerButtonProps: { icon: 'file' },
  },
  {
    id: 'role',
    header: 'Role',
    content: <Text variant="bodySmall">Led design and front-end implementation, working with one engineer.</Text>,
    headerButtonProps: { icon: 'user', palette: 'secondary' },
  },
  {
    id: 'timeline',
    header: 'Timeline',
    content: <Text variant="bodySmall">Six weeks, from initial research through shipped v1.</Text>,
    headerButtonProps: { icon: 'star', palette: 'input' },
  },
];

/**
 * Each item's `headerButtonProps` is forwarded to the underlying `Button`
 * for that header — here composing a per-item `icon` and `palette` (the
 * accent fill shown on the open header). `Accordion` still owns `id`,
 * `aria-expanded`, `aria-controls`, `onClick`, and `active`; those can't be
 * overridden per item since they carry the toggle behavior.
 */
export const WithHeaderButtonProps: Story = {
  name: 'With Header Button Props',
  args: {
    items: itemsWithIcons,
  },
};

/**
 * Controlled via `openId`/`onOpenChange` — the parent owns which item is
 * open, e.g. to sync it with other UI.
 */
export const Controlled: Story = {
  args: { items },
  render: () => {
    function ControlledExample() {
      const [openId, setOpenId] = useState('tools');
      return <Accordion items={items} openId={openId} onOpenChange={setOpenId} />;
    }
    return <ControlledExample />;
  },
  play: async ({ canvas }) => {
    const toolsHeader = canvas.getByRole('button', { name: 'Tools' });
    const summaryHeader = canvas.getByRole('button', { name: 'Summary' });
    await expect(toolsHeader).toHaveAttribute('aria-expanded', 'true');

    await summaryHeader.click();

    await expect(summaryHeader).toHaveAttribute('aria-expanded', 'true');
    await expect(toolsHeader).toHaveAttribute('aria-expanded', 'false');
  },
};
