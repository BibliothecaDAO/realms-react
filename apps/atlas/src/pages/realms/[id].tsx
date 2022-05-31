import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardStats,
  CardIcon,
} from '@bibliotheca-dao/ui-lib';
import { Button, OrderIcon } from '@bibliotheca-dao/ui-lib/base';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RealmCard } from '@/components/cards/RealmCard';
import { RealmHistory } from '@/components/tables/RealmHistory';
import { useGetRealmQuery } from '@/generated/graphql';
import Base from '@/pages/index';
import { RealmBannerHeading } from '@/shared/RealmBannerHeading';
import { dummySquad, dummyDefenceSquad } from '@/shared/squad/DummySquad';
import { SquadBuilder } from '@/shared/squad/Squad';
import { shortenAddress } from '@/util/formatters';

interface DataCardProps {
  title: string;
  value: string;
  className?: string;
  icon?: string;
}

export const DataCard = (props: DataCardProps) => {
  return (
    <>
      <div className="z-20 w-full text-2xl font-semibold tracking-widest text-white uppercase font-lords ">
        {props.title}
      </div>
      <div className="w-full pt-4 pr-10 text-5xl text-right text-white">
        {props.value}
      </div>
      {props.icon && (
        <div className="relative left-0 w-full bottom-20">
          <div className="absolute left-0">
            <Helm className="w-32 h-32 fill-order-perfection opacity-20" />
          </div>
        </div>
      )}
    </>
  );
};

export default function RealmsPage() {
  const [squad, setSquad] = useState(false);
  const { query } = useRouter();

  const realmId = parseInt(query.id as string);

  const { data: realmData } = useGetRealmQuery({ variables: { id: realmId } });
  const realm = realmData?.getRealm;

  const attackSquad =
    realm?.squad?.filter((squad) => squad.squadSlot === 1) ?? [];
  const defenseSquad =
    realm?.squad?.filter((squad) => squad.squadSlot === 2) ?? [];
  return (
    <Base>
      <div className="absolute z-20 grid w-full h-full grid-cols-6 gap-8 p-6 overflow-auto bg-cover bg-hero">
        <div className="col-start-1 col-end-5">
          <RealmBannerHeading
            key={realm?.realmId ?? ''}
            order={realm?.orderType?.replaceAll('_', ' ').toLowerCase() ?? ''}
            title={realm?.name ?? ''}
            realmId={realmId}
          />
          <div className="grid grid-flow-col grid-cols-6 gap-6 py-4">
            <div className="col-start-1 col-end-4">
              <Image
                src={`https://d23fdhqc1jb9no.cloudfront.net/renders_webp/${realmId}.webp`}
                alt="map"
                className="w-full mt-4 rounded-xl -scale-x-100"
                width={500}
                height={320}
                layout={'responsive'}
              />
            </div>
            <Card className="col-start-4 col-end-7">
              <CardTitle>Owner</CardTitle>
              <CardStats>
                {shortenAddress(realm?.owner ? realm.owner : '0')}
              </CardStats>
              {/* <CardIcon /> */}
            </Card>
            <Card className="col-start-4 col-end-7">
              <CardTitle>Realm State</CardTitle>
              <CardStats>Settled</CardStats>
            </Card>
            <Card className="col-start-1 col-end-2 ">
              <CardTitle>Happiness</CardTitle>
              <CardStats>2</CardStats>
              {/* <CardIcon /> */}
            </Card>
            <Card className="col-start-2 col-end-4 ">
              <CardTitle>Last Raided</CardTitle>
              <CardStats>2</CardStats>
              {/* <CardIcon /> */}
            </Card>
            {/* {realmData && realmData.getRealm && (
              <RealmCard realm={realmData!.getRealm} loading={false} />
            )} */}

            <Card className="col-start-1 col-end-7">
              <div className="flex justify-between w-full mb-10">
                <div className="text-2xl font-semibold tracking-widest text-white uppercase font-lords">
                  Military Strength
                </div>
                <div className="text-xl font-semibold tracking-widest text-white uppercase ">
                  {squad ? <span>Attacking</span> : <span>Defending</span>}{' '}
                  Squad
                  <Button
                    className="ml-4"
                    variant="secondary"
                    size="xs"
                    onClick={() => setSquad(!squad)}
                  >
                    change
                  </Button>
                </div>
              </div>
              {squad ? (
                <SquadBuilder troops={attackSquad} />
              ) : (
                <SquadBuilder troops={defenseSquad} />
              )}
            </Card>
            {/* <Card className="col-start-1 col-end-7">
              <div className="flex justify-between w-full ">
                <div className="text-2xl font-semibold tracking-widest text-white uppercase">
                  Troop Cart [this should be in popup]
                </div>
              </div>
              <SquadBuilder troops={[]} />
            </Card> */}
          </div>
        </div>
        <div className="grid grid-cols-6 col-start-5 col-end-7">
          <Card className="col-start-1 col-end-7">
            <div className="w-full">
              <h2 className="text-center text-white font-lords">History</h2>
              <RealmHistory realmId={realmId} />
            </div>

            {/* <DataCard title="history" value="2" /> */}
          </Card>
        </div>
      </div>
    </Base>
  );
}
