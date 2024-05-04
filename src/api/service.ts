import useSWR, { mutate } from "swr";
import { useMemo } from "react";
// utils
import axiosInstance, { fetcher, endpoints } from "src/utils/axios";
// types
import { IServiceItem, ITransporterServiceItem } from "src/types/service";
import { useAuthContext } from "src/auth/hooks";

// ----------------------------------------------------------------------

export function useGetServices() {
  const URL = endpoints.service.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      services: (data?.data as IServiceItem[]) || [],
      servicesLoading: isLoading,
      servicesError: error,
      servicesValidating: isValidating,
      servicesEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating],
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetShopServices() {
  const URL = endpoints.service.shop;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      services: (data as IServiceItem[]) || [],
      servicesLoading: isLoading,
      servicesError: error,
      servicesValidating: isValidating,
      servicesEmpty: !isLoading && !data?.data?.length,
    }),
    [data, error, isLoading, isValidating],
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetService(serviceId: string) {
  const { user } = useAuthContext();
  const URL = user?.roles.some((role) => ["TRANSPORTER"].includes(role))
    ? endpoints.transporter.details(serviceId)
    : endpoints.service.details(serviceId);
  console.log("URL", URL);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      service: user?.roles.some((role) => ["TRANSPORTER"].includes(role))
        ? (data as ITransporterServiceItem)
        : (data as IServiceItem),
      serviceLoading: isLoading,
      serviceError: error,
      serviceValidating: isValidating,
    }),
    [data, error, isLoading, isValidating],
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchServices(query: string) {
  const URL = query ? [endpoints.service.search, { params: { query } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: (data?.results as IServiceItem[]) || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating],
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createService(service: Partial<IServiceItem>) {
  const URL = endpoints.service.root;
  /**
   * Work on server
   */
  const data = { ...service };
  const res = await axiosInstance.post(URL, data);
  // console.log(res);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const services: IServiceItem[] = [...currentData?.services, service];

      return {
        ...currentData,
        services,
      };
    },
    false,
  );
}
// ----------------------------------------------------------------------

export async function createTransportService(service: Partial<IServiceItem>) {
  const URL = endpoints.transporter.root;
  /**
   * Work on server
   */
  const data = { ...service };
  const res = await axiosInstance.post(URL, data);
  // console.log(res);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const services: IServiceItem[] = [...currentData?.services, service];

      return {
        ...currentData,
        services,
      };
    },
    false,
  );
}

// ----------------------------------------------------------------------

export async function updateService(service: Partial<IServiceItem>) {
  const URL = endpoints.service.details(`${service.id}`);
  /**
   * Work on server
   */
  const data = { ...service };
  await axiosInstance.patch(URL, data);
  // console.log(data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const updatedServices = currentData.services.map((p: IServiceItem) => {
        return p.id === service.id ? { ...p, ...service } : p;
      });

      return { ...currentData, services: updatedServices };
    },
    false,
  );
}

export async function deleteServices(ids: string | string[]) {
  try {
    // if (Array.isArray(ids) && ids.length > 1) {
    //   return await axiosInstance.delete(endpoints.service.root, {
    //     data: [...ids],
    //   });
    // }

    return await axiosInstance.delete(endpoints.service.details(ids as string));
  } catch (error) {
    console.error("Failed to delete services:", error);
    // Optionally, handle errors more gracefully here
  }
}
