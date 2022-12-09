import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { forwardRef } from 'react';
import Helm from '../../icons/helm.svg';

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
  loading?: boolean;
}
export const Card = forwardRef<any, Props>((props: Props, ref) => {
  return (
    <div
      ref={ref}
      className={`${props.className}  duration-150 transition-all p-2 sm:p-3  bg-gray-1000/90 group flex flex-col border-4 border-yellow-800 rounded border-double hover:bg-gray-600/10`}
      onClick={props.onClick}
      tabIndex={props.tabIndex}
      role={props.role}
      onKeyUp={props.onKeyUp}
    >
      {props.children}
    </div>
  );
});
Card.displayName = 'Card';

export function CardBody({ children, className, loading }: Props) {
  if (loading) {
    return (
      <div>
        <div className="w-full h-12 mb-2 bg-gray-800 rounded-xl animate-pulse" />
        <div className="w-full h-12 mb-2 bg-gray-800 rounded-xl animate-pulse" />
        <div className="w-full h-12 mb-2 bg-gray-800 rounded-xl animate-pulse" />
      </div>
    );
  }
  return (
    <div className={`${className} flex flex-col flex-grow`}>{children}</div>
  );
}

export function CardTitle({ children, className, loading }: Props) {
  if (loading) {
    return (
      <div>
        <div className="w-full h-12 mb-2 bg-gray-800 rounded-xl animate-pulse" />
      </div>
    );
  }
  return (
    <div className={`${className} w-full mb-1 pt-2`}>
      <h3 className="px-2 py-1 text-xs text-left rounded sm:text-xl font-display text-shadow-[0_2px_6px_#6366f1] italic">
        {children}
      </h3>
    </div>
  );
}

export function CardText({ children, className }: Props) {
  return <div className={`${className} text-gray-500`}>{children}</div>;
}

export function CardStats({ children, className, loading }: Props) {
  if (loading) {
    return (
      <div>
        <div className="w-full h-12 mb-2 bg-gray-800 rounded-xl animate-pulse " />
      </div>
    );
  }
  return (
    <div
      className={`${className} w-full pt-4 pr-4 text-2xl text-right text-stone-200 mt-auto sm:text-3xl mb-4`}
    >
      {children}
    </div>
  );
}

const Components: { [key: string]: ReactElement } = Object.freeze({
  helm: <Helm className="w-32 h-32 fill-white opacity-10" />,
});

interface IconProps {
  icon: string;
}

export function CardIcon({ icon }: IconProps) {
  return (
    <div className="relative left-0 w-full bottom-20">
      <div className="absolute left-0">{Components[icon]}</div>
    </div>
  );
}
