import Base from '@/pages/index';
import { RealmBannerHeading } from '@/shared/RealmBannerHeading';
import { dummySquad } from '@/shared/squad/DummySquad';
import { SquadBuilder } from '@/shared/squad/Squad';

interface DataCardProps {
  title: string;
  value: string;
  className?: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = (props: CardProps) => {
  return (
    <div
      className={`flex flex-wrap p-4 text-gray-600 bg-white rounded shadow-sm bg-opacity-30 ${props.className}`}
    >
      {props.children}
    </div>
  );
};

export const DataCard = (props: DataCardProps) => {
  return (
    <>
      <div className="w-full text-2xl font-semibold tracking-widest text-white uppercase">
        {props.title}
      </div>
      <div className="w-full pt-4 text-5xl text-right text-white">
        {props.value}
      </div>
    </>
  );
};

export default function RealmsPage() {
  return (
    <Base>
      <div className="absolute top-0 z-20 flex w-full h-full bg-hero">
        <div className="w-8/12 p-8">
          <RealmBannerHeading order="the fox" title="Smutmum" />
          <div className="grid grid-flow-col grid-cols-6 gap-4 py-4">
            <Card className="col-start-1 col-end-4">
              <DataCard title="raids" value="2" />
            </Card>
            <Card className="col-start-4 col-end-7">
              <DataCard title="raids" value="2" />
            </Card>
            <Card className="col-start-4 col-end-7 row-span-2">
              <DataCard title="raids" value="2" />
            </Card>
            <Card className="col-start-1 col-end-4">
              <DataCard title="raids" value="2" />
            </Card>
            <Card className="col-start-1 col-end-4">
              <DataCard title="raids" value="2" />
            </Card>

            <SquadBuilder
              className="col-start-1 col-end-7"
              troops={dummySquad}
            />
          </div>
        </div>
        <div className="w-4/12 p-8">
          <Card className="col-start-1 col-end-4">
            <DataCard title="raids" value="2" />
          </Card>
        </div>
      </div>
    </Base>
  );
}
