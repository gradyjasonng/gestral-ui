import type { Meta, StoryObj } from '@storybook/react-vite';
import { Shell } from './Shell';
import { Canvas } from '../Canvas/Canvas';
import { Stack } from '../../primitives/Stack/Stack';
import { SiteRail } from '../SiteRail/SiteRail';
import { CanvasRail } from '../CanvasRail/CanvasRail';
import { Page } from '../Page/Page';
import { navItems, footerItems } from '../SiteRail/__fixtures__.tsx';
import { Default as CanvasRailDefault } from '../CanvasRail/CanvasRail.stories';
import { Text } from '../../primitives/Text/Text';
import { Artboard } from '../Artboard/Artboard';
import {
  Default as ArtboardDefault,
  Interactive as ArtboardInteractive,
  External as ArtboardExternal,
} from '../Artboard/Artboard.stories';
import { Default as PageDefault } from '../Page/Page.stories';

const meta = {
  title: 'Components/Shell',
  component: Shell,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Shell>;

export default meta;
type Story = StoryObj<typeof meta>;

const VerticalCanvasContent = () => (
  <Canvas className="p-12">
    <Stack direction="col" gap="lg">
      <Artboard {...ArtboardDefault.args!} />
      <Artboard {...ArtboardInteractive.args!} />
      <Artboard {...ArtboardExternal.args!} />
    </Stack>
  </Canvas>
);

const PageContent = () => <Page {...PageDefault.args!} />;

/**
 * Full leaf-page composition: a collapsed SiteRail plus CanvasRail in the
 * `rails` slot, and a vertically-arranged page of Artboards in the `canvas`
 * slot. This is the layout to reach for on an actual content page (e.g. a
 * blog post or case study) — two rails narrow the canvas but give readers
 * both site nav and in-page (Pages/TOC) navigation at once.
 */
export const CanvasLayout: Story = {
  name: 'Canvas Layout',
  render: () => (
    <Shell
      rails={
        <>
          <SiteRail items={navItems} footerItems={footerItems} siteName="Gestral UI" />
          <CanvasRail {...CanvasRailDefault.args!} />
        </>
      }
      canvas={<VerticalCanvasContent />}
    />
  ),
};

/**
 * Top-level index-page composition: an expanded SiteRail alone (no
 * CanvasRail) in the `rails` slot, paired with a Page in the `canvas` slot.
 * Use this layout for Home/Blog/Work index pages where there's no sibling
 * "Pages" list or table of contents to show — just the top-level site nav.
 */
export const PageLayout: Story = {
  name: 'Page Layout',
  render: () => (
    <Shell
      rails={<SiteRail items={navItems} footerItems={footerItems} siteName="Gestral UI" expanded />}
      canvas={<PageContent />}
    />
  ),
};
