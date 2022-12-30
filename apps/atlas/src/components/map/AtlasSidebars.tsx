import { useRouter } from 'next/router';
import { ResourceSwapSideBar } from '@/components/bank/ResourceSwapSideBar';
import { EmpireSideBar } from '@/components/empire/EmpireSideBar';
import { MintSettleRealmsSideBar } from '@/components/realms/MintSettleRealmsSideBar';
import { TransactionCartSideBar } from '@/components/ui/transactions/TransactionCartSideBar';
import { useAtlasContext } from '@/context/AtlasContext';
import { useUIContext } from '@/context/UIContext';
import { ResourcesListSideBar } from '../bank/ResourcesListSideBar';
import { CryptSideBar } from '../crypts/CryptsSideBar';
import { GASideBar } from '../ga/GASideBar';
import { LootSideBar } from '../loot/LootSideBar';
import { RealmSideBar } from '../realms/RealmsSideBar';
import { ChatSideBar } from '../ui/Chat';

export function AtlasSidebars() {
  const { mapContext } = useAtlasContext();

  const selectedAsset = mapContext.selectedAsset;

  const { pathname } = useRouter();

  const {
    assetSidebar,
    closeAsset,
    chatSidebar,
    toggleChatSidebar,
    empireSidebar,
    toggleEmpire,
    tradeSidebar,
    toggleTrade,
    transactionCart,
    toggleTransactionCart,
    settleRealmsSidebar,
    toggleSettleRealms,
    resourcesListSidebar,
    toggleResourcesList,
  } = useUIContext();

  function onLordsNavClick() {
    // Bank swap panel is already open
    if (pathname.slice(1).split('/')[0] === 'bank') {
      return;
    }
    toggleTrade();
  }

  return (
    <>
      <RealmSideBar
        realmId={selectedAsset?.id as string}
        isOpen={assetSidebar === 'realm'}
        onClose={closeAsset}
      />
      <LootSideBar
        lootId={selectedAsset?.id as string}
        isOpen={assetSidebar === 'loot'}
        onClose={closeAsset}
      />
      <CryptSideBar
        cryptId={selectedAsset?.id as string}
        isOpen={assetSidebar === 'crypt'}
        onClose={closeAsset}
      />
      <GASideBar
        gaId={selectedAsset?.id as string}
        isOpen={assetSidebar === 'ga'}
        onClose={closeAsset}
      />
      <ChatSideBar
        isOpen={chatSidebar}
        onClose={toggleChatSidebar}
        channelName={'desiege-chat'}
      />
      <TransactionCartSideBar
        isOpen={transactionCart}
        onClose={toggleTransactionCart}
      />
      <ResourceSwapSideBar isOpen={tradeSidebar} onClose={onLordsNavClick} />

      <EmpireSideBar isOpen={empireSidebar} onClose={toggleEmpire} />
      <ResourcesListSideBar
        isOpen={resourcesListSidebar}
        onClose={toggleResourcesList}
      />
      <MintSettleRealmsSideBar
        isOpen={settleRealmsSidebar}
        onClose={toggleSettleRealms}
      />
    </>
  );
}
