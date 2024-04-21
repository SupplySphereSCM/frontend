import useSWR, { mutate } from "swr";
import { useMemo } from "react";
// utils
import axiosInstance, { fetcher, endpoints } from "src/utils/axios";
// types
import { IProductItem } from "src/types/product";

// ----------------------------------------------------------------------

export function useGetProducts() {
  const URL = endpoints.product.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  // console.log("Data:", data); // Check if data is being fetched

  const memoizedValue = useMemo(
    () => ({
      products: (data as IProductItem[]) || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  // console.log(memoizedValue);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetShopProducts() {
  const URL = endpoints.product.shop;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  // console.log("Data:", data); // Check if data is being fetched

  const memoizedValue = useMemo(
    () => ({
      products: (data as IProductItem[]) || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  // console.log(memoizedValue);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId: string) {
  const URL = productId
    ? [`${endpoints.product.details}/${productId}`, { params: { productId } }]
    : null;
  console.log(URL);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  console.log(data);

  const memoizedValue = useMemo(
    () => ({
      product: data as IProductItem,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query: string) {
  const URL = query ? [endpoints.product.search, { params: { query } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: (data?.results as IProductItem[]) || [],
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

export async function createProduct(product: Partial<IProductItem>) {
  const URL = endpoints.product.root;
  /**
   * Work on server
   */
  const data = { ...product };
  await axiosInstance.post(URL, data);
  // console.log(data);

  /**
   * Work in local
   */
  // mutate(
  //   URL,
  //   (currentData: any) => {
  //     console.log(currentData);

  //     const products: IProductItem[] = [...currentData?.products, product];

  //     return {
  //       ...currentData,
  //       products,
  //     };
  //   },
  //   false
  // );
}
