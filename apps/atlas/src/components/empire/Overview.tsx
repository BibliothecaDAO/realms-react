import { CardBody } from '@bibliotheca-dao/ui-lib';
import { useAccount } from '@starknet-react/core';
import { generateRealmEvent } from '@/components/realms/EventMappings';
import { HistoryCard } from '@/components/realms/HistoryCard';
import { getAccountHex } from '@/components/realms/RealmsGetters';
import { useGetAccountQuery, useGetRealmsQuery } from '@/generated/graphql';
import { MyRealms } from './MyRealms';

export function AccountOverview() {
  const { address } = useAccount();

  const filter = {
    OR: [
      { ownerL2: { equals: getAccountHex(address || '0x0') } },
      { settledOwner: { equals: getAccountHex(address || '0x0') } },
    ],
  };
  const { data: realmsData } = useGetRealmsQuery({ variables: { filter } });

  const realmIds = realmsData?.realms?.map((realm) => realm.realmId) ?? [];

  const { data: accountData, loading: loadingData } = useGetAccountQuery({
    variables: { account: address ? getAccountHex(address) : '', realmIds },
    pollInterval: 5000,
    skip: !address,
  });

  const events = (accountData?.accountHistory ?? [])
    .map((realmEvent) => {
      return {
        ...generateRealmEvent(realmEvent, true),
        timestamp: realmEvent.timestamp,
        eventId: realmEvent.eventId,
      };
    })
    .filter((row) => row.event !== '');

  return (
    <div className="grid grid-cols-12 gap-3 md:gap-4 md:grid-cols-12">
      <div className={`col-start-1 col-end-13 md:col-start-1 md:col-end-7 `}>
        <div className="p-4 mb-8 ">
          <h2>Your Settled Realms</h2>
          <div className="px-10 mt-4 text-xl italic">
            "Would you like to inspect your lands?"
          </div>
        </div>
        <MyRealms />
      </div>
      <div className={`col-start-1 col-end-13 md:col-start-7 md:col-end-13 `}>
        <div className="p-4 mb-8 ">
          <h2>Vizir Reports</h2>
          <div className="px-10 mt-4 text-xl italic ">
            "Your Majesty, we have been busy since you have been away."
          </div>
        </div>

        <CardBody className="h-screen overflow-y-auto">
          {events
            ? events.map((a, index) => {
                return (
                  <HistoryCard
                    key={index}
                    timeStamp={a.timestamp}
                    event={a.event}
                    eventId={a.eventId}
                    action={a.action}
                    image={a.image}
                  >
                    {a.relic}
                    {a.resources}
                  </HistoryCard>
                );
              })
            : 'loading'}
        </CardBody>
      </div>
    </div>
  );
}
