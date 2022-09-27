// import { Button, ResourceIcon } from '@bibliotheca-dao/ui-lib/base';
// import Image from 'next/image';
// import { useEffect, useState } from 'react';
// import AtlasSidebar from '@/components/sidebars/AtlasSideBar';
// import { ArmoryBuilder } from '@/components/tables/Armory';
// import { Squad } from '@/constants/index';
// import { findResourceById } from '@/constants/resources';
// import { useTransactionQueue } from '@/context/TransactionQueueContext';
// import type { GetRealmQuery } from '@/generated/graphql';
// import { useGetTroopStatsQuery } from '@/generated/graphql';
// import useCombat, { createCall } from '@/hooks/settling/useCombat';
// import useIsOwner from '@/hooks/useIsOwner';
// import { Troop } from '@/shared/squad/Troops';
// import type { BuildingDetail, TroopInterface } from '@/types/index';
// import { getCostSums } from '@/util/armory';
// import SidebarHeader from '../SidebarHeader';
// import SquadStatistics from './SquadStatistics';

// interface SquadProps {
//   className?: string;
//   troops: Array<TroopInterface>;
//   flipped?: boolean;
//   withPurchase?: boolean;
//   realm?: GetRealmQuery['realm'];
//   troopsStats: any;
//   squad: keyof typeof Squad;
//   onClose: () => void;
//   militaryBuildingsBuilt: Array<number> | undefined;
// }

// const EmptyTroopId = 0;

// export const SquadBuilder = (props: SquadProps) => {
//   const [toBuy, setToBuy] = useState<TroopInterface[]>([]);
//   const [selectedTroop, setSelectedTroop] = useState<TroopInterface | null>(
//     null
//   );

//   const { build, troops } = useCombat();

//   const isOwner = useIsOwner(props.realm?.settledOwner);

//   useEffect(() => {
//     setToBuy([]);
//   }, [props.squad]);

//   const fillGap = (tier: number, length: number) => {
//     const emptyTroop: TroopInterface = {
//       troopId: EmptyTroopId,
//       index: 0,
//       type: 0,
//       tier: 0,
//       agility: 0,
//       attack: 0,
//       armor: 0,
//       vitality: 0,
//       wisdom: 0,
//       squadSlot: 0,
//       troopName: '',
//     };

//     const currentTroops = props.troops.filter((a) => a.tier === tier);

//     const queuedTroops = toBuy.filter((t) => t.tier == tier);

//     const temp: TroopInterface[] = [];

//     for (
//       let index = 0;
//       index < length - currentTroops.length - queuedTroops.length;
//       index++
//     ) {
//       emptyTroop['tier'] = tier;
//       temp.push(emptyTroop);
//     }

//     return currentTroops
//       .concat(queuedTroops)
//       .concat(temp)
//       .map((a, index) => {
//         return (
//           <Troop
//             onClick={(val) => {
//               if (isOwner || val.troopId != EmptyTroopId) {
//                 setSelectedTroop(val);
//               }
//             }}
//             onSubmit={(value: any) =>
//               setToBuy((current) => [...current, value])
//             }
//             onRemove={(value: any) =>
//               setToBuy((current) => [...current, value])
//             }
//             withPurchase={props.withPurchase}
//             key={index}
//             troop={a}
//             troopsStats={props.troopsStats}
//           />
//         );
//       });
//   };

//   const tier1 = () => {
//     return fillGap(1, 9);
//   };
//   const tier2 = () => {
//     return fillGap(2, 5);
//   };
//   const tier3 = () => {
//     return fillGap(3, 1);
//   };

//   const selectedTroopIsEmpty =
//     selectedTroop && selectedTroop.troopId == EmptyTroopId;

//   return (
//     <div className="flex flex-col w-full mt-4">
//       <div
//         className={`${
//           props.flipped ? 'order-last' : ''
//         } flex gap-2 my-2 w-full justify-evenly`}
//       >
//         {tier1()}
//       </div>
//       <div className="flex justify-around w-full gap-3 mx-auto my-2 sm:w-3/4">
//         {tier2()}
//       </div>
//       <div
//         className={`${
//           props.flipped ? 'order-first' : ''
//         } flex justify-around w-full sm:w-1/2 mx-auto my-2`}
//       >
//         {tier3()}
//       </div>
//       <AtlasSidebar isOpen={!!selectedTroop}>
//         <SidebarHeader
//           onClose={() => setSelectedTroop(null)}
//           title={
//             selectedTroopIsEmpty
//               ? `Train Tier ${selectedTroop?.tier || ' '} Troops`
//               : selectedTroop?.troopName || 'Troop'
//           }
//         />

//         {selectedTroopIsEmpty && troops && isOwner && (
//           <>
//             <div className="flex flex-wrap mb-5">
//               <div className="w-1/2 px-3">
//                 <h3>Statistics</h3>
//                 <SquadStatistics troops={props.troops} troopsQueued={toBuy} />
//               </div>
//               <div className="w-1/2 px-3">
//                 <h3>Costs</h3>
//                 {getCostSums(toBuy).map((a, index) => {
//                   return (
//                     <div key={index} className="inline-block mb-2">
//                       <span className="">
//                         <ResourceIcon
//                           resource={findResourceById(a.resourceId)?.trait || ''}
//                           size="sm"
//                           className="self-center mr-4"
//                         />
//                         <span>{a.amount}</span>
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//             <div className="flex">
//               <Button
//                 disabled={toBuy.length == 0}
//                 onClick={() => {
//                   props.onClose();
//                   build(
//                     props.realm?.realmId,
//                     toBuy.map((t) => ({ id: t.troopId, cost: t.troopCost! })),
//                     Squad[props.squad]
//                   );
//                   setToBuy([]);
//                 }}
//                 variant="primary"
//                 size="xs"
//                 className="flex-1 w-full mr-2"
//               >
//                 {toBuy.length == 0
//                   ? 'Select Troops to Train'
//                   : `Train ${toBuy.length} Troops`}
//               </Button>
//               <Button
//                 onClick={() => setToBuy([])}
//                 disabled={toBuy.length == 0}
//                 variant="outline"
//                 size="xs"
//               >
//                 Clear
//               </Button>
//             </div>
//             <ArmoryBuilder
//               onBuildTroop={(t) => setToBuy(toBuy.concat(t))}
//               squad={props.squad}
//               troops={props.troops}
//               troopsQueued={toBuy}
//               statistics={troops}
//               realmId={props.realm?.realmId as number}
//               hideSquadToggle
//               filterTier={selectedTroop?.tier}
//               militaryBuildingsBuilt={props.militaryBuildingsBuilt}
//             />
//           </>
//         )}

//         {selectedTroop && !selectedTroopIsEmpty && (
//           <>
//             <div className="flex p-2">
//               <div className="mx-auto bg-red-600 rounded sm:w-1/3">
//                 {selectedTroop.troopName && (
//                   <Image
//                     src={`/realm-troops/${selectedTroop.troopName}.png`}
//                     className="object-contain h-auto"
//                     width="200"
//                     height="200"
//                     layout={'responsive'}
//                   />
//                 )}
//               </div>
//               <div className="mr-auto text-2xl text-left">
//                 <div>Agility: {selectedTroop.agility}</div>
//                 <div>Attack: {selectedTroop.attack}</div>
//                 <div>Armor: {selectedTroop.armor}</div>
//                 <div>Vitality: {selectedTroop.vitality}</div>
//                 <div>Wisdom: {selectedTroop.wisdom}</div>
//               </div>
//             </div>
//           </>
//         )}
//       </AtlasSidebar>
//     </div>
//   );
// };
export {};
