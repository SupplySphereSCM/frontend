import useSWR, { mutate } from "swr";
import { useMemo } from "react";
// utils
import axiosInstance, { fetcher, endpoints } from "src/utils/axios";
// types
import { IProductItem } from "src/types/product";
import { IRawMaterialItem } from "src/types/raw-materials";

// ----------------------------------------------------------------------

type IRawMaterialRes = {
  data: IRawMaterialItem[];
  totalCount: number;
  page: number;
};

export function useGetRawMaterials() {
  const URL = endpoints.rawMaterials.root;

  const { data, isLoading, error, isValidating } = useSWR<IRawMaterialRes>(
    URL,
    fetcher
  );

  const memoizedValue = useMemo(
    () => ({
      materials: data?.data || [],
      materialsLoading: isLoading,
      materialsError: error,
      materialsValidating: isValidating,
      materialsEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
// ----------------------------------------------------------------------

export function useGetProducts() {
  const URL = endpoints.product.root;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  console.log("Data:", data); // Check if data is being fetched

  const memoizedValue = useMemo(
    () => ({
      products: (data?.data as IProductItem[]) || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type UseGetUserProductsProps = {
  role?: "SELLER" | "MANUFACTURER";
};

export function useGetUserProducts({ role }: UseGetUserProductsProps) {
  const URL =
    role === "SELLER" ? endpoints.rawMaterials.user : endpoints.product.user;

  const {
    data: products,
    isLoading,
    error,
    isValidating,
  } = useSWR(URL, fetcher);
  console.log("useGetUserProducts:", products);

  const memoizedValue = useMemo(
    () => ({
      products: (products as IProductItem[]) || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !products?.length,
    }),
    [error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type UseGetProductProps = {
  role?: "SELLER" | "MANUFACTURER" | "RETAILER";
  productId: string;
};

export function useGetProduct({ productId, role }: UseGetProductProps) {
  const URL =
    role === "SELLER"
      ? endpoints.rawMaterials.details(productId)
      : endpoints.product.details(productId);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

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
  mutate(
    URL,
    (currentData: any) => {
      const products: IProductItem[] = [...currentData?.products, product];

      return {
        ...currentData,
        products,
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateProduct(product: Partial<IProductItem>) {
  const URL = endpoints.product.details(`${product.id}`);
  /**
   * Work on server
   */
  const data = { ...product };
  await axiosInstance.patch(URL, data);
  // console.log(data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const updatedProducts = currentData.products.map((p: IProductItem) => {
        return p.id === product.id ? { ...p, ...product } : p;
      });

      return { ...currentData, products: updatedProducts };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteProducts(ids: string | string[]) {
  try {
    // if (Array.isArray(ids) && ids.length > 1) {
    //   return await axiosInstance.delete(endpoints.product.root, {
    //     data: [...ids],
    //   });
    // }

    return await axiosInstance.delete(endpoints.product.details(ids as string));
  } catch (error) {
    console.error("Failed to delete products:", error);
    // Optionally, handle errors more gracefully here
  }
}

// ----------------------------------------------------------------------

export async function createRawMaterial(product: Partial<IRawMaterialItem>) {
  const URL = endpoints.rawMaterials.root;
  /**
   * Work on server
   */
  const data = { ...product };
  await axiosInstance.post(URL, data);
  // console.log(data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const products: IRawMaterialItem[] = [...currentData?.products, product];

      return {
        ...currentData,
        products,
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateRawMaterial(product: Partial<IRawMaterialItem>) {
  const URL = endpoints.rawMaterials.details(`${product.id}`);
  /**
   * Work on server
   */
  const data = { ...product };
  await axiosInstance.patch(URL, data);
  // console.log(data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const updatedRawMaterials = currentData.products.map(
        (p: IRawMaterialItem) => {
          return p.id === product.id ? { ...p, ...product } : p;
        }
      );

      return { ...currentData, products: updatedRawMaterials };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteRawMaterials(ids: string | string[]) {
  try {
    // if (Array.isArray(ids) && ids.length > 1) {
    //   return await axiosInstance.delete(endpoints.product.root, {
    //     data: [...ids],
    //   });
    // }

    return await axiosInstance.delete(endpoints.product.details(ids as string));
  } catch (error) {
    console.error("Failed to delete products:", error);
    // Optionally, handle errors more gracefully here
  }
}
