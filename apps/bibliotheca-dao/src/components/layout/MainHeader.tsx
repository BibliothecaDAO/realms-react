import BibliothecaBook from '@bibliotheca-dao/ui-lib/icons/BibliothecaBook.svg';
import Discord from '@bibliotheca-dao/ui-lib/icons/social/discord.svg';
import Github from '@bibliotheca-dao/ui-lib/icons/social/github.svg';
import { links } from '@/data/Projects';

export const MainHeader = () => {
  const headerElements = [
    // {
    //   title: 'DAO',
    //   icon: <Discord className="self-center w-6 mr-3 fill-current" />,
    // },
    {
      title: 'Discord',
      icon: <Discord className="self-center w-6 mr-3 fill-current" />,
      link: links[0].discord,
    },
    {
      title: 'Github',
      icon: <Github className="self-center w-6 mr-3 fill-current" />,
      link: links[0].github,
    },
  ];
  return (
    <div className="fixed flex w-full h-16 px-10 space-x-8 tracking-widest uppercase bg-gray-900 border-b border-off-300">
      {' '}
      <div className="container flex mx-auto">
        <BibliothecaBook className="self-center mr-10 fill-current h-9" />
        <a className="flex self-center px-4 mr-auto transition-all duration-150 border rounded border-off-300/20 hover:bg-off-300 hover:text-gray-900">
          treasury 250 E
        </a>
        <div className="flex space-x-4">
          {headerElements.map((a, index) => {
            return (
              <a
                key={index}
                href={a.link}
                className="flex self-center px-4 transition-all duration-150 border rounded border-off-300/20 hover:bg-off-300 hover:text-gray-900"
              >
                {a.icon} {a.title}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
