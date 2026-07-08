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

/**
 * Baseline Text using the default `variant="body"`, rendered as a `<p>`.
 * Every variant maps to both a typographic style and a default semantic
 * element (see `defaultElement` in `Text.tsx`) — override the element via
 * `as` only when the default tag would be semantically wrong for context
 * (e.g. an `h3`-styled variant that shouldn't be an actual `<h3>`).
 */
export const Default: Story = {};

/**
 * Every `TextVariant` rendered together with its font family and intended
 * use noted alongside — the reference to consult before picking a variant.
 * Variants split into three families: `display` (uppercase, for hero/heading
 * text and short labels like site names or badges), `ui` (body/chrome text
 * at various weights and sizes), and `editorial` (`prose`, serif longform
 * body — used by the Prose component for article content).
 */
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
        ['displayMd',   'Display Md',    'Display font a step up from displaySm — larger labels, small headings'],
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

/**
 * Just the `display` family (`hero`, `h1`–`h3`, `displayMd`, `displaySm`) in
 * isolation, to compare the heading scale without the noise of the
 * UI/editorial variants. Use `hero` for a page's single top-level heading,
 * `h1`–`h3` for nested section headings, `displayMd` for larger standalone
 * labels, and `displaySm` for label-scale display text like a site name.
 */
export const DisplayScale: Story = {
  name: 'Display Scale',
  render: () => (
    <div className="flex flex-col gap-4">
      {(['hero', 'h1', 'h2', 'h3', 'displayMd', 'displaySm'] as TextVariant[]).map((v) => (
        <Text key={v} variant={v}>Gestral</Text>
      ))}
    </div>
  ),
};

/**
 * Just the `ui` family in isolation — subheadings, overline/eyebrow labels,
 * body copy, and bold labels. This is the set to reach for when building
 * chrome/interface text (nav items, metadata, form labels) rather than
 * page headings or longform article content.
 */
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
