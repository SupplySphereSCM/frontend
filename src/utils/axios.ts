import axios, { AxiosRequestConfig } from "axios";
// config
import { HOST_API } from "src/config-global";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: "/api/chat",
  kanban: "/api/kanban",
  calendar: "/api/calendar",
  auth: {
    me: "/api/auth/me",
    login: "/api/auth/login",
    register: "/api/auth/register",
    delete: "/api/auth",
  },
  mail: {
    list: "/api/mail/list",
    details: "/api/mail/details",
    labels: "/api/mail/labels",
  },
  post: {
    list: "/api/post/list",
    details: "/api/post/details",
    latest: "/api/post/latest",
    search: "/api/post/search",
  },
  user: {
    root: "/api/users",
    details: (id: string) => `/api/users/${id}`,
  },

  rawMaterials: {
    root: "api/raw-materials",
    user: "api/raw-materials/user",
    details: (id: string) => `/api/raw-materials/${id}`,
  },
  product: {
    shop: "/api/products",
    root: "/api/products",
    user: "/api/products/user",
    search: "/api/products/search",
    details: (id: string) => `/api/products/${id}`,
  },
  service: {
    shop: "/api/services/shop",
    root: "/api/services",
    list: "/api/services",
    user: "/api/services/user",
    search: "/api/services/search",
    details: (id: string) => `/api/services/${id}`,
  },
  transporter: {
    shop: "/api/transporter/shop",
    root: "/api/transporter",
    list: "/api/transporter",
    user: "/api/transporter/user",
    search: "/api/transporter/search",
    details: (id: string) => `/api/transporter/${id}`,
  },
  invoice: {
    shop: "/api/invoice/shop",
    root: "/api/invoice",
    user: "/api/invoice/user",
    search: "/api/invoice/search",
    details: (id: string) => `/api/invoice/${id}`,
  },
  order: {
    shop: "/api/orders/shop",
    myorder: "/api/orders/user/to",
    root: "/api/orders",
    user: "/api/orders/user",
    search: "/api/orders/search",
    details: (id: string) => `/api/orders/${id}`,
  },

  supplychain: {
    root: "/api/supplychains",
    user: "/api/supplychains/user",
    details: (id: string) => `/api/supplychains/${id}`,
  },
  upload: {
    file: "/api/upload/file",
    files: "/api/upload/files",
  },
};
