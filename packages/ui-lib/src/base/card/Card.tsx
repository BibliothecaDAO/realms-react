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
      className={`${className} duration-150 transition-all  hover:bg-gray-600/80 flex flex-wrap p-4 text-gray-600 bg-gray-800/30 rounded shadow-inner overflow-hidden group `}
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
    <div className={`${className} z-20 w-full tracking-widest uppercase `}>
      <h5 className="px-2 font-semibold rounded shadow-inner text-white/90 drop-shadow-sm font-body bg-white/10">
        {children}
      </h5>
    </div>
  );
}

export function CardText({ children, className }: Props) {
  return <div className={`${className} text-gray-500`}>{children}</div>;
}

export function CardStats({ children, className }: Props) {
  return (
    <div
      className={`${className} w-full pt-4 pr-4 text-right text-white mt-auto`}
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
