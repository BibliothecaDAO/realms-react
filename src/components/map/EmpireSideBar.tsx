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

const filterTypes = [
  { name: "Rarity", key: "rarityRank" },
  { name: "Token Id", key: "tokenId" },
];
type Props = {
  onClick?: (event: any, id: number) => void;
};

export const EmpireSideBar = (props: Props) => {
  const { toggleEmpireMenu, empireMenu } = useUIContext();
  const { account, isConnected, displayName } = useWalletContext();
  const [limit, setLimit] = useState(0);
  const [selectedResource, setResource] = useState<number>();
  const [selectFilter, setFilter] = useState<string>("tokenId");

  const animation = useSpring({
    opacity: empireMenu ? 1 : 0,
    transform: empireMenu ? `translateY(0)` : `translateY(-200%)`,
  });

  const addToFilter = (value: any) => {
    console.log(selectedResource);
    if (value === selectedResource) {
      return setResource(undefined);
    } else {
      return setResource(value);
    }
  };

  const list = Resources.map((res: any, index) => (
    <button
      key={index}
      className={` p-1 mb-2 pl-4 pr-4 rounded-xl tracking-widest  mr-2 hover:bg-white/30 transition-all duration-150 uppercase font-body hover:background-animate bg-white/30 ${
        selectedResource === res.id ? res.colourClass : " "
      } `}
      onClick={() => {setLimit(0); addToFilter(res.id)}}
    >
      {res.trait}
    </button>
  ));

  const defaultVariables = (params?: RealmFilters) => {
    return {
      address: params?.address?.toLowerCase() || account.toLowerCase(),
      resources: selectedResource ? [selectedResource] : [],
      orders: params?.orders?.length
        ? params?.orders
        : [
            "Power",
            "Giants",
            "Titans",
            "Skill",
            "Perfection",
            "Brilliance",
            "Enlightenment",
            "Protection",
            "Anger",
            "Rage",
            "Fury",
            "Vitriol",
            "the Fox",
            "Detection",
            "Reflection",
            "the Twins",
          ],
      first: 12,
      skip: limit,
      orderBy: selectFilter,
      orderDirection: params?.orderDirection || "asc",
    };
  };

  const { loading, error, data, fetchMore, networkStatus } = useQuery<WalletRealmsData>(
    getRealmsQuery,
    {
      variables: defaultVariables(),
      skip: !isConnected,
      ssr: false,
      notifyOnNetworkStatusChange: true,
    }
  );

  const isRefetching = networkStatus === 3;

  const grids =
    "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 xl:gap-6";

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

        <div>
          <h4 className="mb-2">filter by resource</h4>
          <div className="flex flex-wrap mb-8">{list}</div>
          <h4 className="mb-2">filter by</h4>
          {filterTypes.map((res: any, index) => (
            <button
              key={index}
              className={` p-1 h-12 mb-2 pl-4 pr-4 rounded-xl  mr-2 hover:bg-white/90 transition-all duration-300   ${
                selectFilter === res.key
                  ? "backdrop-blur-md bg-white/90 text-black"
                  : "backdrop-blur-md bg-white/30 text-off-100"
              } `}
              onClick={() => setFilter(res.key)}
            >
              {res.name}
            </button>
          ))}
        </div>
          
        <div>
            <div>
              <h4> Unstaked Realms ({data?.wallet?.realmsHeld})</h4>
              <div className={grids}>
                {data?.realms?.map((realm, index) => (
                  <RealmCard
                    realm={realm!}
                    key={index}
                    loading={isRefetching}
                    size="small"
                    onClick={props.onClick}
                  />
                ))}
              </div>
              <h4> Staked Realms ({data?.wallet?.bridgedRealmsHeld})</h4>
              <div className={grids}>
                {data?.bridgedRealms?.map((realm, index) => (
                  <RealmCard
                    realm={realm!}
                    key={index}
                    loading={loading}
                    size="small"
                    onClick={props.onClick}
                  />
                ))}
              </div>
              {isRefetching && (
                <div>
                              <div className="h-64 pt-20 mb-4 rounded w-96 bg-white/40 animate-pulse" />
                              <div className="h-64 pt-20 mb-4 rounded w-96 bg-white/40 animate-pulse" />
                              <div className="h-64 pt-20 mb-4 rounded w-96 bg-white/40 animate-pulse" />
                              <div className="h-64 pt-20 mb-4 rounded w-96 bg-white/40 animate-pulse" />
                              </div>
                          )}
            </div>
        
          <p>{loading}</p>

          {data && (
            <button
              onClick={() => {
                fetchMore({
                  variables: {
                    skip: limit + 12,
                  }
                });
                setLimit(limit + 12)
              }}
              className="w-full p-4 bg-gray-600 rounded"
            >
              Load more
            </button>
          )}
        </div>
        
      </div>
    </animated.div>
  );
};
