import { useUIContext } from "~/hooks/useUIContext";
import { BaseSideBar } from "./BaseSideBar";
import { Crypt } from "../realms/Crypt";
import Menu from "../../../public/svg/menu.svg";
import { CryptData } from "~/types";
import { useQuery } from "@apollo/client";
import { getCryptQuery } from "~/hooks/graphql/queries";

type Props = {
  id: number;
};

export const CryptsSideBar = (props: Props) => {
  const { toggleCryptsMenu, cryptsMenu } = useUIContext();

  const { loading, error, data } = useQuery<CryptData>(getCryptQuery, {
    variables: { id: props.id.toString() },
  });

  return (
    <BaseSideBar open={cryptsMenu}>
      <div className="top-0 bottom-0 right-0 z-20 w-full h-screen p-6 pt-10 overflow-auto sm:w-5/12 rounded-r-2xl">
        <button
          className="z-10 p-4 transition-all rounded bg-white/20 hover:bg-white/70"
          onClick={toggleCryptsMenu}
        >
          <Menu />
        </button>
        {data && data.dungeon && (
          <Crypt crypt={data!.dungeon} loading={loading} />
        )}
      </div>
    </BaseSideBar>
  );
};
