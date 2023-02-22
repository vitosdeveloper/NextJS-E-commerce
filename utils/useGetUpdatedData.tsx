import { UpdatedDataType } from '@/types/types';
import useSWR from 'swr';

const useGetUpdatedData = (id: string) => {
  const fetcher = (args: string) =>
    fetch(args, {
      method: 'POST',
      body: JSON.stringify(id),
    }).then((res) => res.json());
  const {
    data,
    error,
    isLoading,
  }: { data: UpdatedDataType; error: any; isLoading: any } = useSWR(
    '/api/post/getUpdatedDataById/',
    fetcher
  );

  return { data, error, isLoading };
};

export default useGetUpdatedData;
