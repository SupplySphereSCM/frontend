import useSWR, { mutate } from "swr";
import { useMemo } from "react";
// utils
import axiosInstance, { fetcher, endpoints } from "src/utils/axios";
// types
import { ISupplyChainItem } from "src/types/supplychain";

// ----------------------------------------------------------------------

export function useGetSupplyChains() {
  const URL = endpoints.supplychain.root;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      supplyChains: (data as ISupplyChainItem[]) || [],
      supplyChainsLoading: isLoading,
      supplyChainsError: error,
      supplyChainsValidating: isValidating,
      supplyChainsEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating],
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetSupplyChain(id: string) {
  const URL = endpoints.supplychain.details(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      supplyChain: data as ISupplyChainItem,
      supplyChainLoading: isLoading,
      supplyChainError: error,
      supplyChainValidating: isValidating,
    }),
    [data, error, isLoading, isValidating],
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createSupplyChain(
  supplyChain: Partial<ISupplyChainItem>,
) {
  const URL = endpoints.supplychain.root;
  /**
   * Work on server
   */
  const data = { ...supplyChain };
  await axiosInstance.post(URL, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const supplyChains: ISupplyChainItem[] = [
        ...currentData?.supplyChains,
        supplyChain,
      ];

      return {
        ...currentData,
        supplyChains,
      };
    },
    false,
  );
}
// ----------------------------------------------------------------------

export async function updateSupplyChain(
  supplyChain: Partial<ISupplyChainItem>,
) {
  const URL = endpoints.supplychain.details(`${supplyChain.id}`);
  /**
   * Work on server
   */
  const data = { ...supplyChain };

  await axiosInstance.patch(URL, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const updatedServices = currentData.supplyChains.map(
        (p: ISupplyChainItem) => {
          return p.id === supplyChain.id ? { ...p, ...supplyChain } : p;
        },
      );

      return { ...currentData, services: updatedServices };
    },
    false,
  );
}
