import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import Helm from '../../icons/helm.svg';

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
  loading?: boolean;
}

const inlineStyle = {
  boxShadow: '0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%)',
};

export function Card({ children, className }: Props) {
  return (
    <div
      className={`${className} duration-150 transition-all  hover:bg-gray-900/80 flex flex-wrap p-2 text-gray-800 bg-black/80 rounded-xl shadow-xl group flex-grow`}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className, loading }: Props) {
  if (loading) {
    return (
      <div className="p-6">
        <div className="w-full h-64 mb-4 bg-gray-400 rounded animate-pulse" />
        <div className="w-full h-16 mb-4 bg-gray-400 rounded animate-pulse" />
        <div className="w-full h-16 mb-4 bg-gray-400 rounded animate-pulse" />
        <div className="w-full h-16 bg-gray-400 rounded animate-pulse" />
      </div>
    );
  }
  return (
    <div
      className={`${className} flex flex-col flex-grow  p-3 rounded-xl bg-black/60 text-gray-800 `}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: Props) {
  return (
    <div className={`${className} w-full mb-4`}>
      <h3 className="px-2 py-1 text-left rounded text-stone-200 font-display">
        {children}
      </h3>
    </div>
  );
}

export function CardText({ children, className }: Props) {
  return <div className={`${className} text-gray-500`}>{children}</div>;
}

export function CardStats({ children, className }: Props) {
  return (
    <div
      className={`${className} w-full pt-4 pr-4 text-right text-white mt-auto font-semibold`}
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
