import { useId, type ReactNode } from 'react';
import { cn } from '@lib/cn';
import { Icon, Text, Stack } from '@primitives';
import './Comment.css';

export interface CommentProps {
  /** An optional string for the author */
  by?: string;
  /** The annotation's content, revealed inside the bubble. */
  children: ReactNode;
  className?: string;
}

/**
 * An inline comment icon whose emerald bubble itself grows to reveal its
 * text, on hover (desktop) or tap (touch/keyboard) — no JS involved, just a
 * checkbox toggle plus a `(hover: hover)` media query. `<details>`/`<summary>`
 * would be the more obvious native choice, but `<details>` isn't phrasing
 * content and gets split out of the surrounding `<p>` by the browser's
 * parser when used inline in prose — the checkbox hack stays inline-safe.
 *
 * The bubble (`label`) is a single grid container — one continuous shape,
 * not an icon bubble glued to a separate text pill — with an `auto`-sized
 * icon column and a `0fr`/`1fr` text column that grows the whole box open.
 * It's absolutely positioned over a same-sized spacer (the outer
 * `data-comment` span, pinned to the icon's collapsed footprint), so growing
 * it overlaps the surrounding prose instead of reflowing it — the same
 * tradeoff a tooltip makes.
 */
export function Comment({ by, children, className }: CommentProps) {
  const id = useId();

  return (
    <span data-comment className={cn('relative inline-block h-8 w-8 -translate-y-1 overflow-visible align-middle drop-shadow-md', className)}>
      <input type="checkbox" id={id} className="peer sr-only" aria-label="Show comment" />
      <label
        htmlFor={id}
        className="absolute bottom-0 left-0 flex flex-row items-start
          overflow-hidden rounded-2xl rounded-bl-none
          max-w-8 max-h-8 transition-all duration-200
          bg-chrome-surface text-chrome-text-primary cursor-pointer"
      >
        <span className="flex m-1 h-6 w-6 rounded-full shrink-0 items-center bg-accent-default text-accent-active justify-center">
          <Icon name="comment" size="sm" />
        </span>
        <Stack as="span" direction="col" gap="xs" padding="xs">
          {
            by && <Text as="span" variant="labelXSmall" className="text-chrome-text-secondary">{by}</Text>
          }
          <Text
            as="span"
            variant="bodySmall"
            className="w-xs shrink-0 opacity-0 transition-opacity duration-100"
            data-comment-note=""
          >
            {children}
          </Text>
        </Stack>
      </label>
    </span>
  );
}
