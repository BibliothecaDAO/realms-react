import { Button } from '@bibliotheca-dao/ui-lib/base';

type Props = {
  title?: string;
  titleComponent?: React.ReactElement;
  onClose: () => void;
};

const SidebarHeader = (props: Props) => {
  return (
    <div className="flex justify-between mb-2">
      {props.titleComponent ?? <h1> {props.title}</h1>}
      <div>
        <Button variant="outline" size="xs" onClick={props.onClose}>
          X
        </Button>
      </div>
    </div>
  );
};

export default SidebarHeader;
