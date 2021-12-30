import { MouseEventHandler } from "react-syntax-highlighter/node_modules/@types/react";

type Prop = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
};

const Button: React.FC<Prop> = (props) => {
  return (
    <button
      className={
        "w-64 px-8 py-2 border-2 border-black rounded-md bg-gradient-to-b from-yellow-400 to-yellow-500 hover:bg-gradient-to-t " +
        props.className
      }
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
