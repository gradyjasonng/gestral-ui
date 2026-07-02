import type { Meta, StoryObj } from '@storybook/react-vite';
import { Prose } from './Prose';

const meta = {
  title: 'Components/Prose',
  component: Prose,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-canvas-surface p-12 max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleContent = (
  <>
    <h1>On Obsolescence</h1>
    <p>
      I am a designer-developer hybrid, and I've always seen my ability to
      code-switch between design and development as a strength. Lately though,
      I feel as if my territory has been slowly chipped away at both ends.
    </p>
    <h2>A Shifting Landscape</h2>
    <p>
      My LinkedIn feed is half full of UX designers trying to justify their
      continued existence. They post comparison images of raw outputs next to
      their iterated versions, and cling to the notion that <strong>taste</strong>{' '}
      is what sets them apart. And perhaps they're right — <em>perhaps</em>.
    </p>
    <blockquote>
      <p>
        Taste is not a product. It is the residue of ten thousand decisions made
        in the dark, with no one watching.
      </p>
    </blockquote>
    <h3>What Gets Lost</h3>
    <p>
      Here is a short list of things that cannot be automated away:
    </p>
    <ul>
      <li>The instinct to ask a second question when the first answer feels too neat</li>
      <li>Knowing when to stop iterating</li>
      <li>The ability to read a room and adjust accordingly</li>
    </ul>
    <p>
      For ordered context, consider the sequence of decisions in any real project:
    </p>
    <ol>
      <li>Understand what you're actually being asked to solve</li>
      <li>Question whether it's the right problem</li>
      <li>Build something that proves you were listening</li>
    </ol>
    <hr />
    <h2>Code and Craft</h2>
    <p>
      Inline code looks like this: <code>const taste = cultivated()</code>. A
      more involved example requires a full block:
    </p>
    <pre><code>{`function cultivate(years: number): Taste {
  return Array.from({ length: years })
    .reduce((acc) => refine(acc), raw());
}`}</code></pre>
    <h3>A Note on Tables</h3>
    <table>
      <thead>
        <tr>
          <th>Tool</th>
          <th>Role</th>
          <th>Replaceable?</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Figma</td>
          <td>Visual thinking</td>
          <td>Partially</td>
        </tr>
        <tr>
          <td>Code</td>
          <td>Precise realisation</td>
          <td>Partially</td>
        </tr>
        <tr>
          <td>Judgement</td>
          <td>Deciding what matters</td>
          <td>Not yet</td>
        </tr>
      </tbody>
    </table>
    <figure>
      <div className="w-full h-40 bg-chrome-surface-hover rounded-md flex items-center justify-center">
        <span className="font-ui text-xs text-canvas-text-muted">Figure placeholder</span>
      </div>
      <figcaption>A well-placed image earns more trust than a thousand words.</figcaption>
    </figure>
  </>
);

export const Default: Story = {
  args: { children: sampleContent },
};

export const WithLink: Story = {
  args: {
    children: (
      <p>
        Read more about this at{' '}
        <a href="#">grady.ng</a>, or follow the work on{' '}
        <a href="#">GitHub</a>.
      </p>
    ),
  },
};
