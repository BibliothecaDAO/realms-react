// Import your Client Component
import { BasePanel } from '@/app/components/ui/BasePanel';
import { ResourceSwapSideBar } from '@/components/sidebars/ResourceSwapSideBar';
import { ResourceProvider } from '@/context/ResourcesContext';
import { getExchangeRates } from '@/lib/amm/getExchangeRates';
import { getHistoricPrices } from '@/lib/amm/getHistoricPrices';
import { BankPanel } from './BankPanel';

export default async function Page() {
  const exchangeInfo = await getExchangeRates();
  const historicPrices = await getHistoricPrices();
  return (
    <BasePanel open={true} style="lg:w-7/12 p-10">
      <ResourceProvider>
        <BankPanel
          historicPrices={historicPrices}
          exchangeInfo={exchangeInfo}
        />
        {/* // TODO: Re-enable
            // onCloseClick; */}
        <ResourceSwapSideBar isOpen={true /* isSwapOpen */} />
      </ResourceProvider>
    </BasePanel>
  );
}
