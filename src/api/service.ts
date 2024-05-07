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
    [data?.data, error, isLoading, isValidating]
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
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetShopTransporterServices() {
  const URL = endpoints.transporter.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      services: (data?.data as ITransporterServiceItem[]) || [],
      servicesLoading: isLoading,
      servicesError: error,
      servicesValidating: isValidating,
      servicesEmpty: !isLoading && !data?.data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetShopService(serviceId: string) {
  const URL = endpoints.service.details(serviceId);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  console.log(data);

  const memoizedValue = useMemo(
    () => ({
      service: (data as IServiceItem) || [],
      serviceLoading: isLoading,
      serviceError: error,
      serviceValidating: isValidating,
      serviceEmpty: !isLoading && !data?.data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
// ----------------------------------------------------------------------

type UseGetServiceProps = {
  role?: "SELLER" | "TRANSPORTER";
  serviceId: string;
};

export function useGetService({ serviceId, role }: UseGetServiceProps) {
  const URL =
    role === "SELLER"
      ? endpoints.service.details(serviceId)
      : endpoints.transporter.details(serviceId);
  // console.log("URL", URL);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  // console.log("Data", data);

  const memoizedValue = useMemo(
    () => ({
      service:
        role === "SELLER"
          ? (data as IServiceItem)
          : (data as ITransporterServiceItem),
      serviceLoading: isLoading,
      serviceError: error,
      serviceValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type UseGetUserServicesProps = {
  role?: "SELLER" | "TRANSPORTER";
  // userId: string;
};

export function useGetUserServices({ role }: UseGetUserServicesProps) {
  const URL =
    role === "SELLER" ? endpoints.service.user : endpoints.transporter.user;
  // const URL = `${serviceEndpoint}?filter=${userId}`;
  // console.log(URL);

  const {
    data: services,
    isLoading,
    error,
    isValidating,
  } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      services:
        (role === "TRANSPORTER"
          ? (services as ITransporterServiceItem[])
          : (services as IServiceItem[])) || [],
      //  (services as IServiceItem) || [],
      servicesLoading: isLoading,
      servicesError: error,
      servicesValidating: isValidating,
      servicesEmpty: !isLoading && !services?.length,
    }),
    [error, isLoading, isValidating]
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
    [data?.results, error, isLoading, isValidating]
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
    false
  );
}
// ----------------------------------------------------------------------

export async function createTransportService(
  service: Partial<ITransporterServiceItem>
) {
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
      const services: ITransporterServiceItem[] = [
        ...currentData?.services,
        service,
      ];

      return {
        ...currentData,
        services,
      };
    },
    false
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
    false
  );
}
// ----------------------------------------------------------------------

export async function updateTransporterService(
  service: Partial<ITransporterServiceItem>
) {
  const URL = endpoints.transporter.details(`${service.id}`);
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
      const updatedServices = currentData.services.map(
        (p: ITransporterServiceItem) => {
          return p.id === service.id ? { ...p, ...service } : p;
        }
      );

      return { ...currentData, services: updatedServices };
    },
    false
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
