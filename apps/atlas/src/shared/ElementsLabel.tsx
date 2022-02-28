import classNames from 'classnames';
import React from 'react';

type Prop = {
  className?: string;
  children: React.ReactNode;
  side?: 'light' | 'dark';
};

const TokenLabel: React.FC<Prop> = (props) => {
  let gradient = 'to-cyan-400 from-purple-600';
  let gradientDir = 'bg-gradient-to-l';
  if (props.side == 'light') {
    gradient = 'to-cyan-400 from-cyan-700';
    gradientDir = 'bg-gradient-to-t';
  } else if (props.side == 'dark') {
    gradient = 'to-purple-600 from-purple-900';
    gradientDir = 'bg-gradient-to-t';
  }

  return (
    <span
      className={classNames(
        'font-bold text-transparent rounded-md bg-clip-text',
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
