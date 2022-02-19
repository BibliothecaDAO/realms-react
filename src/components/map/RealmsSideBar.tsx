import { useUIContext } from "~/hooks/useUIContext";
import { BaseSideBar } from "./BaseSideBar";
import { Realm } from "../realms/Realm";
import Menu from "../../../public/svg/menu.svg";
import { Data } from "~/types";

type Props = {
  data: Data | undefined;
  loading: boolean;
};

export const RealmSideBar = (props: Props) => {
  const { toggleMapMenu, mapMenu } = useUIContext();

  return (
    <BaseSideBar open={mapMenu}>
      <div className="top-0 bottom-0 right-0 z-20 w-full h-screen p-6 pt-10 overflow-auto sm:w-5/12 rounded-r-2xl">
        <button
          className="z-10 p-4 transition-all rounded bg-white/20 hover:bg-white/70"
          onClick={toggleMapMenu}
        >
          <Menu />
        </button>
        {props.data && props.data.realm && (
          <Realm realm={props.data!.realm} loading={props.loading} />
        )}
      </div>
    </BaseSideBar>
  );
};
