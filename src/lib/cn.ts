import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Gestral's custom text-* size scale (see src/styles/tokens.css) isn't known to
// tailwind-merge's default config, so `text-eyebrow` etc. get misclassified into
// the `text-color` group and silently dropped when merged with a `text-{color}` class.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'hero',
            'h1',
            'h2',
            'h3',
            'subheading-1',
            'subheading-2',
            'subheading-3',
            'display-sm',
            'overline',
            'eyebrow',
            'body',
            'body-sm',
            'caption',
            'prose',
            'label-sm',
            'label-xs',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
