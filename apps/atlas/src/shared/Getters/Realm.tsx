import type { RealmFragmentFragment } from '@/generated/graphql';

export const realmStatus = (realm: RealmFragmentFragment) => {
  if (realm.bridgedOwner) {
    return 'Bridge Pending';
  }
  if (realm.settledOwner) {
    return 'Settled L2';
  }
  if (realm.ownerL2) {
    return 'Unsettled L2';
  } else {
    return 'Layer 1';
  }
};

interface TraitProps {
  title: string;
  traitAmount?: number;
  traitMax: number;
  colour: string;
}

export const TraitTable = (props: TraitProps) => {
  return (
    <div>
      <span className="flex justify-between">
        <span className="uppercase">{props.title} </span>
        <span>
          {props.traitAmount} / {props.traitMax}{' '}
        </span>
      </span>
      <div className="w-full my-2 bg-gray-200 rounded">
        <div
          className={`h-2  ${props.colour}`}
          style={{
            width: `${((props.traitAmount as any) / props.traitMax) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};
