import { useUIContext } from "~/hooks/useUIContext";
import Menu from "../../../public/svg/menu.svg";
import { useQuery } from "@apollo/client";
import { useState } from "react";

import { getGAsQuery } from "~/hooks/graphql/queries";
import { GAsData, CryptFilters } from "~/types";
import { useWalletContext } from "~/hooks/useWalletContext";
import { GAdventurer } from "../realms/GAdventurer";

const grids =
  "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 xl:gap-6";
type Props = {
  onClick?: (event: any, id: string) => void;
};

export const GAEmpire = (props: Props) => {
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

  const { loading, error, data, fetchMore } = useQuery<GAsData>(getGAsQuery, {
    variables: defaultVariables(),
    skip: !isConnected,
    ssr: false,
  });

  return (
    <div>
      <div className={grids}>
        {data &&
          data.gadventurers.map((ga, index) => (
            <GAdventurer
              onClick={props.onClick}
              key={index}
              ga={ga}
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
