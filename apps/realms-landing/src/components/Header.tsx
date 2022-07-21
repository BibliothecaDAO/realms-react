import BibliothecaBook from '@bibliotheca-dao/ui-lib/icons/bibliotheca-book.svg';

export const Header = () => {
  const links = [
    { name: 'dao', link: 'atlas' },
    { name: 'start here', link: 'atlas' },
    { name: 'the realms', link: 'atlas' },
    { name: 'the atlas', link: 'atlas' },
  ];

  const linkCSS = 'hover:border-b-4 transition-all duration-150 ';
  return (
    <div className="fixed top-0 z-10 flex justify-center w-full px-20 py-4 text-4xl bg-white font-lords bg-opacity-10">
      <BibliothecaBook className="w-12 h-12 mr-20" />
      <div className="flex space-x-10">
        {links.map((a, index) => {
          return (
            <a className={linkCSS} key={index} href={a.link}>
              {a.name}
            </a>
          );
        })}
      </div>
    </div>
  );
};
