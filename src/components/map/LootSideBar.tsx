import { useUIContext } from "~/hooks/useUIContext";
import { BaseSideBar } from "./BaseSideBar";
import { Loot } from "../realms/Loot";
import Menu from "../../../public/svg/menu.svg";
import { LootData } from "~/types";
import { useQuery } from "@apollo/client";
import { getLootQuery } from "~/hooks/graphql/queries";

type Props = {
  id: number;
};

export const LootSideBar = (props: Props) => {
  const { toggleLootMenu, lootMenu } = useUIContext();

  const { loading, error, data } = useQuery<LootData>(getLootQuery, {
    variables: { id: props.id.toString() },
  });

  return (
    <BaseSideBar open={lootMenu}>
      <div className="top-0 bottom-0 right-0 z-20 w-full h-screen p-6 pt-10 overflow-auto lg:w-5/12 rounded-r-2xl">
        <button
          className="z-10 p-4 transition-all rounded bg-white/20 hover:bg-white/70"
          onClick={toggleLootMenu}
        >
          <Menu />
        </button>
        {data && data.bag && (
          <Loot flyto={false} loot={data!.bag} loading={loading} />
        )}
      </div>
    </BaseSideBar>
  );
};
