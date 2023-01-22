import { Button } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import clsx from 'clsx';

interface BaseSideBarPanel {
  title?: string | null | undefined;
  children: React.ReactNode[] | React.ReactNode;
  position?: 'left' | 'right';
  onClose?: () => void;
  className?: string;
}

export const BaseSideBarPanel = ({
  title,
  onClose,
  children,
  position,
  className,
}: BaseSideBarPanel) => {
  return (
    <div
      className={`relative w-full ${className} ${!title && !onClose && 'pt-2'}`}
    >
      <div>
        <div className="sticky top-0 z-10 h-full">
          {onClose && (
            <Button
              size="xs"
              variant="outline"
              className={
                ' top-2  flex items-center justify-center w-8 h-8 p-0 border-0 rounded-2xl absolute bg-transparent left-2 '
              }
              onClick={() => {
                onClose();
              }}
            >
              <Close className="w-6 h-6" />
            </Button>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};
