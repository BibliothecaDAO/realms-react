import { useUIContext } from "~/hooks/useUIContext";
import { MouseEventHandler, useState } from "react";
import { Resources } from "~/util/resources";
import { useQuery } from "@apollo/client";
import { WalletRealmsData, RealmFilters } from "~/types";
import { getRealmsQuery } from "~/hooks/graphql/queries";
import Menu from "../public/svg/menu.svg";
import { useWalletContext } from "~/hooks/useWalletContext";
import { Realm as RealmCard } from "~/components/realms/Realm";
import { animated, useSpring } from "@react-spring/web";
import { CryptsEmpire } from "./CryptsEmpire";
import { RealmsEmpire } from "./RealmsEmpire";

const filterTypes = [
  { name: "Rarity", key: "rarityRank" },
  { name: "Token Id", key: "tokenId" },
];
type Props = {
  onClick?: (event: any, id: number) => void;
};

export const EmpireSideBar = (props: Props) => {
  const { toggleEmpireMenu, empireMenu } = useUIContext();
  const [tab, setTab] = useState<string>("Realms");

  const animation = useSpring({
    opacity: empireMenu ? 1 : 0,
    transform: empireMenu ? `translateY(0)` : `translateY(-200%)`,
  });

  return (
    <animated.div
      className="absolute top-0 z-40 w-full backdrop-blur-md bg-off-200/90"
      style={animation}
    >
      <div
        className={`h-screen w-full relative z-60 top-0 p-6   rounded-r-2xl overflow-y-scroll`}
      >
        <div className="flex justify-between">
          <h1 className="mb-4">My Empire</h1>
          <button
            className="p-4 mb-8 transition-all rounded bg-white/20 hover:bg-white/70"
            onClick={toggleEmpireMenu}
          >
            Close
          </button>
        </div>
        <div className="flex ">
          <button>Realms</button>
          <button>Crypts</button>
        </div>

        <RealmsEmpire onClick={props.onClick} />
        <CryptsEmpire />
      </div>
    </animated.div>
  );
};
