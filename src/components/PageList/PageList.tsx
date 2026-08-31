import { useMemo, useState, type ReactNode } from 'react';
import { Text, Stack } from '@primitives';
import { Button } from '@components/Button/Button';
import { ButtonWithPreviewCard } from '@components/ButtonWithPreviewCard/ButtonWithPreviewCard';
import { cn } from '@lib/cn';

export interface PageListItem {
  label: string;
  href: string;
  /** The currently-open page — bolded, and the list's pagination opens to whichever page contains it. */
  active?: boolean;
  /** Rich preview (typically an `AssetCard`) revealed on hover/focus — see `ButtonWithPreviewCard`. */
  previewCard: ReactNode;
}

export interface PageListProps {
  pages: PageListItem[];
  /** Entries shown per page before pagination kicks in. Defaults to 6. */
  pageSize?: number;
  className?: string;
}

/** A list of sibling pages (e.g. every blog post, or a curated "recent" set), each a compact link that reveals `previewCard` on hover/focus. Paginated client-side once there are more than `pageSize` entries — opens to whichever page contains the `active` item, not always the first. Render inside a `RailSection label="Pages"`. */
export function PageList({ pages, pageSize = 6, className }: PageListProps) {
  const activeIndex = useMemo(() => pages.findIndex((p) => p.active), [pages]);
  const pageCount = Math.ceil(pages.length / pageSize);
  const [page, setPage] = useState(() => (activeIndex >= 0 ? Math.floor(activeIndex / pageSize) : 0));
  const visible = pages.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className={className}>
      <Stack direction="col" gap="xs">
        {visible.map((item) => (
          <ButtonWithPreviewCard
            key={item.href}
            label={item.label}
            href={item.href}
            size="sm"
            active={item.active ? 'secondary' : false}
            className={cn('rounded-none', item.active && 'font-semibold')}
            previewCard={item.previewCard}
            expanded
          />
        ))}
      </Stack>

      {pageCount > 1 && (
        <Stack direction="row" align="center" justify="between" className="pt-2">
          <Button
            variant="iconOnly"
            size="sm"
            icon="chevron-left"
            aria-label="Previous pages"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          />
          <Text variant="labelXSmall" className="text-chrome-text-muted">
            {page + 1} / {pageCount}
          </Text>
          <Button
            variant="iconOnly"
            size="sm"
            icon="chevron-right"
            aria-label="Next pages"
            disabled={page === pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          />
        </Stack>
      )}
    </div>
  );
}
