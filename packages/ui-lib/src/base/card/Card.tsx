import type { HTMLAttributes, ReactNode } from 'react';

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
      className={`${className} duration-150 transition-all  hover:bg-gray-600/60 flex flex-wrap p-4 text-gray-600 bg-white/30 rounded shadow-sm border-l-4 border-double overflow-hidden`}
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
    <div className={`${className} flex flex-col flex-grow flex-shrink p-5`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: Props) {
  return (
    <div
      className={`${className} z-20 w-full text-2xl font-semibold tracking-widest text-white uppercase font-lords`}
    >
      {children}
    </div>
  );
}

export function CardText({ children, className }: Props) {
  return <div className={`${className} text-gray-500`}>{children}</div>;
}

export function CardStats({ children, className }: Props) {
  return (
    <div
      className={`${className} w-full pt-4 pr-10 text-5xl text-right text-white`}
    >
      {children}
    </div>
  );
}
