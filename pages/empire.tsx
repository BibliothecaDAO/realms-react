

import React, { useState, useCallback, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { WalletRealmsData, RealmFilters } from "~/types";
import { getRealmsQuery } from "~/hooks/graphql/queries";
import Menu from "../public/svg/menu.svg";
import { useWalletContext } from "~/hooks/useWalletContext";
import { Header } from "~/components/navigation/header";
import { Realm as RealmCard } from "~/components/realms/Realm";

function Empire() {
    const {
        account,
        isConnected,
        displayName,
    } = useWalletContext();

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
        <>
        {!data && (loading ) ? (
            <p>Loading</p>
        ) : (
            <div>
                <Header />
                <h1 className="top-0 z-10 w-full pt-8 text-6xl text-center">
                    Empire
                </h1>
                {data && (
                    <div>
                    <h2> Unstaked Realms</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 xl:gap-6">
                        {data.realms.map((realm, index) => (
                            <RealmCard className="col-3" realm={realm!} key={realm!.id} loading={loading} />
                        ))}
                    </div>
                    <h2> Staked Realms</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 xl:gap-6">
                    {data.bridgedRealms.map((realm, index) => (
                        <RealmCard className="col-3" realm={realm!} key={realm!.id} loading={loading} />
                    ))}
                    </div>
                    </div>
                )
                }   

            </div>
        )}
        </>
    );
}

export default Empire