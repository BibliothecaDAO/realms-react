import 'moment-timezone';
import type { LoreEntityFragmentFragment } from '@/generated/graphql';
import { LoreEntityCard } from '../cards/LoreEntityCard';

interface LoreEntitiesOverviewsProps {
  entities: LoreEntityFragmentFragment[];
}

export function LoreEntitiesOverview(props: LoreEntitiesOverviewsProps) {
  return (
    <>
      {props.entities &&
        props.entities.map((loreEntity: LoreEntityFragmentFragment, index) => (
          <LoreEntityCard key={index} entity={loreEntity} />
        ))}
    </>
  );
}
