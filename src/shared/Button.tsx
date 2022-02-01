import classNames from "classnames";
import { MouseEventHandler } from "react-syntax-highlighter/node_modules/@types/react";

type Prop = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  disabled?: boolean;
  color?: "default" | "secondary" | "primary";
};

const Button: React.FC<Prop> = (props) => {
  let bgColors;

  switch (props.color) {
    case "primary":
      bgColors = "from-green-700 to-green-800";
      break;
    case "secondary":
      bgColors = "from-gray-600 to-gray-700";
    default:
      bgColors = "from-gray-400 to-gray-500";
  }

  return (
    <button
      className={classNames(
        "px-8 py-2 border-2 rounded-md bg-gradient-to-b",
        props.active ? "from-yellow-400 to-yellow-500" : bgColors,
        props.disabled
          ? "text-gray-500 cursor-not-allowed"
          : "hover:bg-gradient-to-t text-black",
        props.className
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
