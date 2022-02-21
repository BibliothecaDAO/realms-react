import { useUIContext } from "~/hooks/useUIContext";
import { Crypt } from "../realms/Crypt";
import Menu from "../../../public/svg/menu.svg";
import { CryptData } from "~/types";
import { useQuery } from "@apollo/client";
import { getCryptsQuery } from "~/hooks/graphql/queries";
import { WalletCryptsData, CryptFilters } from "~/types";
import { useWalletContext } from "~/hooks/useWalletContext";
const grids =
  "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 xl:gap-6";

export const CryptsEmpire = () => {
  const { toggleCryptsMenu, cryptsMenu } = useUIContext();
  const { account, isConnected, displayName } = useWalletContext();

  const defaultVariables = (params?: CryptFilters) => {
    return {
      address: "0xDE7552d2CDa44229f5Ed8feBa334FB91Bd62d9a7".toLowerCase(),
    };
  };

  const { loading, error, data } = useQuery<WalletCryptsData>(getCryptsQuery, {
    variables: defaultVariables(),
    skip: !isConnected,
    ssr: false,
  });

  return (
    <div className={grids}>
      {data &&
        data.dungeons.map((dungeon, index) => (
          <Crypt key={index} crypt={dungeon} loading={loading} />
        ))}
    </div>
  );
};
