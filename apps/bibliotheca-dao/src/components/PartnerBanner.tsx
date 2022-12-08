import Cartridge from '@bibliotheca-dao/ui-lib/icons/cartridge.svg';
import Starkware from '@bibliotheca-dao/ui-lib/icons/starkware.svg';
import Topology from '@bibliotheca-dao/ui-lib/icons/topology.svg';
import Yagi from '@bibliotheca-dao/ui-lib/icons/yagi.svg';
export const PartnerBanner = () => {
  const partners = [
    {
      icon: <Starkware className="w-48 grayscale hover:grayscale-0" />,
      url: 'https://starkware.co/starknet/',
    },
    {
      icon: <Cartridge className="w-48 grayscale hover:grayscale-0" />,
      url: 'https://cartridge.gg/',
    },
    {
      icon: <Yagi className="w-32 grayscale hover:grayscale-0" />,
      url: 'https://yagi.fi/',
    },
    {
      icon: (
        <span className="text-4xl hover:text-orange-600 grayscale hover:grayscale-0">
          Briq
        </span>
      ),
      url: 'https://briq.construction',
    },
    {
      icon: <Topology className="w-48 grayscale hover:grayscale-0" />,
      url: 'https://topology.gg/',
    },
    {
      icon: (
        <img
          src="/match.png"
          className="w-12 grayscale hover:grayscale-0"
          alt=""
        />
      ),
      url: 'https://www.matchboxdao.com/',
    },
  ];
  return (
    <div className="relative z-20 flex flex-wrap justify-center w-full h-auto p-10 text-gray-900 shadow-inner sm:p-20 sm:space-x-10 bg-off-300/40 text-off-300">
      <h4 className="absolute top-0 self-center -mt-4">We work with</h4>{' '}
      {partners.map((a, index) => {
        return (
          <div key={index} className="self-center p-4 ">
            {' '}
            <a href={a.url}>{a.icon}</a>{' '}
          </div>
        );
      })}
    </div>
  );
};
