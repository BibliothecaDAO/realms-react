type Props = {
  title: string;
  onClose: () => void;
};

const SidebarHeader = (props: Props) => {
  return (
    <div className="flex justify-between">
      <h2>{props.title}</h2>
      <button onClick={props.onClose}>Close</button>
    </div>
  );
};

export default SidebarHeader;
