import classNames from "classnames";
import React from "react";
type Prop = {
  className?: string;
};
const LoadingSkeleton: React.FC<Prop> = (props) => (
  <div
    className={classNames(
      "block w-32 h-10 transition-colors rounded-md bg-slate-400 animate-pulse",
      props.className
    )}
  ></div>
);
export default LoadingSkeleton;
