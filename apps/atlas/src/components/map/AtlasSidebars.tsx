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
import { LeaderboardSideBar } from '../leaderboard/LeadeboardSideBar';
import { LootSideBar } from '../loot/LootSideBar';
import { LoreSideBar } from '../lore/LoreSideBar';
import { AccountSettingsModal } from '../navigation/AccountSettingModal';
import { RealmSideBar } from '../realms/RealmsSideBar';
// import { ChatSideBar } from '../ui/Chat';
import { VizirSideBar } from '../ui/vizir/VizirSideBar';
import { Web3MQChatSideBar } from '../web3mq/Web3MQChatSideBar';

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
    loreSidebar,
    toggleLore,
    leaderboardSidebar,
    toggleLeaderboard,
    toggleVizir,
    vizirSidebar,
    toggleAccountSettings,
    accountSettingsModal,
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
      {/* <ChatSideBar
        isOpen={chatSidebar}
        onClose={toggleChatSidebar}
        channelName={'desiege-chat'}
      /> */}
      <Web3MQChatSideBar
        isOpen={chatSidebar}
        onClose={toggleChatSidebar}
        channelName="web3mq-chat"
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
      <LoreSideBar isOpen={loreSidebar} onClose={toggleLore} />
      <LeaderboardSideBar
        isOpen={leaderboardSidebar}
        onClose={toggleLeaderboard}
      />
      <MintSettleRealmsSideBar
        isOpen={settleRealmsSidebar}
        onClose={toggleSettleRealms}
      />

      <VizirSideBar isOpen={vizirSidebar} onClose={toggleVizir} />
    </>
  );
}
