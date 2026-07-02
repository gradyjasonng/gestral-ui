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
  BiPencil,
  BiBriefcase,
  BiLogoGithub,
  BiLogoLinkedin,
} from 'react-icons/bi';
import { cn } from '../../lib/cn';

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
  'pencil':     BiPencil,
  'briefcase':  BiBriefcase,
  'github':     BiLogoGithub,
  'linkedin':   BiLogoLinkedin,
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
