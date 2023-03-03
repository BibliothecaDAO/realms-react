import BibliothecaBook from '@bibliotheca-dao/ui-lib/icons/BibliothecaBook.svg';
import Image from 'next/image';
import Link from 'next/link';
import { links } from '@/data/Projects';

const footerLinkStyles = ' transition-all duration-300';

const footerHREFStyles = 'hover:border-b-4 border-gray-900/10';

export const MainFooter = () => {
  return (
    <div className="relative z-20 grid w-full grid-cols-1 gap-2 p-10 mx-auto text-off-300 sm:grid-cols-2 lg:grid-cols-4 sm:p-10 bg-off-800/40">
      <div className="">
        <BibliothecaBook className="self-center h-24 fill-current sm:h-36" />
      </div>
      <div className="my-10 tracking-widest uppercase">
        <h4 className="mb-6">Links</h4>
        <ul>
          <li className={footerLinkStyles}>
            <Link className={footerHREFStyles} href={'/hack'}>
              Hackathon
            </Link>
          </li>
          <li className={footerLinkStyles}>
            <a className={footerHREFStyles} href={links[0].website}>
              The Atlas
            </a>
          </li>
          <li className={footerLinkStyles}>
            <a className={footerHREFStyles} href={links[0].treasury}>
              The Treasury
            </a>
          </li>
          <li className={footerLinkStyles}>
            <a className={footerHREFStyles} href={links[0].snapshot}>
              Snapshot Voting
            </a>
          </li>
          <li className={footerLinkStyles}>
            <a className={footerHREFStyles} href={links[0].scroll}>
              Master Scroll (litepaper)
            </a>
          </li>
          <li className={footerLinkStyles}>
            <a className={footerHREFStyles} href={links[0].staking}>
              Staking
            </a>
          </li>
          <li className={footerLinkStyles}>
            <a
              className={footerHREFStyles}
              href={'https://old.biblioithecadao.xyz'}
            >
              Old Bibliotheca DAO site
            </a>
          </li>
          {/* {projects.map((a, index) => {
            return (
              <li className={footerLinkStyles} key={index}>
                {' '}
                <a href={a.website}>{a.name}</a>{' '}
              </li>
            );
          })} */}
        </ul>
      </div>
      <div className="my-10 tracking-widest uppercase">
        <h4 className="mb-6">Socials</h4>
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
          {/* {projects.map((a, index) => {
            return (
              <li className={footerLinkStyles} key={index}>
                {' '}
                <a href={a.website}>{a.name}</a>{' '}
              </li>
            );
          })} */}
        </ul>
      </div>
      <iframe
        src="https://discord.com/widget?id=884211910222970891&theme=dark"
        width="350"
        className="max-w-full"
        title="discord-widget"
        height="300"
        frameBorder="0"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      ></iframe>
    </div>
  );
};
