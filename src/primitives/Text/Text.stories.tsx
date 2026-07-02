import type { Meta, StoryObj } from '@storybook/react';
import { Text, type TextVariant } from './Text';

const meta = {
  title: 'Primitives/Text',
  component: Text,
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {([
        ['hero',        'Hero',          'Display — page hero'],
        ['h1',          'H1',            'Display — heading 1'],
        ['h2',          'H2',            'Display — heading 2'],
        ['h3',          'H3',            'Display — heading 3'],
        ['subheading1', 'Subheading 1',  'UI — large subheading'],
        ['subheading2', 'Subheading 2',  'UI — medium subheading'],
        ['subheading3', 'Subheading 3',  'UI — small subheading'],
        ['displaySm',   'Display Sm',    'Display font at label scale — site name, badges'],
        ['overline',    'Overline',      'UI — large section overline'],
        ['eyebrow',     'Eyebrow',       'UI — micro overline, section labels, metadata keys'],
        ['body',        'Body',          'UI — standard reading body'],
        ['bodySmall',   'Body Small',    'UI — small body'],
        ['caption',     'Caption',       'UI — xs body weight, dates, secondary text'],
        ['prose',       'Prose',         'Editorial — longform serif body'],
        ['labelSmall',  'Label Small',   'UI — sm bold label'],
        ['labelXSmall', 'Label XSmall',  'UI — xs bold label'],
      ] as Array<[TextVariant, string, string]>).map(([variant, label, description]) => (
        <div key={variant} className="flex items-baseline gap-4">
          <div className="w-40 shrink-0">
            <span className="font-mono text-xs text-chrome-text-muted block">{label}</span>
            <span className="font-mono text-[10px] text-chrome-text-muted/60 block">{description}</span>
          </div>
          <Text variant={variant}>Gestral UI</Text>
        </div>
      ))}
    </div>
  ),
};

export const DisplayScale: Story = {
  name: 'Display Scale',
  render: () => (
    <div className="flex flex-col gap-4">
      {(['hero', 'h1', 'h2', 'h3', 'displaySm'] as TextVariant[]).map((v) => (
        <Text key={v} variant={v}>Gestral</Text>
      ))}
    </div>
  ),
};

export const UIScale: Story = {
  name: 'UI Scale',
  render: () => (
    <div className="flex flex-col gap-3">
      {(['subheading1', 'subheading2', 'subheading3', 'overline', 'eyebrow', 'body', 'bodySmall', 'caption', 'labelSmall', 'labelXSmall'] as TextVariant[]).map((v) => (
        <Text key={v} variant={v}>The quick brown fox</Text>
      ))}
    </div>
  ),
};
