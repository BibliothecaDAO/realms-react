import React from "react";

const TokenLabel: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <span className="p-1 font-bold text-transparent rounded-md bg-clip-text bg-gradient-to-l to-cyan-400 from-purple-600">
      {props.children}
    </span>
  );
};

export default TokenLabel;
