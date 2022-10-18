import classNames from 'classnames';
import type { MouseEventHandler } from 'react';
type Prop = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  disabled?: boolean;
  color?: 'default' | 'secondary' | 'primary';
};

const Button: React.FC<Prop> = (props) => {
  let bgColors;

  switch (props.color) {
    case 'primary':
      bgColors = 'from-green-700 to-green-800';
      break;
    case 'secondary':
      bgColors = 'from-gray-600 to-gray-700';
      break;
    default:
      bgColors = 'from-gray-400 to-gray-500';
  }

  return (
    <button
      className={classNames(
        'disabled:cursor-not-allowed disabled:opacity-60 px-8 py-2 rounded-md uppercase tracking-wide bg-white font-body tracking-widest shadow-xl hover:-translate-y-2 transition-all duration-150 hover:bg-white/70 text-gray-600 w-full',
        props.active ? 'from-yellow-400 to-yellow-500' : bgColors,
        props.className
      )}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
