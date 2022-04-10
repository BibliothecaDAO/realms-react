import { useDrag } from '@bibliotheca-dao/core-lib/hooks';
import clsx from 'clsx';
import type {
  ComponentProps,
  ElementType,
  MouseEvent,
  RefObject,
  WheelEvent,
} from 'react';
import { useCallback, useRef } from 'react';

interface Props<T extends ElementType> {
  as?: T;
  hideScroll?: boolean;
}

export type HorizontalNavigationProps<T extends ElementType = any> = Props<T> &
  Omit<ComponentProps<T>, keyof Props<T>>;

export const HorizontalNavigation = <T extends ElementType = 'div'>({
  as,
  className,
  children,
  hideScroll = false,
  ...props
}: HorizontalNavigationProps<T>) => {
  const { dragStart, dragStop, dragMove } = useDrag();
  const scrollRef = useRef<HTMLDivElement>(null);

  const onWheel = useCallback(
    (ev: WheelEvent, scrollRef: RefObject<HTMLDivElement>) => {
      const isTouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

      if (isTouchpad) {
        ev.stopPropagation();
        return;
      }

      if (!scrollRef.current) return;

      if (ev.deltaY < 0) {
        scrollRef.current.scrollLeft += 100;
      } else if (ev.deltaY > 0) {
        scrollRef.current.scrollLeft -= 100;
      }
    },
    []
  );

  const handleDrag = useCallback(
    (ev: MouseEvent) => {
      dragMove(ev, (posDiff) => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft += posDiff;
        }
      });
    },
    [dragMove]
  );

  const Component = as || 'div';

  return (
    <Component
      onWheel={(e) => onWheel(e, scrollRef)}
      onMouseMove={handleDrag}
      onMouseDown={dragStart}
      onMouseUp={dragStop}
      onMouseLeave={dragStop}
      ref={scrollRef}
      className={clsx(
        'relative flex overflow-y-hidden',
        hideScroll && 'overflow-x-hidden',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
