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
      className={`rounded-full w-48 h-48 bottom-6 right-6 bg-conic-to-t shimmer slow background-animate fast transition-all duration-150 flex justify-center p-4 text-white shadow-inner  border-8 border-double ${
        props.side === 'dark' ? darkColours : lightColours
      }`}
    >
      {props.loadingTokenBalance ? (
        'loading'
      ) : (
        <span className="self-center text-center text-lg">
          {props.gameStatus == 'expired' || props.gameStatus == 'completed' ? (
            <span className="text-4xl font-bold">{props.elementAvailable}</span>
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
