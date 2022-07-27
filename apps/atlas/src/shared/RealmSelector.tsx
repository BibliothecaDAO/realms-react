import type { GetRealmsQuery } from '@/generated/graphql';
import useRealms from '@/hooks/settling/useRealms';

type Props = {
  onSelect: (selected: GetRealmsQuery['realms']) => void;
};

const RealmSelector = (props: Props) => {
  const realms = useRealms();
  return (
    <div className="w-full">
      {realms.data &&
        !realms.loading &&
        realms.data.realms.map((r) => (
          <button
            onClick={() => props.onSelect([r])}
            className="w-full border hover:bg-gray-500 p-4"
            key={r.realmId}
          >
            {r.name}
          </button>
        ))}
    </div>
  );
};

export default RealmSelector;
