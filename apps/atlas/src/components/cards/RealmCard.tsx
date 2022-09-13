import { OrderIcon, Tabs, ResourceIcon, Button } from '@bibliotheca-dao/ui-lib';
import Castle from '@bibliotheca-dao/ui-lib/icons/castle.svg';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Library from '@bibliotheca-dao/ui-lib/icons/library.svg';
import Relic from '@bibliotheca-dao/ui-lib/icons/relic.svg';
import Scroll from '@bibliotheca-dao/ui-lib/icons/scroll-svgrepo-com.svg';
import Sickle from '@bibliotheca-dao/ui-lib/icons/sickle.svg';
import type { ReactElement } from 'react';
import React, { useMemo } from 'react';
import {
  RealmHistory,
  RealmOverview,
  RealmTravel,
  RealmLore,
} from '@/components/panels/Realms/details';
import { RealmResources } from '@/components/tables/RealmResources';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import type { RealmsCardProps } from '../../types';

export function RealmCard(props: RealmsCardProps): ReactElement {
  const ensData = useEnsResolver(props.realm?.owner as string);

  const tabs = useMemo(
    () => [
      {
        label: <Castle className="self-center w-6 h-6 fill-current" />,
        component: <RealmOverview {...props} />,
      },
      {
        label: <Sickle className="self-center w-6 h-6 fill-current" />,
        component: (
          <RealmResources
            showRaidable
            showClaimable
            realm={props.realm}
            loading={props.loading}
          />
        ),
      },
      {
        label: <Globe className="self-center w-6 h-6 fill-current" />,
        component: <RealmTravel realm={props.realm} />,
      },
      {
        label: <Scroll className="self-center w-6 h-6 fill-current" />,
        component: <RealmHistory realmId={props.realm.realmId} />,
      },
      {
        label: <Library className="self-center w-6 h-6 fill-current" />,
        component: (
          <RealmLore
            realmName={props.realm.name || ''}
            realmId={props.realm.realmId || 0}
          />
        ),
      },
    ],
    [props.realm?.realmId]
  );
  return (
    <div>
      {props.realm?.wonder && (
        <div className="w-full p-4 text-2xl font-semibold text-center uppercase bg-black border-4 rounded shadow-inner tracking-veryWide">
          {props.realm?.wonder}
        </div>
      )}

      {/* <div className="my-2 text-xs font-semibold tracking-widest uppercase">
            {RealmStatus(props.realm)}
          </div> */}

      {/* <div className="flex justify-between">
        <h1>
          {props.realm.realmId} | {props.realm.name}{' '}
        </h1>
        {props.realm.owner && (
          <h3 className="self-center my-2 ml-auto">{ensData.displayName}</h3>
        )}
        <div className="self-center">
          <OrderIcon size="lg" order={props.realm.orderType.toLowerCase()} />
        </div>
      </div> */}

      <Tabs variant="default">
        <Tabs.List className="">
          {tabs.map((tab, index) => (
            <Tabs.Tab key={index} className="uppercase">
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {/* <div className="flex flex-col justify-between px-4 py-2 mb-2 font-semibold uppercase rounded shadow-inner sm:flex-row">
          <span>
            Rank:
            <span className="">{props.realm.rarityRank}</span>
          </span>
          <span>
            Score:
            <span className="">{props.realm.rarityScore}</span>
          </span>
        </div> */}

        <Tabs.Panels>
          {tabs.map((tab, index) => (
            <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs>
    </div>
  );
}
