import useSWR from 'swr';

const useGetUpdatedData = (id: string) => {
  const fetcher = (args: any) =>
    fetch(args, {
      method: 'POST',
      body: JSON.stringify(id),
    }).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    '/api/post/getUpdatedDataById/',
    fetcher
  );

  return { data, error, isLoading };
};

export default useGetUpdatedData;
