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
    <h1>Sample Article Title</h1>
    <p>
      This is a sample paragraph demonstrating the base typographic style
      that Prose applies to longform content. It should read comfortably at
      a readable measure, with generous line height for extended reading.
    </p>
    <h2>A Sample Section Heading</h2>
    <p>
      Prose also styles inline emphasis, such as <strong>bold text</strong>{' '}
      for strong importance and <em>italic text</em> for stress emphasis,
      so both remain legible and distinct from the surrounding copy.
    </p>
    <blockquote>
      <p>
        A blockquote is set apart from body copy to signal quoted or
        highlighted material, distinct from the author's own voice.
      </p>
    </blockquote>
    <h3>A Sample Subsection</h3>
    <p>
      Here is a short unordered list of example items:
    </p>
    <ul>
      <li>The first example list item</li>
      <li>A second example list item</li>
      <li>A third example list item</li>
    </ul>
    <p>
      And an ordered list, for sequential steps:
    </p>
    <ol>
      <li>The first step in a sequence</li>
      <li>The second step in a sequence</li>
      <li>The final step in a sequence</li>
    </ol>
    <hr />
    <h2>Code Samples</h2>
    <p>
      Inline code looks like this: <code>const example = getValue()</code>. A
      more involved example requires a full block:
    </p>
    <pre><code>{`function example(count: number): Result {
  return Array.from({ length: count })
    .reduce((acc) => transform(acc), initial());
}`}</code></pre>
    <h3>A Note on Tables</h3>
    <table>
      <thead>
        <tr>
          <th>Column One</th>
          <th>Column Two</th>
          <th>Column Three</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Row one</td>
          <td>Sample value</td>
          <td>Sample value</td>
        </tr>
        <tr>
          <td>Row two</td>
          <td>Sample value</td>
          <td>Sample value</td>
        </tr>
        <tr>
          <td>Row three</td>
          <td>Sample value</td>
          <td>Sample value</td>
        </tr>
      </tbody>
    </table>
    <figure>
      <div className="w-full h-40 bg-chrome-surface-hover rounded-md flex items-center justify-center">
        <span className="font-ui text-xs text-canvas-text-muted">Figure placeholder</span>
      </div>
      <figcaption>A figure caption sits below its image, set smaller and muted.</figcaption>
    </figure>
  </>
);

/**
 * The full range of typographic elements Prose styles — headings (h1–h3),
 * paragraphs, inline emphasis, blockquote, ordered/unordered lists, an hr
 * divider, inline and block code, a table, and a figure with caption. Use
 * this as the reference for how longform editorial content (e.g. a blog
 * post body) should look; every element here should render sensibly without
 * any additional per-element styling from the consumer.
 */
export const Default: Story = {
  args: { children: sampleContent },
};

/**
 * A minimal example showing that anchor tags inside Prose content pick up
 * link styling automatically — useful for checking link color/underline
 * treatment doesn't need to be applied manually when authoring prose body
 * copy with inline links.
 */
export const WithLink: Story = {
  args: {
    children: (
      <p>
        Read more about this at{' '}
        <a href="#">example.com</a>, or follow the project on{' '}
        <a href="#">GitHub</a>.
      </p>
    ),
  },
};
