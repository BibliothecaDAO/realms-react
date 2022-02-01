import classNames from "classnames";
import React from "react";

type Prop = {
  className?: string;
  children: React.ReactNode;
};

const TokenLabel: React.FC<Prop> = (props) => {
  return (
    <span
      className={classNames(
        "font-bold text-transparent rounded-md bg-clip-text bg-gradient-to-l to-cyan-400 from-purple-600",
        props.className
      )}
    >
      {props.children}
    </span>
  );
};

export default TokenLabel;
