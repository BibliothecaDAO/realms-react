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
    <div className={`relative w-full ${className}`}>
      <div>
        <div className="flex justify-between w-full p-2 mb-2">
          <h1>{title}</h1>
          <div
            className={clsx('self-center', position != 'left' && '-order-1')}
          >
            {onClose && (
              <Button
                size="xs"
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  onClose();
                }}
              >
                <Close className="w-6 h-6" />
              </Button>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
