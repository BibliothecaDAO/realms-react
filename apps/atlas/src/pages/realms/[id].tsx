import { Button, OrderIcon } from '@bibliotheca-dao/ui-lib/base';
import Helm from '@bibliotheca-dao/ui-lib/icons/helm.svg';
import { useState } from 'react';
import { RealmHistory } from '@/components/tables/RealmHistory';
import Base from '@/pages/index';
import { RealmBannerHeading } from '@/shared/RealmBannerHeading';
import { dummySquad, dummyDefenceSquad } from '@/shared/squad/DummySquad';
import { SquadBuilder } from '@/shared/squad/Squad';

interface DataCardProps {
  title: string;
  value: string;
  className?: string;
  icon?: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = (props: CardProps) => {
  return (
    <div
      className={`duration-150 transition-all  hover:bg-gray-600/60 flex flex-wrap p-4 text-gray-600 bg-white/30 rounded shadow-sm border-l-4 border-double ${props.className} overflow-hidden`}
    >
      {props.children}
    </div>
  );
};

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
            <Helm className="w-32 h-32 fill-orange-300 opacity-20" />
          </div>
        </div>
      )}
    </>
  );
};

export default function RealmsPage() {
  const [squad, setSquad] = useState(false);

  return (
    <Base>
      <div className="absolute top-0 z-20 grid w-full h-full grid-cols-6 gap-5 p-6 overflow-auto bg-hero">
        <div className="col-start-1 col-end-5">
          <RealmBannerHeading order="the fox" title="Smutmum" />
          <div className="grid grid-flow-col grid-cols-6 gap-4 py-4">
            <Card className="col-start-1 col-end-3">
              <DataCard icon="attack" title="Attacks Won" value="2" />
            </Card>
            <Card className="col-start-3 col-end-5">
              <DataCard icon="attack" title="Defended" value="2" />
            </Card>{' '}
            <Card className="col-start-5 col-end-7">
              <DataCard icon="attack" title="Raided" value="2" />
            </Card>
            <Card className="col-start-4 col-end-7">
              <DataCard title="Vault days" value="2" />
            </Card>
            <Card className="col-start-1 col-end-3">
              <DataCard icon="happiness" title="happiness" value="2" />
            </Card>
            <Card className="col-start-3 col-end-4">
              <DataCard title="raids" value="2" />
            </Card>
            <Card className="col-start-1 col-end-7">
              <div className="flex justify-between w-full ">
                <div className="text-2xl font-semibold tracking-widest text-white uppercase">
                  squads
                </div>
                <div className="text-2xl font-semibold tracking-widest text-white uppercase font-display">
                  {squad ? <span>Attacking</span> : <span>Defending</span>}

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
                <SquadBuilder troops={dummySquad} />
              ) : (
                <SquadBuilder troops={dummyDefenceSquad} />
              )}
            </Card>
            <Card className="col-start-1 col-end-7">
              <div className="flex justify-between w-full ">
                <div className="text-2xl font-semibold tracking-widest text-white uppercase">
                  Troop Cart [this should be in popup]
                </div>
              </div>
              <SquadBuilder troops={[]} />
            </Card>
          </div>
        </div>
        <div className="grid col-start-5 col-end-7 gap-5">
          <Card className="w-full">
            <div>
              <h2 className="text-center text-white">History</h2>
              <RealmHistory />
            </div>

            {/* <DataCard title="history" value="2" /> */}
          </Card>
          <Card className="w-full">
            <DataCard title="buildings" value="2" />
          </Card>
        </div>
      </div>
    </Base>
  );
}
