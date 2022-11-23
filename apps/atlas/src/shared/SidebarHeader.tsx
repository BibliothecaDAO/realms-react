import { Button } from '@bibliotheca-dao/ui-lib/base';

type Props = {
  title?: string;
  titleComponent?: React.ReactElement;
  onClose: () => void;
};

const SidebarHeader = (props: Props) => {
  return (
    <div className="flex mb-2">
      {props.titleComponent ?? <h2> {props.title}</h2>}

      <div className="mx-auto">
        <Button variant="outline" size="xs" onClick={props.onClose}>
          X
        </Button>
      </div>
    </div>
  );
};

export default SidebarHeader;
