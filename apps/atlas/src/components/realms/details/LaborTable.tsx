import { Button, ResourceIcon, OrderIcon } from '@bibliotheca-dao/ui-lib';
import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import LordsIcon from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import { formatEther } from '@ethersproject/units';

import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Fragment, useMemo } from 'react';
import { vaultValueAtMarketprice } from '@/components/bank/BankGetters';
import { RateChange } from '@/components/bank/BankPanel';
import { Pulse } from '@/components/ui/Pulse';
import {
  BASE_FOOD_PRODUCTION,
  BASE_RESOURCES_PER_CYCLE,
  BASE_RESOURCES_PER_DAY,
  VAULT_LENGTH,
} from '@/constants/globals';
import { findResourceById, ResourcesIds } from '@/constants/resources';
import { useUserBalancesContext } from '@/context/UserBalancesContext';
import type { RealmFragmentFragment } from '@/generated/graphql';
import { useMarketRate } from '@/hooks/market/useMarketRate';
import { useGameConstants } from '@/hooks/settling/useGameConstants';
import useLabor from '@/hooks/settling/useLabor';
import {
  getLaborUnitsGenerated,
  CostBlock,
  getLaborGenerated,
  getUnproducedLabor,
  getIsFood,
  convertToK,
  getTrait,
  getRealmOrderById,
} from '../RealmsGetters';
import { BuyLabor } from './BuyLabor';
import { HarvestButton } from './HarvestButton';
import { LaborRow, LaborValues } from './LaborValues';

type Prop = {
  resourceId: number;
  realmsResources: Array<RealmFragmentFragment>;
};

const getGeneratingClass = (isGenerating) =>
  isGenerating
    ? 'bg-green-900/30 border-green-200/10'
    : 'bg-red-900/30 border-red-200/10';

const getHasGeneratedClass = (hasGenerated) =>
  hasGenerated
    ? 'bg-green-900/30 border-green-200/10'
    : 'bg-red-900/30 border-red-200/10';

export const LaborTable = (props: Prop) => {
  const { resourceId, realmsResources } = props;
  const resource = findResourceById(resourceId);

  const { getBalanceById } = useUserBalancesContext();

  const { gameConstants } = useGameConstants();

  const {
    getTotalLordsCost,
    getLordsCostForResourceAmount,
    getCurrentMarketById,
  } = useMarketRate();

  const costs = gameConstants?.laborAndToolCosts.find(
    (a) => a.resourceId === resourceId
  )?.costs;

  const totalLordsCostOfLabor = getTotalLordsCost({
    costs: costs,
    qty: 1,
  });

  const lordsReturnFromLabor = getLordsCostForResourceAmount({
    resourceId,
    qty: BASE_RESOURCES_PER_DAY,
  });

  const currentMarketPriceForResource = getCurrentMarketById({
    resourceId,
  });

  const laborProfit = lordsReturnFromLabor - totalLordsCostOfLabor;

  const laborProfitMargin = 1 - totalLordsCostOfLabor / lordsReturnFromLabor;

  const isFood = getIsFood(resourceId);

  const productionAmount = isFood
    ? BASE_FOOD_PRODUCTION
    : BASE_RESOURCES_PER_CYCLE;

  const generatedLabors = useMemo(() => {
    const labors = realmsResources.map((realm) => {
      const resource = realm.resources?.find(
        (resource) => resource.resourceId === resourceId
      );

      const generation = getLaborGenerated({
        last_harvest: resource?.labor?.lastUpdate,
        labor_balance: resource?.labor?.balance,
      });

      const isGenerating = generation[1] > 0;

      const hasGenerated = generation[0] > 0;

      return {
        generated: generation[0],
        generating: generation[1],
        vaultValueAtMarketprice: vaultValueAtMarketprice({
          currentPrice: currentMarketPriceForResource?.amount,
          units: getLaborUnitsGenerated(resource?.labor?.vaultBalance),
        }),
        vault:
          getLaborUnitsGenerated(resource?.labor?.vaultBalance) *
            productionAmount || 0,
        isGenerating,
        hasGenerated,
        qtyBuilt: resource?.labor?.qtyBuilt || 0,
        maxBuildings:
          resource?.resourceId == ResourcesIds.Fish
            ? getTrait(realm, 'Harbor')
            : getTrait(realm, 'River'),
      };
    });

    return {
      labors,
      generated: labors.reduce((a, b) => a + b.generated, 0),
      generating: labors.reduce((a, b) => a + b.generating, 0),
      isGenerating: labors.some((labor) => labor.isGenerating),
      hasGenerated: labors.some((labor) => labor.hasGenerated),
      vaultValueAtMarketprice: labors.reduce(
        (a, b) => a + b.vaultValueAtMarketprice,
        0
      ),
      vault: labors.reduce((a, b) => a + b.vault, 0),
      qtyBuilt: labors.reduce((a, b) => a + b.qtyBuilt, 0),
      maxBuildings: labors.reduce((a, b) => a + b.maxBuildings, 0),
    };
  }, [realmsResources]);

  // const newTable = resources?.map((resource) => {
  //   return {
  //     resource: (
  //       <div>
  //         <div className="flex justify-between">
  //           <div className="pr-3">
  //             <div className="flex">
  //               <div className="self-center">
  //                 <ResourceIcon
  //                   resource={resource?.resourceName?.replace(' ', '') || ''}
  //                   size="md"
  //                 />
  //               </div>
  //               <div className="px-3 text-xl ">
  //                 <span className="truncate">{resource.resourceName}</span>{' '}
  //                 <br />
  //                 <span className="text-base text-gray-600">
  //                   {convertToK(
  //                     +formatEther(
  //                       getBalanceById(resource.resourceId)?.amount || '0'
  //                     ).toString()
  //                   )}
  //                 </span>
  //               </div>
  //             </div>

  //             <div className="p-2 mt-2 border rounded border-black/10 bg-gray-1000">
  //               <div className="flex justify-between text-base">
  //                 <span className="text-gray-600">Margin:</span>{' '}
  //                 <span>{(laborProfitMargin * 100).toFixed(1)}%</span>
  //               </div>
  //               <hr className="my-1 opacity-20" />
  //               <div className="flex justify-between">
  //                 <span className="mr-2 text-base">
  //                   {(+formatEther(
  //                     currentMarketPriceForResource?.amount || '0'
  //                   )).toFixed(2)}{' '}
  //                 </span>
  //                 <div className="self-center">
  //                   <RateChange
  //                     change={currentMarketPriceForResource?.percentChange24Hr}
  //                   />
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //           <div className="flex flex-col flex-grow space-y-2">
  //             <div
  //               className={`flex justify-between flex-grow w-full p-2 border rounded ${generatingClass}`}
  //             >
  // <div className="flex self-center mr-3 text-lg text-gray-600 capitalize ">
  //   {isGenerating ? 'producing' : 'idle'}{' '}
  //   <Pulse active={isGenerating} pulse={isGenerating} />
  // </div>
  //               <div>
  //                 <BuyLabor
  //                   realm={realm}
  //                   resource={resource}
  //                   costs={costs}
  //                   isFood={isFood}
  //                 />
  //               </div>
  //             </div>
  //             <div
  //               className={`flex justify-between flex-grow w-full p-2 border rounded  ${hasGeneratedClass}`}
  //             >
  //               <div className="flex-grow w-full">
  // <HarvestButton
  //   realmId={realm.realmId}
  //   resourceId={resource.resourceId}
  //   generation={
  //     isFood
  //       ? generation[0] *
  //         productionAmount *
  //         (resource.labor?.qtyBuilt || 1)
  //       : generation[0] * productionAmount
  //   }
  // />
  //               </div>
  //             </div>
  //             {!isFood ? (
  //               <div className="flex justify-between px-2 pt-1 text-lg">
  //                 <div>
  //                   Vault:{' '}
  //                   {(
  //                     getLaborUnitsGenerated(resource.labor?.vaultBalance) *
  //                       productionAmount || 0
  //                   ).toFixed()}
  //                   <span className="text-gray-600">
  //                     / {productionAmount * 12 * VAULT_LENGTH}
  //                   </span>
  //                 </div>

  //                 <div className="flex text-lg">
  //                   <div className="flex">
  //                     <Lords className="self-center mr-2 md:w-4 lg:w-5 fill-frame-primary" />
  //                     {valueAtMarketprice.toFixed(2)}
  //                   </div>
  //                 </div>
  //               </div>
  //             ) : (
  //               <div className="flex justify-between px-2 pt-1">
  //                 {resource.labor?.qtyBuilt} /{' '}
  //                 {resource.resourceId == ResourcesIds.Fish
  //                   ? getTrait(realm, 'Harbor')
  //                   : getTrait(realm, 'River')}{' '}
  //                 {resource.resourceId == ResourcesIds.Fish
  //                   ? 'Fishing Villages'
  //                   : 'Farms'}{' '}
  //                 Producing
  //               </div>
  //             )}
  //           </div>
  //         </div>

  //         <div className="w-full mt-2">
  //           <LaborValues
  //             labor_generated={generation[0]}
  //             part_labor={generation[1]}
  //             vault={generation[2]}
  //             remaining={getUnproducedLabor(resource.labor?.balance)}
  //           />
  //         </div>
  //       </div>
  //     ),
  //   };
  // });

  return (
    <div className="flex flex-col mb-4 border-4 rounded-xl border-white/10 hover:bg-gray-1000 group">
      <Disclosure>
        {({ open }) => (
          <>
            <div className="flex items-center">
              <div className="relative h-32 mr-4">
                <img
                  className="relative z-10 object-cover h-full rounded-xl"
                  src={`/resources/${resourceId}.jpg`}
                  alt={resource?.trait}
                />
                <div className="absolute top-0 right-0 z-10 w-16 h-full bg-gradient-to-r from-transparent to-gray-900 group-hover:to-gray-1000"></div>
              </div>
              <div className="flex flex-col mr-4">
                <div className="flex items-center">
                  <ResourceIcon size="xs" resource={resource?.trait || ''} />
                  <div className="ml-2 text-xl truncate">{resource?.trait}</div>
                </div>

                <div className="p-2 mt-2 border rounded border-black/10 bg-gray-1000">
                  <div className="flex justify-between space-x-2 text-base">
                    <span className="text-gray-600">Margin:</span>{' '}
                    <span>{(laborProfitMargin * 100).toFixed(1)}%</span>
                  </div>
                  <hr className="my-1 opacity-20" />
                  <div className="flex">
                    <LordsIcon className="w-3 fill-white" />
                    <div className="mx-2 text-base">
                      {(+formatEther(
                        currentMarketPriceForResource?.amount || '0'
                      )).toFixed(2)}{' '}
                    </div>
                    <div className="self-center ml-auto">
                      <RateChange
                        change={
                          currentMarketPriceForResource?.percentChange24Hr
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col mr-4">
                <div className="text-xl truncate">
                  {realmsResources.length > 1
                    ? `Available on ${realmsResources.length} Realms`
                    : ' '}
                  &nbsp;
                </div>
                <div className="p-2 mt-2 border rounded border-black/10 bg-gray-1000">
                  <div className="flex justify-between space-x-2 text-base">
                    <span className="text-gray-600">Current balance:</span>
                    {convertToK(
                      +formatEther(
                        getBalanceById(resource?.id as number)?.amount || '0'
                      ).toString()
                    )}
                  </div>
                  <hr className="my-1 opacity-20" />
                  <div className="flex space-x-2 text-base">
                    {isFood ? (
                      <>
                        {' '}
                        <div className="flex justify-between px-2 pt-1">
                          {generatedLabors.qtyBuilt} /{' '}
                          {generatedLabors.maxBuildings}{' '}
                          {resourceId == ResourcesIds.Fish
                            ? 'Fishing Villages'
                            : 'Farms'}{' '}
                          Producing
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-600">Vault:</span>{' '}
                        <span>{generatedLabors.vault.toFixed()}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col mr-4">
                <span className="text-xl truncate">&nbsp;</span>
                <div className="p-2 mt-2 border rounded border-black/10 bg-gray-1000">
                  <div className="flex space-x-2 text-base">
                    <span className="text-gray-600">Status:</span>{' '}
                    <div className="flex self-center mr-3 text-gray-600 capitalize ">
                      {generatedLabors.isGenerating ? 'producing' : 'idle'}{' '}
                      <Pulse
                        active={generatedLabors.isGenerating}
                        pulse={generatedLabors.isGenerating}
                      />
                    </div>
                  </div>
                  <hr className="my-1 opacity-20" />
                  <div className="flex justify-between space-x-2 text-base">
                    <span className="text-gray-600">Harvest:</span>
                    <span
                      className={getHasGeneratedClass(
                        generatedLabors.hasGenerated
                      )}
                    >
                      <HarvestButton
                        realmId={realmsResources[0].realmId}
                        resourceId={resourceId}
                        generation={
                          isFood
                            ? generatedLabors.generated *
                              productionAmount *
                              (generatedLabors.labors[0].qtyBuilt || 1)
                            : generatedLabors.generated * productionAmount
                        }
                      />
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col ml-auto mr-2">
                <BuyLabor
                  realms={realmsResources}
                  resource={{ ...resource, resourceId }}
                  costs={costs}
                  isFood={isFood}
                />
                <Disclosure.Button as={Fragment}>
                  <Button variant="outline" size="xs" className="mt-2">
                    {open ? 'Hide' : 'Expand'} details{' '}
                    <ChevronDownIcon
                      className={`${
                        open ? 'rotate-180 transform' : ''
                      } h-4 w-4 ml-1`}
                    />
                  </Button>
                </Disclosure.Button>
              </div>
            </div>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              {realmsResources.map((realm, i) => (
                <LaborRealmRow
                  key={realm.realmId}
                  costs={costs}
                  isFood={isFood}
                  realm={realm}
                  resource={{ ...resource, resourceId }}
                  laborBalance={generatedLabors.labors[i]}
                />
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export const CostsRow = ({ value, tooltipText, title }) => {
  return (
    <Tooltip
      placement="top"
      className="flex w-full"
      tooltipText={
        <div className="p-2 rounded bg-gray-1000">{tooltipText}</div>
      }
    >
      <div className="flex justify-between w-full rounded hover:bg-gray-1000">
        <span className="flex">
          <span className="mx-1 text-gray-600">{title}: </span>{' '}
        </span>
        {value}
      </div>
    </Tooltip>
  );
};

export const LaborRealmRow = ({
  realm,
  costs,
  resource,
  isFood,
  laborBalance,
}: {
  realm: RealmFragmentFragment;
  resource: any;
  costs: any;
  isFood: boolean;
  laborBalance: any;
}) => {
  const productionAmount = isFood
    ? BASE_FOOD_PRODUCTION
    : BASE_RESOURCES_PER_CYCLE;

  const remaining = getUnproducedLabor(laborBalance?.balance);

  return (
    <div className="flex items-center w-full p-2 mb-4 bg-gray-900 rounded hover:bg-gray-1000">
      <div className="p-2 mr-2 border rounded border-black/10 bg-gray-1000">
        <div className="flex space-x-2 text-base">
          <span className="text-gray-600">Realm:</span>{' '}
          <OrderIcon
            className="self-center mr-1"
            size="xs"
            order={getRealmOrderById(realm?.realmId) || ''}
          />
          <span className="truncate">
            {' '}
            {(realm?.name && realm?.name + ' #' + realm?.realmId) || '0'}
          </span>
        </div>
        <hr className="my-1 opacity-20" />
        <div className="flex justify-between space-x-2 text-base">
          {isFood ? (
            <>
              <div className="flex justify-between px-2 pt-1">
                {laborBalance.qtyBuilt} / {laborBalance.maxBuildings}{' '}
                {resource.resourceId == ResourcesIds.Fish
                  ? 'Fishing Villages'
                  : 'Farms'}{' '}
                Producing
              </div>
            </>
          ) : (
            <>
              <span className="text-gray-600">Vault:</span>
              <span>{laborBalance.vault.toFixed()}</span>
            </>
          )}
        </div>
      </div>
      <div className="p-2 mr-2 border rounded border-black/10 bg-gray-1000">
        <div className="flex space-x-2 text-base">
          <span className="text-gray-600">Status:</span>{' '}
          <div className="flex self-center mr-3 text-gray-600 capitalize ">
            {laborBalance.isGenerating ? 'producing' : 'idle'}{' '}
            <Pulse
              active={laborBalance.isGenerating}
              pulse={laborBalance.isGenerating}
            />
          </div>
        </div>
        <hr className="my-1 opacity-20" />
        <div className="flex justify-between space-x-2 text-base">
          <span className="text-gray-600">Produced:</span>
          <span>
            {isFood
              ? laborBalance.generated *
                productionAmount *
                (laborBalance.qtyBuilt || 1)
              : laborBalance.generated * productionAmount}
          </span>
        </div>
      </div>
      <div className="p-2 mr-2 border rounded border-black/10 bg-gray-1000">
        <LaborRow
          title={'Production'}
          pulse={laborBalance.isGenerating > 0}
          value={<span>{(laborBalance.generating * 100).toFixed(2)}%</span>}
          tooltipText={<span>% completion of production</span>}
        />
        <hr className="my-1 opacity-20" />
        <LaborRow
          title={'Queue'}
          pulse={remaining > 0}
          value={remaining}
          tooltipText={
            <span>
              You will continue to produce for {remaining} more cycles.
            </span>
          }
        />
      </div>
      <div className="flex flex-col ml-auto space-y-2">
        <BuyLabor
          realm={realm}
          costs={costs}
          isFood={isFood}
          resource={resource}
        />
        <span className={getHasGeneratedClass(laborBalance.hasGenerated)}>
          <HarvestButton
            realmId={realm.realmId}
            resourceId={resource.resourceId}
            generation={
              isFood
                ? laborBalance.generated *
                  productionAmount *
                  (laborBalance.qtyBuilt || 1)
                : laborBalance.generated * productionAmount
            }
          />
        </span>
      </div>
    </div>
  );
};
