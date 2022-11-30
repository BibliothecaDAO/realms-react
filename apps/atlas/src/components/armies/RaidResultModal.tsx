import { RaidResults } from '@/components/armies/RaidResults';

export const RaidResultModal = ({ attackingRealmId, tx }) => {
  return (
    <div className="flex flex-wrap px-4 bg-gray/800">
      <RaidResults fromAttackRealmId={attackingRealmId} tx={tx} />
    </div>
  );
};
