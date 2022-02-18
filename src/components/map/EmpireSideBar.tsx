import { useUIContext } from "~/hooks/useUIContext";
import { MouseEventHandler, useState } from "react";

import { useQuery } from "@apollo/client";
import { WalletRealmsData, RealmFilters } from "~/types";
import { getRealmsQuery } from "~/hooks/graphql/queries";
import Menu from "../public/svg/menu.svg";
import { useWalletContext } from "~/hooks/useWalletContext";
import { Realm as RealmCard } from "~/components/realms/Realm";
import { animated, useSpring } from '@react-spring/web'

export const EmpireSideBar = () => {
  const { toggleEmpireMenu, empireMenu } = useUIContext();
  const {
    account,
    isConnected,
    displayName,
} = useWalletContext();

const animation = useSpring({
    opacity: empireMenu ? 1 : 0,
    transform: empireMenu ? `translateY(0)` : `translateY(-200%)`
  });

const defaultVariables = (params?: RealmFilters) => {
    return {
      address: params?.address?.toLowerCase() || account.toLowerCase(),
      resources: params?.resources || [],
      orders: params?.orders?.length
        ? params?.orders
        : [
            'Power',
            'Giants',
            'Titans',
            'Skill',
            'Perfection',
            'Brilliance',
            'Enlightenment',
            'Protection',
            'Anger',
            'Rage',
            'Fury',
            'Vitriol',
            'the Fox',
            'Detection',
            'Reflection',
            'the Twins',
          ],
      first: params?.first || 12,
      skip: params?.skip || 0,
      orderBy: params?.orderBy || 'tokenId',
      orderDirection: params?.orderDirection || 'asc',
    }
  }

const { loading, error, data } = useQuery<WalletRealmsData>(getRealmsQuery, {
    variables: defaultVariables(),
    skip: !isConnected,
    ssr: false,
});

  return (
    <animated.div className="relative z-40" style={animation}>
          <div
        className={`h-screen w-full z-40 relative p-6  backdrop-blur-md bg-off-200/30 rounded-r-2xl overflow-y-scroll`}
      >
        <button
          className="z-10 p-4 mb-8 transition-all rounded bg-white/20 hover:bg-white/70"
          onClick={toggleEmpireMenu}
        >
          Close
        </button>
        <h1 className="mb-4">My Empire</h1>
        {!data && (loading ) ? (
            <p>Loading</p>
        ) : (
            <div>
                {data && (
                    <div>
                    <h2> Unstaked Realms ({data?.wallet?.realmsHeld })</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 xl:gap-6">
                        {data.realms.map((realm, index) => (
                            <RealmCard className="col-3" realm={realm!} key={realm!.id} loading={loading} />
                        ))}
                    </div>
                    <h2> Staked Realms ({data?.wallet?.bridgedRealmsHeld })</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 xl:gap-6">
                    {data.bridgedRealms.map((realm, index) => (
                        <RealmCard className="col-3" realm={realm!} key={realm!.id} loading={loading} />
                    ))}
                    </div>
                    </div>
                )
                }   

            </div>
        )}
      </div>
    </animated.div>

  );
};
