import type { RealmFragmentFragment } from '@/generated/graphql';
import { RealmListCardView } from '../cards/realms/RealmListViewCard';

interface RealmOverviewsProps {
  realms: RealmFragmentFragment[];
  isYourRealms?: boolean;
}

export function RealmOverviews(props: RealmOverviewsProps) {
  // Filtering out old realms
  const usedRealms = [897, 5455, 555, 7, 2];

  const filteredRealms = props.realms.filter(
    (item) => !usedRealms.includes(item.realmId)
  );

  return (
    <div className="grid grid-cols-12 gap-6 p-6 ">
      {props.realms &&
        filteredRealms.map((realm: RealmFragmentFragment, index) => (
          <RealmListCardView key={index} realm={realm} />
        ))}
    </div>
  );
}
