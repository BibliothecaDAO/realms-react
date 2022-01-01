import React from "react";

const TokenLabel: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <span className="p-1 font-bold text-transparent rounded-md bg-clip-text bg-gradient-to-tr to-orange-300 from-orange-600">
      {props.children}
    </span>
  );
};

export default TokenLabel;
