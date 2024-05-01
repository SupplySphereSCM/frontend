import useSWR, { mutate } from "swr";
import { useMemo } from "react";
// utils
import axiosInstance, { fetcher, endpoints } from "src/utils/axios";
// types
import { IInvoiceItem } from "src/types/invoice";

// ----------------------------------------------------------------------

export function useGetInvoices() {
  const URL = endpoints.invoice.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  // console.log("Data:", data); // Check if data is being fetched

  const memoizedValue = useMemo(
    () => ({
      invoices: (data as IInvoiceItem[]) || [],
      invoicesLoading: isLoading,
      invoicesError: error,
      invoicesValidating: isValidating,
      invoicesEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating],
  );
  // console.log(memoizedValue);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetShopInvoices() {
  const URL = endpoints.invoice.shop;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  // console.log("Data:", data); // Check if data is being fetched

  const memoizedValue = useMemo(
    () => ({
      invoices: (data as IInvoiceItem[]) || [],
      invoicesLoading: isLoading,
      invoicesError: error,
      invoicesValidating: isValidating,
      invoicesEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating],
  );
  // console.log(memoizedValue);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetInvoice(invoiceId: string) {
  const URL = endpoints.invoice.details(invoiceId);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  console.log(data);

  const memoizedValue = useMemo(
    () => ({
      invoice: data as IInvoiceItem,
      invoiceLoading: isLoading,
      invoiceError: error,
      invoiceValidating: isValidating,
    }),
    [data, error, isLoading, isValidating],
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchInvoices(query: string) {
  const URL = query ? [endpoints.invoice.search, { params: { query } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: (data?.results as IInvoiceItem[]) || [],
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

export async function createInvoice(invoice: Partial<IInvoiceItem>) {
  const URL = endpoints.invoice.root;
  /**
   * Work on server
   */
  const data = { ...invoice };
  await axiosInstance.post(URL, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const invoices: IInvoiceItem[] = [...currentData?.invoices, invoice];

      return {
        ...currentData,
        invoices,
      };
    },
    false,
  );
}
// ----------------------------------------------------------------------

export async function updateInvoice(invoice: Partial<IInvoiceItem>) {
  const URL = endpoints.invoice.details(`${invoice.id}`);
  /**
   * Work on server
   */
  const data = { ...invoice };
  await axiosInstance.patch(URL, data);
  // console.log(data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const updatedinvoices = currentData.invoices.map((p: IInvoiceItem) => {
        return p.id === invoice.id ? { ...p, ...invoice } : p;
      });

      return { ...currentData, invoices: updatedinvoices };
    },
    false,
  );
}

export async function deleteInvoices(ids: string | string[]) {
  try {
    // if (Array.isArray(ids) && ids.length > 1) {
    //   return await axiosInstance.delete(endpoints.invoice.root, {
    //     data: [...ids],
    //   });
    // }

    return await axiosInstance.delete(endpoints.invoice.details(ids as string));
  } catch (error) {
    console.error("Failed to delete invoices:", error);
    // Optionally, handle errors more gracefully here
  }
}
