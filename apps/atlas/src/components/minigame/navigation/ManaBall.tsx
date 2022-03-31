import { LightningBoltIcon } from '@heroicons/react/outline';
interface Props {
  loadingTokenBalance: boolean;
  gameStatus?: string;
  elementAvailable?: number;
  elementUsed?: number;
  side: string;
}

const lightColours = 'from-rose-500 via-blue-600 to-rose-400';
const darkColours = 'from-rose-500 via-violet-900 to-rose-800';

export const ManaBall = (props: Props) => {
  return (
    <div
      className={`rounded-full w-48 h-48 bottom-6 right-6 bg-conic-to-t shimmer slow background-animate fast transition-all duration-150 flex justify-center p-4 text-white shadow-inner  outline-double outline-3 outline-offset-2 self-center ${
        props.side === 'dark' ? darkColours : lightColours
      }`}
    >
      {props.loadingTokenBalance ? (
        'loading'
      ) : (
        <span className="self-center text-center text-lg">
          {props.gameStatus == 'expired' || props.gameStatus == 'completed' ? (
            <span className="self-center text-center text-lg  capitalize">
              <span className="text-4xl font-bold">
                {props.elementAvailable}
                <LightningBoltIcon className="inline-block h-6 ml-1" />
              </span>
              <br />
              {props.side} minted for next game
            </span>
          ) : (
            <span className="self-center text-center text-lg">
              <span className="text-4xl font-bold">
                {props.elementUsed !== undefined &&
                props.elementAvailable !== undefined
                  ? 100 -
                    (
                      (props.elementUsed / props.elementAvailable) as any
                    ).toFixed()
                  : 0}
                %
              </span>
              <br />
              Light Mana left
            </span>
          )}
        </span>
      )}
    </div>
  );
};
