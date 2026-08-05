import { Fragment, useState, type ReactNode } from 'react';
import { cn } from '@lib/cn';
import { Card } from '@components/Card/Card';
import { Stack } from '@primitives/Stack/Stack';
import { Button, type ButtonProps } from '@components/Button/Button';

export type AccordionHeaderButtonProps = Omit<
  ButtonProps,
  'children' | 'href' | 'id' | 'aria-expanded' | 'aria-controls' | 'onClick' | 'active'
>;

export interface AccordionItem {
  id: string;
  header: ReactNode;
  content: ReactNode;
  /** Extra `Button` props for this item's header, e.g. `variant`, `icon`, `palette`, `size`. */
  headerButtonProps?: AccordionHeaderButtonProps;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Controlled: id of the open item. Omit to let Accordion manage its own state. */
  openId?: string;
  /** Initial open item when uncontrolled. Defaults to the first item. */
  defaultOpenId?: string;
  onOpenChange?: (id: string) => void;
  className?: string;
}

/**
 * Single-open accordion: exactly one item is expanded at a time — opening
 * one closes whichever was open, and the open item can't be collapsed to
 * none. Selection is controlled via `openId`/`onOpenChange` or managed
 * internally when omitted, matching `SegmentedControl`'s pattern.
 */
export function Accordion({ items, openId, defaultOpenId, onOpenChange, className }: AccordionProps) {
  const [internalOpenId, setInternalOpenId] = useState(defaultOpenId ?? items[0]?.id);
  const current = openId ?? internalOpenId;

  function open(id: string) {
    if (openId === undefined) {
      setInternalOpenId(id);
    }
    onOpenChange?.(id);
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <Stack direction="col">
        {items.map((item, index) => {
          const isOpen = item.id === current;
          const headerId = `accordion-header-${item.id}`;
          const panelId = `accordion-panel-${item.id}`;

          return (
            <Fragment key={item.id}>
              <Button
                {...item.headerButtonProps}
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                active={isOpen}
                onClick={() => open(item.id)}
                className={cn(index > 0 && 'border-t border-chrome-border', item.headerButtonProps?.className)}
              >
                {item.header}
              </Button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                inert={!isOpen}
                className={cn(
                  'grid transition-[grid-template-rows] duration-200 ease-out',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-chrome-border px-sp-md py-sp-sm">{item.content}</div>
                </div>
              </div>
            </Fragment>
          );
        })}
      </Stack>
    </Card>
  );
}
