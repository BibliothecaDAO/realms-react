import { useEffect, useState } from "react";
import { getModuleAddress } from "~/util/minigameApi";

export const useModuleAddress = (moduleId: string) => {
  const [moduleAddress, setModuleAddress] = useState<string>();
  useEffect(() => {
    try {
      getModuleAddress(moduleId).then((addr) => setModuleAddress(addr));
    } catch (e: any) {
      throw new Error("Couldn't retrieve module address from controller");
    }
  }, []);
  return moduleAddress;
};
