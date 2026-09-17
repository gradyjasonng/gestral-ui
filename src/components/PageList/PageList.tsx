import { useMemo, useState, type ReactNode } from 'react';
import { Text, Stack } from '@primitives';
import { Button } from '@components/Button/Button';
import { buttonHeightMap } from '@components/Button/shared';
import { ButtonWithPreviewCard } from '@components/ButtonWithPreviewCard/ButtonWithPreviewCard';

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

/** A list of sibling pages (e.g. every blog post, or a curated "recent" set), each a compact link that reveals `previewCard` on hover/focus. The `active` entry — the current page — is inert instead: a plain bolded label with no link, no hover/focus preview, since there's nowhere to navigate to. Paginated client-side once there are more than `pageSize` entries — opens to whichever page contains the `active` item, not always the first. The visible list is always padded out to `pageSize` rows tall with blank spacers, so the section keeps a fixed height between pages and when a section has fewer entries. Render inside a `RailSection label="Pages"`. */
export function PageList({ pages, pageSize = 6, className }: PageListProps) {
  const activeIndex = useMemo(() => pages.findIndex((p) => p.active), [pages]);
  const pageCount = Math.ceil(pages.length / pageSize);
  const [page, setPage] = useState(() => (activeIndex >= 0 ? Math.floor(activeIndex / pageSize) : 0));
  const visible = pages.slice(page * pageSize, page * pageSize + pageSize);
  const fillerCount = Math.max(0, pageSize - visible.length);

  return (
    <div className={className}>
      <Stack direction="col" gap="xs">
        {visible.map((item) =>
          item.active ? (
            <Button
              key={item.href}
              variant="horizontal"
              size="sm"
              active="secondary"
              interactive={false}
              aria-current="page"
              className="font-semibold"
            >
              {item.label}
            </Button>
          ) : (
            <ButtonWithPreviewCard
              key={item.href}
              label={item.label}
              href={item.href}
              size="sm"
              active={false}
              className="rounded-none"
              previewCard={item.previewCard}
              expanded
            />
          ),
        )}

        {/* Pad short pages to `pageSize` rows so the section's height never changes. */}
        {Array.from({ length: fillerCount }, (_, i) => (
          <div key={`filler-${i}`} aria-hidden="true" style={{ height: buttonHeightMap.sm }} />
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
