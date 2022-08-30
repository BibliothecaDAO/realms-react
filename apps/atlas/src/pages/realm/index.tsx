import React from 'react';
import Layout from '@/components/Layout';
import { RealmsPanel } from '@/components/panels/RealmsPanel';
import { BridgeRealmsSideBar } from '@/components/sidebars/BridgeRealmsSideBar';
import { RealmSideBar } from '@/components/sidebars/RealmsSideBar';
import { SettleRealmsSideBar } from '@/components/sidebars/SettleRealmsSideBar';
import { RealmProvider } from '@/context/RealmContext';

export default function RealmPage() {
  return (
    <Layout>
      <RealmProvider>
        <RealmsPanel />
        <RealmSideBar />
        <BridgeRealmsSideBar />
        <SettleRealmsSideBar />
      </RealmProvider>
    </Layout>
  );
}

// function AtlasMain() {
//   return (
//     <div className="relative w-full h-full">
//       <UserAgent>
//         {(ua: UserAgentProps) => (
//           <>
//             <RealmsModule />

//             <BaseModal />
//             <TransactionCartSideBar />
//             <MilitarySideBar />
//             <div id="sidebar-root">
//               {/* Render children here using the AtlasSideBar component */}
//             </div>
//           </>
//         )}
//       </UserAgent>
//     </div>
//   );
// }

// function RealmsModule() {
//   const { query } = useRouter();
//   const segments = query?.segment ?? [];
//   const realmId = segments[1] ? Number(segments[1]) : 0;
//   return (
//     <RealmProvider>
//       {realmId > 0 &&
//         (segments[2] === 'combat' ? (
//           <RaidResultsPanel key={realmId} defendId={realmId} tx={segments[3]} />
//         ) : (
//           <RealmDetailsPanel key={realmId} realmId={realmId} />
//         ))}
//       {realmId === 0 && (
//         <>
//           <RealmsPanel />
//           {/* <LorePanel /> */}
//           <RealmSideBar />
//           <BridgeRealmsSideBar />
//           <SettleRealmsSideBar />
//         </>
//       )}
//     </RealmProvider>
//   );
// }

// function GaModule() {
//   return (
//     <GaProvider>
//       <GaPanel />
//       <GASideBar />
//     </GaProvider>
//   );
// }

// function CryptModule() {
//   return (
//     <CryptProvider>
//       <CryptsPanel />
//       <CryptsSideBar />
//     </CryptProvider>
//   );
// }

// function BankModule() {
//   return (
//     <ResourceProvider>
//       <BankPanel />
//       <ResourceSwapSideBar />
//     </ResourceProvider>
//   );
// }

// function LootModule() {
//   return (
//     <LootProvider>
//       <LootPanel />
//       <LootSideBar />
//     </LootProvider>
//   );
// }

// function AccountModule() {
//   return <AccountPanel />;
// }

// function MapModule() {
//   const ItemViewLevel = 5;
//   const { openDetails, selectedId, coordinates } = useAtlasContext();
//   const [resource] = useState<Array<string>>([]);

//   /* const filteredData = () => {
//     return realms.features.filter((a: RealmFeatures) =>
//       a.properties.resources.some((b: string) => resource.includes(b))
//     );
//   }; */

//   const [viewState, setViewState] = useState({
//     longitude: 0,
//     latitude: 0,
//     zoom: 4,
//     pitch: 55,
//     bearing: 0,
//     bounds: [
//       [-180, -60], // Southwest coordinates
//       [180, 60], // Northeast coordinates
//     ],
//     transitionDuration: 0,
//     transitionInterpolator: new FlyToInterpolator(),
//   });

//   const cryptsLayer = new ScatterplotLayer({
//     id: 'crypts-layer',
//     data: crypts.features,
//     stroked: true,
//     filled: true,
//     extruded: true,
//     pickable: true,
//     opacity: 1,
//     visible: viewState.zoom < ItemViewLevel ? false : true,
//     getPosition: (d: any) => d.coordinates,
//     getRadius: (d: any) => (d.id === parseInt(selectedId) ? 4000 : 100),
//     getElevation: 10000,
//     lineWidthMinPixels: 1,
//     getFillColor: [0, 0, 0, 0],
//     updateTriggers: {
//       getRadius: parseInt(selectedId),
//       getVisible: viewState,
//     },
//     onClick: (info: any) => {
//       openDetails('crypt', info.object.id);
//     },
//   });

//   const realmsLayer = new ScatterplotLayer({
//     id: 'realms-layer',
//     data: (realms as any).features,
//     stroked: true,
//     filled: true,
//     extruded: true,
//     pickable: true,
//     opacity: 1,
//     visible: viewState.zoom < ItemViewLevel ? false : true,
//     getPosition: (d: any) => d.coordinates,
//     getRadius: (d: any) => (d.id === parseInt(selectedId) ? 4000 : 1),
//     getElevation: 10000,
//     lineWidthMinPixels: 1,
//     getFillColor: [0, 0, 0, 0],
//     updateTriggers: {
//       getRadius: parseInt(selectedId),
//       getVisible: viewState,
//     },
//     onClick: (info: any) => {
//       openDetails('realm', info.object.id);
//     },
//   });

//   const lootBagLayer = new ScatterplotLayer({
//     id: 'loot-layer',
//     data: loot_bags.features,
//     stroked: true,
//     filled: true,
//     extruded: true,
//     pickable: true,
//     visible: viewState.zoom < ItemViewLevel ? false : true,
//     opacity: 1,
//     getPosition: (d: any) => d.coordinates,
//     getRadius: 1,
//     getElevation: 10000,
//     lineWidthMinPixels: 1,
//     getFillColor: [255, 0, 0, 0],
//     updateTriggers: {
//       getRadius: parseInt(selectedId),
//       getVisible: viewState,
//     },
//     onClick: (info: any) => {
//       openDetails('loot', info.object.id);
//     },
//   });

//   const gaBagLayer = new ScatterplotLayer({
//     id: 'ga-layer',
//     data: ga_bags.features,
//     stroked: true,
//     filled: true,
//     extruded: true,
//     pickable: true,
//     visible: viewState.zoom < ItemViewLevel ? false : true,
//     opacity: 1,
//     getPosition: (d: any) => d.coordinates,
//     getRadius: 1,
//     getElevation: 10000,
//     lineWidthMinPixels: 1,
//     getFillColor: [0, 255, 0, 0],
//     updateTriggers: {
//       getRadius: parseInt(selectedId),
//       getVisible: viewState,
//     },
//     onClick: (info: any) => {
//       openDetails('ga', info.object.id);
//     },
//   });

//   /* const iconMapping = {
//     marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
//   };

//    const resourceLayer = new IconLayer({
//     id: 'icon-layer',
//     data: filteredData(),
//     pickable: false,
//     iconAtlas:
//       'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
//     iconMapping: iconMapping,
//     getIcon: () => 'marker',
//     sizeScale: 5,
//     getPosition: (d: any) => d.coordinates,
//     getSize: () => 5,
//     getColor: () => [255, 255, 255],
//   }); */

//   useEffect(() => {
//     if (!coordinates) {
//       return;
//     }

//     setViewState({
//       ...coordinates,
//       zoom: 8,
//       pitch: 20,
//       bearing: 0,
//       bounds: [
//         [-180, -60], // Southwest coordinates
//         [180, 60], // Northeast coordinates
//       ],
//       transitionDuration: 5000,
//       transitionInterpolator: new FlyToInterpolator(),
//     });
//   }, [coordinates]);
//   const [loaded, setLoaded] = useState<boolean>(false);

//   return (
//     <DeckGL
//       getCursor={({ isHovering }) => {
//         return isHovering ? 'pointer' : 'grabbing';
//       }}
//       pickingRadius={25}
//       viewState={viewState}
//       controller={true}
//       // onLoad={() => setLoaded(true)}
//       onViewStateChange={(e) => setViewState(e.viewState)}
//       layers={[realmsLayer, cryptsLayer, lootBagLayer, gaBagLayer]}
//     >
//       {!loaded ? (
//         <div className="fixed z-50 flex justify-center w-screen h-screen bg-gray-1000">
//           {' '}
//           <h1 className="self-center">loading Atlas...</h1>{' '}
//         </div>
//       ) : (
//         ''
//       )}
//       <Map
//         attributionControl={false}
//         onLoad={() => setLoaded(true)}
//         mapStyle="mapbox://styles/ponderingdemocritus/ckzjumbjo000914ogvsqzcjd2/draft"
//         mapboxAccessToken={
//           'pk.eyJ1IjoicG9uZGVyaW5nZGVtb2NyaXR1cyIsImEiOiJja3l0eGF6aXYwYmd4Mm5yejN5c2plaWR4In0.4ZTsKDrs0T8OTkbByUIo1A'
//         }
//       >
//         <FullscreenControl position="bottom-right" />
//       </Map>
//     </DeckGL>
//   );
// }

// function LoreModule() {
//   return (
//     <LoreProvider>
//       <LorePanel />
//     </LoreProvider>
//   );
// }
