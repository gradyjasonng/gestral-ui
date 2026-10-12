import { useState, type ReactNode } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Connector } from './Connector';

const meta = {
  title: 'Shell/Connector',
  component: Connector,
  tags: ['autodocs'],
  args: {
    from: { x: 24, y: 28, side: 'right' },
    to: { x: 232, y: 188, side: 'left' },
    variant: 'neutral',
    shape: 'curved',
  },
} satisfies Meta<typeof Connector>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A `position: relative`, sized box for a connector to fill and be measured against. */
const Frame = ({ label, children }: { label?: string; children: ReactNode }) => (
  <div>
    {label && <p className="mb-1 font-mono text-caption text-chrome-text-secondary">{label}</p>}
    <div className="relative h-56 w-64 rounded-md border border-chrome-border bg-canvas-surface">
      {children}
    </div>
  </div>
);

const inFrame: Decorator = (Story) => (
  <Frame>
    <Story />
  </Frame>
);

const from = { x: 24, y: 28, side: 'right' } as const;
const to = { x: 232, y: 188, side: 'left' } as const;

/** The default: one gentle cubic Bézier, `neutral` variant (chrome hairline, arrowhead at the end). */
export const Default: Story = { decorators: [inFrame] };

/** The three FigJam routing types over identical endpoints. */
export const Shapes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(['curved', 'elbow', 'straight'] as const).map((shape) => (
        <Frame key={shape} label={shape}>
          <Connector from={from} to={to} shape={shape} />
        </Frame>
      ))}
    </div>
  ),
};

/** The closed style set — colour, weight, dash and default caps are all bundled into `variant`. */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(['flow', 'prototype', 'reference', 'neutral'] as const).map((variant) => (
        <Frame key={variant} label={variant}>
          <Connector from={from} to={to} variant={variant} />
        </Frame>
      ))}
    </div>
  ),
};

/** `startCap` / `endCap` are independently overridable — a matrix of the four cap kinds. */
export const Caps: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(
        [
          ['none', 'arrow'],
          ['none', 'triangle'],
          ['dot', 'triangle'],
          ['ring', 'arrow'],
          ['ring', 'triangle'],
          ['dot', 'dot'],
          ['arrow', 'arrow'],
        ] as const
      ).map(([startCap, endCap]) => (
        <Frame key={`${startCap}-${endCap}`} label={`${startCap} → ${endCap}`}>
          <Connector from={from} to={to} shape="straight" startCap={startCap} endCap={endCap} />
        </Frame>
      ))}
    </div>
  ),
};

/** `curvature` (0–1) scales the Bézier control-handle length. */
export const Curvature: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {[0.2, 0.5, 0.9].map((curvature) => (
        <Frame key={curvature} label={String(curvature)}>
          <Connector from={from} to={to} shape="curved" curvature={curvature} variant="flow" />
        </Frame>
      ))}
    </div>
  ),
};

/** `cornerRadius` rounds the elbow joints; `0` keeps them sharp. */
export const ElbowCorners: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {[0, 8, 24].map((cornerRadius) => (
        <Frame key={cornerRadius} label={`r=${cornerRadius}`}>
          <Connector
            from={{ x: 24, y: 28, side: 'bottom' }}
            to={{ x: 232, y: 188, side: 'top' }}
            shape="elbow"
            cornerRadius={cornerRadius}
            variant="reference"
          />
        </Frame>
      ))}
    </div>
  ),
};

/**
 * When `from.side` and `to.side` are on different axes, `elbow` routes as a
 * single rounded 90° L instead of a Z — "leave this edge, one turn, head off
 * that way".
 */
export const ElbowLShape: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(
        [
          ['top', 'right'],
          ['top', 'left'],
          ['left', 'bottom'],
          ['right', 'top'],
        ] as const
      ).map(([a, b]) => (
        <Frame key={`${a}-${b}`} label={`${a} → ${b}`}>
          <Connector
            from={{ x: 160, y: 176, side: a }}
            to={{ x: 24, y: 32, side: b }}
            shape="elbow"
            cornerRadius={12}
            variant="reference"
            startCap="ring"
          />
        </Frame>
      ))}
    </div>
  ),
};

function AlignDemo() {
  return (
    <div
      className="relative rounded-md border border-chrome-border bg-canvas-surface"
      style={{ width: 320, height: 176 }}
    >
      <div
        id="connector-align-target"
        className="absolute bottom-4 left-1/2 h-12 w-44 -translate-x-1/2 rounded bg-chrome-muted"
      />
      {[0, 0.3, 0.7, 1].map((f, i) => (
        <Connector
          key={f}
          from={{ x: 16 + i * 24, y: 12, side: 'bottom' }}
          to={{ id: 'connector-align-target', side: 'top', align: f }}
          shape="curved"
          variant="reference"
          startCap="ring"
        />
      ))}
    </div>
  );
}

/**
 * `align` on an anchored endpoint accepts a `0`–`1` fraction along the edge,
 * not just `start` / `center` / `end`. Here four connectors land at 0, 0.3,
 * 0.7 and 1 along the target's top edge.
 */
export const NumericAlign: Story = {
  render: () => <AlignDemo />,
};

function PerAxisDemo() {
  return (
    <div
      className="relative rounded-md border border-chrome-border bg-canvas-surface"
      style={{ width: 340, height: 200 }}
    >
      <div id="connector-rail" className="absolute inset-y-0 right-0 w-16 bg-chrome-muted" />
      {/* x anchors to the rail's left edge; y is copied from `from` and pushed
          down one `sp-xl`, so the line drops a fixed gap then runs across. */}
      <Connector
        from={{ x: 20, y: 24, side: 'bottom' }}
        to={{
          x: { id: 'connector-rail', edge: 'start' },
          y: { match: 'from', offset: 'var(--spacing-sp-xl)' },
          side: 'left',
        }}
        shape="elbow"
        cornerRadius={12}
        variant="reference"
        startCap="ring"
      />
    </div>
  );
}

/**
 * Each of an endpoint's `x` / `y` is independent: a length (`20`, `'50%'`,
 * `'calc(100% - 1rem)'`), an element-anchored value
 * (`{ id, edge, offset }` — `edge` = `start`/`end`/`center` or a fraction),
 * or `{ match: 'from' | 'to', offset }` to copy the other endpoint's same
 * axis. Here `to.x` sticks to a rail's left edge while `to.y` stays one
 * `sp-xl` below wherever `from` starts.
 */
export const PerAxisEndpoints: Story = {
  render: () => <PerAxisDemo />,
};

/**
 * `label` rides the line as a pill filled with the `variant`'s colour,
 * centred on the path; `labelAt` (a `0`–`1` fraction or `'40%'` string)
 * moves it along the length.
 */
export const OnLineLabel: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(['25%', '50%', '75%'] as const).map((labelAt) => (
        <Frame key={labelAt} label={`labelAt ${labelAt}`}>
          <Connector
            from={from}
            to={to}
            shape="curved"
            variant="reference"
            label="in progress"
            labelAt={labelAt}
          />
        </Frame>
      ))}
    </div>
  ),
};

/** The compass `side` on each endpoint sets the tangent (curved) / first routing leg (elbow). */
export const Sides: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(
        [
          ['top', 'bottom'],
          ['right', 'left'],
          ['bottom', 'bottom'],
          ['left', 'left'],
        ] as const
      ).map(([a, b]) => (
        <Frame key={`${a}-${b}`} label={`${a} → ${b}`}>
          <Connector
            from={{ x: 120, y: 20, side: a }}
            to={{ x: 120, y: 200, side: b }}
            shape="curved"
            variant="prototype"
          />
        </Frame>
      ))}
    </div>
  ),
};

/**
 * Every connector generates its own `<marker>` ids (`useId`), so overlapping
 * connectors never share arrowheads. The play test asserts the two `<path>`s
 * point at different `marker-end` ids.
 */
export const MultipleConnectors: Story = {
  render: () => (
    <Frame>
      <Connector from={{ x: 24, y: 24 }} to={{ x: 236, y: 120 }} variant="flow" />
      <Connector from={{ x: 24, y: 200 }} to={{ x: 236, y: 96 }} variant="prototype" />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const svgs = canvasElement.querySelectorAll('svg[data-connector]');
    await expect(svgs.length).toBe(2);
    // The visible line is the path carrying a marker (the other `> path` is
    // the transparent hover hit-target).
    const m0 = svgs[0].querySelector('path[marker-end]')?.getAttribute('marker-end');
    const m1 = svgs[1].querySelector('path[marker-end]')?.getAttribute('marker-end');
    await expect(m0).toBeTruthy();
    await expect(m0).not.toEqual(m1);
  },
};

function Resizable() {
  const [wide, setWide] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setWide((w) => !w)}
        className="mb-2 rounded border border-chrome-border px-2 py-1 font-mono text-caption"
      >
        toggle width
      </button>
      <div
        className="relative rounded-md border border-chrome-border bg-canvas-surface"
        style={{ width: wide ? 460 : 280, height: 200 }}
      >
        <div id="connector-src" className="absolute left-3 top-3 h-10 w-24 rounded bg-chrome-muted" />
        <div
          id="connector-dst"
          className="absolute bottom-3 right-3 h-10 w-24 rounded bg-chrome-muted"
        />
        <Connector
          from={{ id: 'connector-src', side: 'right' }}
          to={{ id: 'connector-dst', side: 'left' }}
          variant="prototype"
        />
      </div>
    </div>
  );
}

/**
 * Anchored endpoints reference elements by `id`. The connector measures their
 * rects against its positioned ancestor and re-measures on `ResizeObserver`,
 * `window` resize and capture-phase scroll. The play test toggles the
 * container width and asserts the path `d` recomputes. (A `resize` event is
 * dispatched alongside the click because `ResizeObserver` notifications are
 * suspended in a non-visible tab — the connector listens for both.)
 */
export const AnchoredToElements: Story = {
  render: () => <Resizable />,
  play: async ({ canvasElement }) => {
    const pathOf = () => canvasElement.querySelector('svg[data-connector] > path');
    await waitFor(() => expect(pathOf()).toBeTruthy());
    const before = pathOf()!.getAttribute('d');
    await userEvent.click(canvasElement.querySelector('button')!);
    window.dispatchEvent(new Event('resize'));
    await waitFor(() => expect(pathOf()!.getAttribute('d')).not.toEqual(before));
  },
};

/** Percentage coordinates resolve against the positioned ancestor's box. */
export const PercentEndpoints: Story = {
  decorators: [
    (Story) => (
      <div className="relative h-40 w-96 rounded-md border border-chrome-border bg-canvas-surface">
        <Story />
      </div>
    ),
  ],
  args: {
    from: { x: '10%', y: '20%', side: 'right' },
    to: { x: '90%', y: '80%', side: 'left' },
    variant: 'flow',
  },
};

/**
 * With `aria-label` the `<svg>` is exposed as `role="img"` with that name; the
 * play test looks it up by role + name.
 */
export const WithAccessibleName: Story = {
  decorators: [inFrame],
  args: {
    variant: 'prototype',
    'aria-label': 'Login screen links to the Dashboard',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('img', { name: 'Login screen links to the Dashboard' }),
    ).toBeInTheDocument();
  },
};

/**
 * The line thickens (~1px, like an `Artboard`'s outline) while its generous
 * transparent hit-path is hovered, and while a labelled connector has
 * keyboard focus. Hover is plain CSS `:hover`, which a synthetic
 * `userEvent.hover` never triggers (it only dispatches events), so the play
 * test drives the focus half instead — focus the labelled `<svg>`, assert
 * the visible stroke width grew, then blur and assert it shrank back. Hover
 * the line in the Canvas tab to see the other half.
 */
export const FocusThickens: Story = {
  decorators: [inFrame],
  args: { variant: 'flow', shape: 'straight', 'aria-label': 'Step one leads to step two' },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector<SVGSVGElement>('svg[data-connector]')!;
    const line = svg.querySelectorAll<SVGPathElement>(':scope > path')[1];
    const rest = getComputedStyle(line).strokeWidth;
    svg.focus();
    await expect(svg).toHaveFocus();
    await waitFor(() => expect(getComputedStyle(line).strokeWidth).not.toEqual(rest));
    svg.blur();
    await waitFor(() => expect(getComputedStyle(line).strokeWidth).toEqual(rest));
  },
};

/** Without a name the connector is decorative: `aria-hidden` and `pointer-events: none`. */
export const Decorative: Story = {
  decorators: [inFrame],
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg[data-connector]')!;
    await expect(svg).toHaveAttribute('aria-hidden', 'true');
    await expect(getComputedStyle(svg).pointerEvents).toBe('none');
    await expect(svg.querySelector(':scope > path')!.getAttribute('d')).toMatch(/^M /);
  },
};
