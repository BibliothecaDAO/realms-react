import { useQuery } from 'react-query';
import { getModuleAddress } from '@/util/minigameApi';

export const queryKeys = {
  module: (moduleId: any) => ['controller-module', moduleId],
};
export const useModuleAddress = (moduleId: string) => {
  return useQuery<string>(
    queryKeys.module(moduleId),
    () => {
      return getModuleAddress(moduleId);
    },
    {
      // The module addresses won't change
      staleTime: Infinity,
    }
  );
};
