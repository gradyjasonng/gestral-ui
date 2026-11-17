import {
  BiHome,
  BiSearch,
  BiCog,
  BiUser,
  BiFolder,
  BiFile,
  BiArrowBack,
  BiCheck,
  BiX,
  BiPlus,
  BiChevronLeft,
  BiChevronRight,
  BiStar,
  BiMoon,
  BiMenu,
  BiPencil,
  BiBriefcase,
  BiLogoGithub,
  BiLogoLinkedin,
  BiPalette,
  BiCode,
  BiDotsHorizontalRounded,
  BiShow,
  BiHide,
  BiSolidCog,
  BiLock,
  BiSolidPin
} from 'react-icons/bi';
import { SiNpm, SiKofi, SiInstagram, SiYoutube } from 'react-icons/si';
import {
  LuRotateCw,
  LuRotateCcw,
  LuRefreshCw,
  LuRefreshCcw,
  LuFrame,
  LuType,
} from 'react-icons/lu';
import type { SVGProps } from 'react';
import { cn } from '@lib/cn';

/** Inspect Element's logo (two offset chevrons), copied from the inspect-element-game repo's `inspect-logo.svg`. Filled with `currentColor` so it themes like the react-icons glyphs. */
function InspectElementGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 260 260" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M157.313 67.6863C151.065 61.4379 140.935 61.4379 134.686 67.6863C128.438 73.9347 128.438 84.0649 134.686 90.3132L202.373 158L134.686 225.686C128.438 231.935 128.438 242.065 134.686 248.313C140.935 254.562 151.065 254.562 157.313 248.313L236.313 169.313C242.562 163.065 242.562 152.935 236.313 146.686L157.313 67.6863Z" />
      <path d="M102.686 193.313C108.935 199.562 119.065 199.562 125.313 193.313C131.562 187.065 131.562 176.935 125.313 170.686L57.6267 103L125.313 35.3132C131.562 29.0649 131.562 18.9347 125.313 12.6863C119.065 6.43788 108.935 6.43788 102.686 12.6863L23.6863 91.6863C17.4379 97.9346 17.4379 108.065 23.6863 114.313L102.686 193.313Z" />
    </svg>
  );
}

const icons = {
  'home':       BiHome,
  'search':     BiSearch,
  'cog':        BiCog,
  'user':       BiUser,
  'folder':     BiFolder,
  'file':       BiFile,
  'arrow-back': BiArrowBack,
  'check':      BiCheck,
  'x':          BiX,
  'plus':       BiPlus,
  'chevron-left':  BiChevronLeft,
  'chevron-right': BiChevronRight,
  'star':       BiStar,
  'moon':       BiMoon,
  'menu':       BiMenu,
  'pencil':     BiPencil,
  'briefcase':  BiBriefcase,
  'github':     BiLogoGithub,
  'linkedin':   BiLogoLinkedin,
  'palette':    BiPalette,
  'code':       BiCode,
  'comment':    BiDotsHorizontalRounded,
  'eye':        BiShow,
  'eye-off':    BiHide,
  'wrench':     BiSolidCog,
  'lock':       BiLock,
  'pin':        BiSolidPin,
  'inspect-element': InspectElementGlyph,
  'npm':        SiNpm,
  'ko-fi':      SiKofi,
  'instagram':  SiInstagram,
  'youtube':    SiYoutube,
  'frame':      LuFrame,
  'text':       LuType,
  'rotate-cw':    LuRotateCw,
  'rotate-ccw':   LuRotateCcw,
  'refresh-cw':   LuRefreshCw,
  'refresh-ccw':  LuRefreshCcw,
} as const;

export type IconName = keyof typeof icons;
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps {
  name: IconName;
  size?: IconSize;
  /** Accessible label. When omitted the icon is hidden from assistive technology. */
  label?: string;
  className?: string;
}

/** Renders a named icon (from `react-icons`) sized via the `--icon-size-{size}` custom properties. Hidden from assistive tech unless `label` is given, in which case it gets `role="img"`/`aria-label` instead. */
export function Icon({ name, size = 'md', label, className }: IconProps) {
  const IconComponent = icons[name];
  const sizeVar = `var(--icon-size-${size})`;

  return (
    <IconComponent
      aria-hidden={label == null ? true : undefined}
      aria-label={label}
      role={label != null ? 'img' : undefined}
      className={cn('shrink-0', className)}
      style={{ width: sizeVar, height: sizeVar }}
    />
  );
}
