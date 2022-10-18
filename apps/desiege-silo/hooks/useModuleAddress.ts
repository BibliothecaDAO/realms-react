import { useQuery } from 'react-query';
import { provider, CONTROLLER_ADDRESS } from '@/util/minigameApi';

export const queryKeys = {
  module: (moduleId: any) => ['controller-module', moduleId],
};
export const useModuleAddress = (moduleId: string) => {
  return useQuery<string>(
    queryKeys.module(moduleId),
    () => {
      return provider
        .callContract({
          contractAddress: CONTROLLER_ADDRESS,
          entrypoint: 'get_module_address',
          calldata: [moduleId.toString()],
        })
        .then((res) => res.result[0]);
    },
    {
      // The module addresses won't change
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
};
