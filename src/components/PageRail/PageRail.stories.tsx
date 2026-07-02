import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageRail } from './PageRail';
import { Text } from '../../primitives/Text/Text';

const meta = {
  title: 'Components/Sidebar/PageRail',
  component: PageRail,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-canvas-surface" style={{ transform: 'translateZ(0)' }}>
        <Story />
        <div className="ml-[220px] p-12">
          <Text variant="bodySmall" className="text-canvas-text-secondary">Canvas content area</Text>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof PageRail>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Leaf page — all three sections, current page selected in Pages list */
export const LeafPage: Story = {
  args: {
    siteName: 'Grady Ng',
    section: 'Blog',
    href: '/blog',
    pages: [
      { label: 'Squaring a Circle Line',   href: '/blog/squaring-a-circle-line', active: 'secondary' as const },
      { label: 'On Design Systems',         href: '/blog/on-design-systems' },
      { label: 'The Space Between',         href: '/blog/the-space-between' },
      { label: 'Notes on Figma Grids',      href: '/blog/figma-grids' },
    ],
    toc: [
      { label: 'Introduction',              href: '#intro',      depth: 2, active: true },
      { label: 'The Problem',               href: '#problem',    depth: 2 },
      { label: 'Early attempts',            href: '#attempts',   depth: 3 },
      { label: 'A cleaner approach',        href: '#approach',   depth: 3 },
      { label: 'Conclusion',                href: '#conclusion', depth: 2 },
    ],
    meta: [
      { key: 'Published',    value: 'June 2026' },
      { key: 'Reading time', value: '8 min' },
      { key: 'Tags',         value: ['design', 'systems', 'css'] },
    ],
  },
};

/** Work portfolio leaf */
export const WorkLeaf: Story = {
  args: {
    siteName: 'Grady Ng',
    section: 'Work',
    href: '/work',
    pages: [
      { label: 'Gestral Design System',    href: '/work/gestral',   active: true },
      { label: 'gradaigh.com Redesign',    href: '/work/gradaigh' },
      { label: 'Type Specimen Generator',  href: '/work/type-specimen' },
    ],
    toc: [
      { label: 'Overview',                 href: '#overview',   depth: 2, active: true },
      { label: 'Token architecture',       href: '#tokens',     depth: 2 },
      { label: 'Component library',        href: '#components', depth: 2 },
      { label: 'Figma integration',        href: '#figma',      depth: 3 },
    ],
    meta: [
      { key: 'Year',         value: '2025–2026' },
      { key: 'Category',     value: 'Work' },
      { key: 'Tags',         value: ['design-systems', 'react', 'tailwind'] },
    ],
  },
};
