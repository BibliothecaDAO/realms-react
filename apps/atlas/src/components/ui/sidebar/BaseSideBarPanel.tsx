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
        {onClose && (
          <Button
            size="xs"
            variant="outline"
            className={clsx(
              'absolute top-2 z-10 flex items-center justify-center w-8 h-8 p-0 border-0 rounded-full',
              position != 'left' ? 'left-2' : 'right-2'
            )}
            onClick={() => {
              onClose();
            }}
          >
            <Close className="w-6 h-6" />
          </Button>
        )}
        {(title || onClose) && (
          <div className="flex justify-between w-full p-2 mb-4">
            <h1>{title}</h1>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
