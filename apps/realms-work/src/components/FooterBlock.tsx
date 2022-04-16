import Image from 'next/image';
import { links } from '@/data/Projects';

const footerLinkStyles = 'hover:underline transition-all duration-300';

export const FooterBlock = () => {
  return (
    <div className="container grid gap-2 grid-cols-2 sm:grid-cols-2 mx-auto p-10 sm:p-10 border-t border-white mt-10">
      <div className="">
        <Image
          className="rounded mb-10"
          alt="Vercel logo"
          src="/bibliotheca-logo.jpg"
          width={200}
          height={200}
        />
      </div>
      <div className="">
        <h4 className="mb-6">Contact</h4>
        <ul>
          <li className={footerLinkStyles}>
            {' '}
            <a href={links[0].website}>Bibliotheca DAO</a>
          </li>
          <li className={footerLinkStyles}>
            {' '}
            <a href={links[0].twitter}>Twitter</a>
          </li>
          <li className={footerLinkStyles}>
            {' '}
            <a href={links[0].discord}>Discord</a>
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
    </div>
  );
};
