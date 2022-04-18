import { ExternalLink } from '@/shared/Icons';
export const GamePreparation = () => {
  return (
    <div className="">
      <h4 className="font-semibold tracking-widest text-center text-gray-800">
        Get Prepared for the next game
      </h4>
      <div className="p-4 text-gray-700 rounded-md shadow-inner bg-white/40">
        <ul className="text-xl list-none ">
          <li>
            Browse the{' '}
            <a
              target={'_blank'}
              href="https://docs.google.com/document/d/1LcT7QiprYOpK_3LfGN6MRBkqgULw7jQT3dIMSSi2vZg/edit?usp=sharing"
              rel="noreferrer"
              className="underline"
            >
              Game Guide
            </a>
            <ExternalLink className="inline-block h-4 ml-1" />
          </li>
          <li>
            Coordinate on{' '}
            <a
              target={'_blank'}
              href="https://discord.gg/YfeZQ3NFB8"
              className="underline"
              rel="noreferrer"
            >
              Discord
            </a>
            <ExternalLink className="inline-block h-4 ml-1" />
          </li>
          {/* <li>
    <a className="underline">Recruit</a> your friends{' '}
    <span className="p-1 bg-blue-200 rounded">coming soon</span>
  </li> */}
          <li>
            Check the{' '}
            <a
              target={'_blank'}
              href="https://github.com/BibliothecaForAdventurers/realms-react/tree/main/apps/atlas/src/components/minigame"
              className="underline"
              rel="noreferrer"
            >
              front-end
            </a>
            <ExternalLink className="inline-block h-4 ml-1" /> and{' '}
            <a
              target={'_blank'}
              href="https://github.com/BibliothecaForAdventurers/realms-contracts/tree/main/contracts/desiege"
              className="underline"
              rel="noreferrer"
            >
              StarkNet
            </a>
            <ExternalLink className="inline-block h-4 ml-1" /> contracts
          </li>
        </ul>
      </div>
    </div>
  );
};
