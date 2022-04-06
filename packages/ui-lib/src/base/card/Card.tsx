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
    <div className={`${className} relative rounded-lg`} style={inlineStyle}>
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
    <div className={`${className} block flex-grow flex-shrink p-5`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: Props) {
  return (
    <div className={`${className} font-medium text-gray-700 mb-3`}>
      {children}
    </div>
  );
}

export function CardText({ children, className }: Props) {
  return <div className={`${className} text-gray-500`}>{children}</div>;
}
