import classNames from 'classnames';
import React from 'react';

type Prop = {
  className?: string;
  children: React.ReactNode;
  side?: 'light' | 'dark';
};

export const LightGradient = 'to-cyan-300 from-cyan-500';
export const DarkGradient = 'to-purple-600 from-purple-900';

const TokenLabel: React.FC<Prop> = (props) => {
  let gradient = 'to-cyan-400 from-purple-600';
  let gradientDir = 'bg-gradient-to-l';
  if (props.side == 'light') {
    gradient = LightGradient;
    gradientDir = 'bg-gradient-to-l';
  } else if (props.side == 'dark') {
    gradient = DarkGradient;
    gradientDir = 'bg-gradient-to-r';
  }

  return (
    <span
      className={classNames(
        'font-bold text-transparent rounded-md bg-clip-text ',
        gradientDir,
        gradient,
        props.className
      )}
    >
      {props.children}
    </span>
  );
};

export default TokenLabel;
