import { Button } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';

interface BaseSideBarPanel {
  title?: string | null | undefined;
  children: React.ReactNode[] | React.ReactNode;
  onClose?: () => void;
}

export const BaseSideBarPanel = ({
  title,
  onClose,
  children,
}: BaseSideBarPanel) => {
  return (
    <div className="relative w-full">
      <div>
        <div className="flex justify-between mb-2">
          <h1>{title}</h1>
          <div className="self-center justify-end">
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
