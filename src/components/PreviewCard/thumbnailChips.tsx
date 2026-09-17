import { Tag } from '@components/Tag/Tag';

export interface ThumbnailChipsProps {
  /** Pinned to the thumbnail's top-right corner. */
  date?: string;
  /** Pinned to the thumbnail's bottom-right corner, wrapping right-aligned. */
  tags?: string[];
}

/**
 * The `date` (top-right) and `tags` (bottom-right) chips overlaid on a card
 * thumbnail — `Tag`s in the `floating` variant, so they stay legible over
 * arbitrary imagery. Shared by `PreviewCard` and `AssetCard` so both read
 * identically. Render inside a `position: relative` thumbnail wrapper.
 */
export function ThumbnailChips({ date, tags }: ThumbnailChipsProps) {
  return (
    <>
      {date && (
        <Tag variant="floating" className="absolute top-1.5 right-1.5 uppercase">
          {date}
        </Tag>
      )}
      {tags && tags.length > 0 && (
        <div className="absolute bottom-1.5 right-1.5 flex flex-wrap justify-end gap-sp-xs">
          {tags.map((tag) => (
            <Tag key={tag} variant="floating" className="lowercase">
              {tag}
            </Tag>
          ))}
        </div>
      )}
    </>
  );
}
