import { Button } from '@bibliotheca-dao/ui-lib/base';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import clsx from 'clsx';

type Props = {
  title?: string;
  titleComponent?: React.ReactElement;
  onClose: () => void;
};

const SidebarHeader = (props: Props) => {
  return (
    <>
      {props.onClose && (
        <Button
          size="xs"
          variant="outline"
          className={clsx(
            'absolute top-2 z-10 flex items-center justify-center w-8 h-8 p-0 border-0 rounded-full left-2'
          )}
          onClick={() => {
            props.onClose();
          }}
        >
          <Close className="w-6 h-6" />
        </Button>
      )}
      {(props.title || props.onClose) && (
        <div className="flex justify-between w-full p-2 mb-4">
          <h1>{props.title}</h1>
        </div>
      )}
    </>
  );
};

export default SidebarHeader;
