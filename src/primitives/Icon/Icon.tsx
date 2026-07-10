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
} from 'react-icons/bi';
import {
  LuRotateCw,
  LuRotateCcw,
  LuRefreshCw,
  LuRefreshCcw,
} from 'react-icons/lu';
import { cn } from '@lib/cn';

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
