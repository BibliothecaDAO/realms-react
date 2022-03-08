import { useUIContext } from "~/hooks/useUIContext";
import { MouseEventHandler, useState, useRef, useEffect } from "react";
import { Resources } from "~/util/resources";
import { useQuery } from "@apollo/client";
import { WalletRealmsData, RealmFilters } from "~/types";
import { getRealmsQuery } from "~/hooks/graphql/queries";
import Menu from "../public/svg/menu.svg";
import { useWalletContext } from "~/hooks/useWalletContext";
import { Realm as RealmCard } from "~/components/realms/Realm";
import { animated, useSpring } from "@react-spring/web";
import { CryptsEmpire } from "./CryptsEmpire";

import useIntersectionObserver from "~/hooks/useIntersectionObserver";

const filterTypes = [
  { name: "Rarity", key: "rarityRank" },
  { name: "Token Id", key: "tokenId" },
];
type Props = {
  onClick?: (event: any, id: string) => void;
};

export const RealmsEmpire = (props: Props) => {
  const { account, isConnected, displayName } = useWalletContext();
  const [limit, setLimit] = useState(0);
  const [selectedResource, setResource] = useState<number>();
  const [selectFilter, setFilter] = useState<string>("tokenId");

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
      onClick={() => {
        setLimit(0);
        addToFilter(res.id);
      }}
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
      first: 25,
      skip: limit,
      orderBy: selectFilter,
      orderDirection: params?.orderDirection || "asc",
    };
  };

  const { loading, error, data, fetchMore, networkStatus } =
    useQuery<WalletRealmsData>(getRealmsQuery, {
      variables: defaultVariables(),
      skip: !isConnected,
      ssr: false,
      notifyOnNetworkStatusChange: true,
    });

  const isRefetching = networkStatus === 3;

  const ref = useRef<HTMLButtonElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;
  /*useEffect(() => {
    isVisible && !loading && console.log("visible now");

    fetchMore({
      variables: {
        skip: limit + 25,
        first: 0,
      },
    });
    setLimit(limit + 25);
  }, [isVisible]);*/

  const grids =
    "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 xl:gap-6";

  return (
    <div>
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
          <div className="flex justify-around">
            <button
              onClick={() => {
                fetchMore({
                  variables: {
                    skip: limit + 25,
                  },
                });
                setLimit(limit + 25);
              }}
              className="px-4 py-2 rounded bg-gray-600/40 hover:bg-gray-600/60"
            >
              {loading ? "Loading" : "Load more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
