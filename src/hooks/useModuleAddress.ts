import { useEffect, useState } from "react";
import { getModuleAddress } from "~/util/minigameApi";

export const useModuleAddress = (moduleId: string) => {
  const [moduleAddress, setModuleAddress] = useState<string>();
  useEffect(() => {
    getModuleAddress(moduleId).then((addr) => setModuleAddress(addr));
  }, []);
  return moduleAddress;
};
