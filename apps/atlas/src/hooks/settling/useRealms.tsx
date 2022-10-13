import { useState } from 'react';
import type {
  RealmOrderByWithRelationInput,
  RealmWhereInput,
  TravelWhereInput,
} from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';

export type Args = {
  filter: RealmWhereInput;
  orderBy?: RealmOrderByWithRelationInput;
  pageSize?: number;
  page?: number;
  skip?: boolean;
  travelsWhere?: TravelWhereInput;
};

const useRealms = (args: Args) => {
  const [page, setPage] = useState(1);

  const resolvedPage = args.page ?? page;

  const { data, loading, error } = useGetRealmsQuery({
    variables: {
      filter: args.filter,
      take: args.pageSize,
      orderBy: args.orderBy,
      skip: (resolvedPage - 1) * (args.pageSize || 0),
    },
    skip: args.skip,
  });

  const hasNext =
    data?.total !== undefined &&
    resolvedPage * (args.pageSize || 1) < data.total;

  const loadNext = () => {
    setPage((prev) => prev + 1);
  };

  const reset = () => {
    setPage(1);
  };

  return { data, loading, error, loadNext, hasNext, reset };
};

export default useRealms;
