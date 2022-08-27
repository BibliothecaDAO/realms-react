import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import Helm from '../../icons/helm.svg';

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
  loading?: boolean;
}

export function Card({ children, className }: Props) {
  return (
    <div
      className={`${className} duration-150 transition-all border-4 border-double border-white/20  hover:opacity-90 p-3  bg-black/90 rounded-2xl shadow-xl group flex flex-col`}
    >
      {children}
    </div>
  );
}

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
    <div className={`${className} flex flex-col flex-grow  p-3 rounded-xl  `}>
      {children}
    </div>
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
      <h3 className="px-2 py-1 text-left uppercase rounded font-display">
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
      className={`${className} w-full pt-4 pr-4 text-right text-stone-200 font-semibold mt-auto`}
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
