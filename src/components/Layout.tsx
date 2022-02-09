import React, { ReactElement, useState } from 'react';
import { Head } from "./Head"
import { Header } from './navigation/header';

export default function Layout({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {

  const [hidden, setHidden] = useState(false);

  return (
    <div>
      {/* Meta */}
      <Head />
      <Header/>

      <div>{children}</div>

    </div>
  );
}

