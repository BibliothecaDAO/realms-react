import { LoreEntityCard } from '@/components/lore/LoreEntityCard';
import type { LoreEntityFragmentFragment } from '@/generated/graphql';

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
