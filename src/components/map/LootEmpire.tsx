import { useUIContext } from "~/hooks/useUIContext";
import { Loot } from "../realms/Loot";
import Menu from "../../../public/svg/menu.svg";
import { CryptData } from "~/types";
import { useQuery } from "@apollo/client";
import { useState } from "react";

import { getLootsQuery } from "~/hooks/graphql/queries";
import { WalletEcosystemData, CryptFilters } from "~/types";
import { useWalletContext } from "~/hooks/useWalletContext";
const grids =
  "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 xl:gap-6";
type Props = {
  onClick?: (event: any, id: string) => void;
};

export const LootEmpire = (props: Props) => {
  const { toggleLootMenu, lootMenu } = useUIContext();
  const { account, isConnected, displayName } = useWalletContext();
  const [limit, setLimit] = useState(0);

  const defaultVariables = (params?: CryptFilters) => {
    return {
      address:
        "0x6924686b3dcd04ae8ef91a3feccc262d020f519d" /*account.toLowerCase()*/,
      first: 12,
      skip: limit,
    };
  };

  const { loading, error, data, fetchMore } = useQuery<WalletEcosystemData>(
    getLootsQuery,
    {
      variables: defaultVariables(),
      skip: !isConnected,
      ssr: false,
    }
  );

  return (
    <div>
      <div className={grids}>
        {data &&
          data.bags.map((bag, index) => (
            <Loot
              onClick={props.onClick}
              key={index}
              loot={bag}
              loading={loading}
              size={"small"}
              flyto={true}
            />
          ))}
      </div>
      {data && (
        <button
          onClick={() => {
            fetchMore({
              variables: {
                skip: limit + 12,
              },
            });
            setLimit(limit + 12);
          }}
          className="w-full p-4 bg-gray-600 rounded"
        >
          Load more
        </button>
      )}
    </div>
  );
};
