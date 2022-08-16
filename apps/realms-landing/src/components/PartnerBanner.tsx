import Briq from '@bibliotheca-dao/ui-lib/icons/briq.svg';
import Cartridge from '@bibliotheca-dao/ui-lib/icons/cartridge.svg';
import Starkware from '@bibliotheca-dao/ui-lib/icons/starkware.svg';
import Topology from '@bibliotheca-dao/ui-lib/icons/topology.svg';
import Yagi from '@bibliotheca-dao/ui-lib/icons/yagi.svg';

export const PartnerBanner = () => {
  const partners = [
    {
      icon: (
        <Starkware className="w-48 grayscale brightness-200 hover:grayscale-0" />
      ),
      url: 'https://starkware.co/starknet/',
    },
    {
      icon: (
        <Cartridge className="w-48 grayscale brightness-[0.4] hover:brightness-100 hover:grayscale-0" />
      ),
      url: 'https://cartridge.gg/',
    },
    {
      icon: <Yagi className="w-32 grayscale hover:grayscale-0" />,
      url: 'https://yagi.fi/',
    },
    {
      icon: <Briq className="w-28 grayscale hover:grayscale-0" />,
      url: 'https://briq.construction',
    },
    {
      icon: (
        <Topology className="w-48 grayscale brightness-[0.4] hover:brightness-100 hover:grayscale-0" />
      ),
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
    <div className="relative text-gray-900 shadow-inner text-off-300">
      <h4 className="top-0 self-center mt-12">We work with</h4>
      <div className="flex flex-wrap justify-center text-center">
        {partners.map((a, index) => {
          return (
            <div key={index} className="self-center p-4 ">
              {' '}
              <a href={a.url} target="_blank" rel="noreferrer">
                {a.icon}
              </a>{' '}
            </div>
          );
        })}
      </div>
    </div>
  );
};
