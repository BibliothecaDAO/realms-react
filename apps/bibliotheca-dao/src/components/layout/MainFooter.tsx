import Image from 'next/image';
import { links } from '@/data/Projects';

const footerLinkStyles = 'hover:underline transition-all duration-300';

export const MainFooter = () => {
  return (
    <div className="container grid grid-cols-2 gap-2 p-10 mx-auto mt-10 border-t border-white sm:grid-cols-2 sm:p-10">
      <div className="">
        <Image
          className="mb-10 rounded"
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
