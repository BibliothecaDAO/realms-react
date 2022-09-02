import { Button } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';

interface BaseSideBarPanel {
  title?: string;
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
          <h2>{title}</h2>
          <div className="flex justify-end mb-2 mr-1">
            {onClose && (
              <Button
                size="sm"
                onClick={() => {
                  onClose();
                }}
              >
                <Close />
              </Button>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
