import Image from 'next/image';
import { projects } from '@/data/Projects';

const footerLinkStyles = 'hover:underline transition-all duration-300';

export const FooterBlock = () => {
  return (
    <div className="container grid gap-2 grid-cols-2 sm:grid-cols-4 mx-auto p-10 sm:p-20">
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
        <h4 className="mb-6">Websites</h4>
        <ul>
          {projects.map((a, index) => {
            return (
              <li className={footerLinkStyles} key={index}>
                {' '}
                <a href={a.website}>{a.name}</a>{' '}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="">
        <h4 className="mb-6">Discords</h4>
        <ul>
          {projects.map((a, index) => {
            return (
              <li className={footerLinkStyles} key={index}>
                {' '}
                <a href={a.discord}>{a.name}</a>{' '}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="">
        <h4 className="mb-6">Twitters</h4>
        <ul>
          {projects.map((a, index) => {
            return (
              <li className={footerLinkStyles} key={index}>
                {' '}
                <a href={a.twitter}>{a.name}</a>{' '}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
