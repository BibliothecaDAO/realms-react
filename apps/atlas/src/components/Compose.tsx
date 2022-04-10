import React from 'react';

interface ComposeProps {
  components: Array<React.JSXElementConstructor<React.PropsWithChildren<any>>>;
  children: React.ReactNode;
}

export default function Compose(props: ComposeProps) {
  const { components = [], children } = props;

  return (
    <>
      {components.reduceRight((acc, Comp) => {
        return React.createElement(Comp, props, acc);
      }, children)}
    </>
  );
}
