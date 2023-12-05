import BibliothecaBook from '@bibliotheca-dao/ui-lib/icons/BibliothecaBook.svg';
import Image from 'next/image';
import Link from 'next/link';
import { links } from '@/data/Projects';

const footerLinkStyles = 'hover:font-semibold';

const footerHREFStyles = 'hover:border-b-4 border-gray-900/10';

export const MainFooter = () => {
  const daoLink: any = [
    {
      link: (
        <a className={footerHREFStyles} href={links[0].snapshot}>
          Snapshot
        </a>
      ),
    },
    {
      link: (
        <a className={footerHREFStyles} href={links[0].scroll}>
          Litepaper
        </a>
      ),
    },
    {
      link: (
        <a className={footerHREFStyles} href={links[0].staking}>
          Staking
        </a>
      ),
    },
    {
      link: (
        <a
          className={footerHREFStyles}
          href={'https://old.bibliothecadao.xyz'}
        >
          Old Bibliotheca DAO site
        </a>
      ),
    },
  ];
  const siteLinks: any = [
    {
      link: (
        <a className={footerHREFStyles} href={links[0].website}>
          Atlas
        </a>
      ),
    },
    {
      link: (
        <Link className={footerHREFStyles} href={links[0].treasury}>
          Treasury
        </Link>
      ),
    },

    {
      link: (
        <Link className={footerHREFStyles} href={'/articles'}>
          Articles
        </Link>
      ),
    },
    {
      link: (
        <Link className={footerHREFStyles} href={'/claim'}>
          Claim
        </Link>
      ),
    },
  ];
  return (
    <div className="container z-20 mx-auto mt-40 mb-20">
      <div className="relative grid w-full grid-cols-1 gap-8 px-4 mx-auto sm:px-0 sm:grid-cols-2 lg:grid-cols-5 bg-off-800/40">
        <div className="">
          <BibliothecaBook className="self-center h-24 fill-current sm:h-24" />
        </div>
        <div>
          <h6 className="font-semibold">Site</h6>
          <ul>
            {siteLinks.map((link: any, index: any) => (
              <li key={index} className={footerLinkStyles}>
                {link.link}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h6 className="font-semibold">DAO</h6>
          <ul>
            {daoLink.map((link: any, index: any) => (
              <li key={index} className={footerLinkStyles}>
                {link.link}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h6 className="font-semibold">Comms</h6>
          <ul>
            <li className={footerLinkStyles}>
              <a className={footerHREFStyles} href={links[0].twitterBiblio}>
                Bibliotheca Twitter
              </a>
            </li>
            <li className={footerLinkStyles}>
              <a className={footerHREFStyles} href={links[0].twitterRealms}>
                Realms Twitter
              </a>
            </li>
          </ul>
        </div>
        <div>
          <iframe
            src="https://discord.com/widget?id=884211910222970891&theme=dark"
            width="350"
            className="max-w-full"
            title="discord-widget"
            height="300"
            frameBorder="0"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          />
        </div>
      </div>
    </div>
  );
};
