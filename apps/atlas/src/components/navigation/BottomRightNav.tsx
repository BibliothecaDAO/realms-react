/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import BottomRightFrame from '@bibliotheca-dao/ui-lib/icons/frame/bottom-right_no-ink.svg';
import { framePrimary } from '@/constants/ui';

export const BottomRightNav = () => {
  return (
    <div className="absolute bottom-0 right-0 z-50">
      <div className="relative">
        <BottomRightFrame
          className={`absolute bottom-0 right-0 pointer-events-none w-52 lg:w-72 fill-${framePrimary}`}
        />
        {/* {address && <TransactionNavItem onClick={toggleTransactionCart} />} */}
      </div>

      <div
        className={`absolute bottom-1 w-[calc(100vw-20rem)] lg:w-[calc(100vw-28rem)] h-[2.7px] bg-${framePrimary} pointer-events-none`}
      ></div>
      <div
        className={`absolute bottom-1 right-0 w-[calc(100vw-26rem)] lg:w-[calc(100vw-36rem)] h-[1.1px] lg:h-[2.2px] bg-${framePrimary} mr-52 lg:mr-72 pointer-events-none`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-[calc(100vw-20rem)] lg:w-[calc(100vw-28rem)] h-[2px] bg-${framePrimary} mr-52 lg:mr-64 pointer-events-none`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-[3px] lg:w-[6px] h-[calc(100vw-20rem)] lg:h-[calc(100vh-28rem)] bg-${framePrimary} mb-64 pointer-events-none`}
      ></div>
      <div
        className={`absolute bottom-5 right-2 w-[1px] lg:w-[2px] h-[calc(100vw-20rem)] lg:h-[calc(100vh-28rem)] bg-${framePrimary} mb-64 pointer-events-none`}
      ></div>
    </div>
  );
};
