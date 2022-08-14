import { useState } from 'react';
import type { RealmWhereInput } from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';

export type Args = {
  filter: RealmWhereInput;
  pageSize: number;
};

const useRealms = (args: Args) => {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useGetRealmsQuery({
    variables: {
      filter: args.filter,
      take: args.pageSize,
      skip: (page - 1) * args.pageSize,
    },
  });

  const hasNext =
    data?.total !== undefined && page * args.pageSize < data.total;

  const loadNext = () => {
    setPage((prev) => prev + 1);
  };

  const reset = () => {
    setPage(1);
  };

  return { data, loading, error, loadNext, hasNext, reset };
};

export default useRealms;
