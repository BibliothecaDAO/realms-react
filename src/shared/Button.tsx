import { MouseEventHandler } from "react-syntax-highlighter/node_modules/@types/react";

type Prop = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
};

const Button: React.FC<Prop> = (props) => {
  return (
    <button
      className="px-8 py-2 border-2 border-black rounded-md bg-gradient-to-b from-yellow-400 to-yellow-500"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
