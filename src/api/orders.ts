import useSWR, { mutate } from "swr";
import { useMemo } from "react";
// utils
import axiosInstance, { fetcher, endpoints } from "src/utils/axios";
// types
import { IProductItem } from "src/types/product";
import { IOrderItem } from "src/types/order";

// ----------------------------------------------------------------------

export function useGetOrder(ordertId: string) {
  // const URL = ordertId
  //   ? [`${endpoints.order.details}/${ordertId}`, { params: { ordertId } }]
  //   : null;
  const URL = endpoints.order.details(ordertId);
  console.log(URL);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  console.log("Get Order by ID:", data);

  const memoizedValue = useMemo(
    () => ({
      order: data as IOrderItem,
      orderLoading: isLoading,
      orderError: error,
      orderValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
// ----------------------------------------------------------------------

export function useGetOrders() {
  const URL = endpoints.order.user;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  console.log("Order Data:", data); // Check if data is being fetched

  const memoizedValue = useMemo(
    () => ({
      orders: (data as IOrderItem[]) || [],
      ordersLoading: isLoading,
      ordersError: error,
      ordersValidating: isValidating,
      ordersEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetShopOrders() {
  const URL = endpoints.order.shop;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  // console.log("Data:", data); // Check if data is being fetched

  const memoizedValue = useMemo(
    () => ({
      orders: (data as IOrderItem[]) || [],
      ordersLoading: isLoading,
      ordersError: error,
      ordersValidating: isValidating,
      ordersEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchOrders(query: string) {
  const URL = query ? [endpoints.order.search, { params: { query } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: (data?.results as IOrderItem[]) || [],
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

export async function createOrder(order: Partial<IOrderItem>) {
  const URL = endpoints.order.root;
  /**
   * Work on server
   */
  const data = { ...order };
  await axiosInstance.post(URL, data);
  // console.log(data);

  /**
   * Work in local
   */
  // mutate(
  //   URL,
  //   (currentOrder: any) => {
  //     console.log(currentOrder);

  //     const orders: IOrderItem[] = [...currentOrder?.orders, IOrderItem];

  //     return {
  //       ...currentOrder,
  //       orders,
  //     };
  //   },
  //   false
  // );
}

// ----------------------------------------------------------------------

export async function updateOrder(order: Partial<IOrderItem>) {
  const URL = endpoints.order.details(`${order.id}`);
  /**
   * Work on server
   */
  const data = { ...order };
  await axiosInstance.patch(URL, data);
  // console.log(data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentOrder: any) => {
      const updatedOrders = currentOrder.orderss.map((p: IProductItem) => {
        return p.id === order.id ? { ...p, ...order } : p;
      });

      return { ...currentOrder, orders: updatedOrders };
    },
    false
  );
}

export async function deleteOrders(ids: string | string[]) {
  try {
    // if (Array.isArray(ids) && ids.length > 1) {
    //   return await axiosInstance.delete(endpoints.service.root, {
    //     data: [...ids],
    //   });
    // }

    return await axiosInstance.delete(endpoints.order.details(ids as string));
  } catch (error) {
    console.error("Failed to delete orders:", error);
    // Optionally, handle errors more gracefully here
  }
}
