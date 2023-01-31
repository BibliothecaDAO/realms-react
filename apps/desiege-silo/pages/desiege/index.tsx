import type { NextPage } from 'next';
import Head from 'next/head';
import ShieldGame from '@/components/minigame/ShieldGame';
import { DesiegeHeader } from '@/components/navigation/DesiegeHeader';

type Prop = {
  title?: string;
  openGraphUrl?: string;
  openGraphDescription?: string;
  children: React.ReactElement;
};

const defaultTitle = 'Desiege S1: Divine Eclipse';
const defaultDescription =
  'Dark elements of chaos descend on the Divine City. The Council of Mages cast an ancient spell within the Citadel to distill Light elements in a desperate attempt to strengthen the shield and protect the city.';

const Game: NextPage<Prop> = (props) => {
  return (
    <div className="">
      <Head>
        <title>{props.title || defaultTitle}</title>
        <meta name="description" content={defaultDescription} />
        <meta
          name="og:url"
          content={
            props.openGraphUrl || 'https://lootverse.bibliothecadao.xyz/desiege'
          }
        />
        <meta
          name="og:description"
          content={props.openGraphDescription || defaultDescription}
        />
        <meta property="og:title" content={props.title || defaultTitle} />
        <meta
          property="og:image"
          content="https://gen.postmage.com/generate/414f4b87-4d9c-44a8-8877-1437da67003b/f40b6de5-abe4-434f-878d-89ed4f3fcad8/image.png?url=https://lootverse.bibliothecadao.xyz/desiege"
        />
        <link rel="icon" href="/favicon.ico" />
        {/* Font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Inconsolata:wght@300&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div>
        <DesiegeHeader />
        <ShieldGame />
      </div>
    </div>
  );
};

export default Game;
