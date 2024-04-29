import axios, { AxiosRequestConfig } from "axios";
// config
import { HOST_API } from "src/config-global";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong",
    ),
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
  product: {
    shop: "/api/products/shop",
    root: "/api/products",
    list: "/api/products/user",
    search: "/api/products/search",
    details: (id: string) => `/api/products/${id}`,
  },
  service: {
    shop: "/api/services/shop",
    root: "/api/services",
    list: "/api/services/user",
    search: "/api/services/search",
    details: (id: string) => `/api/services/${id}`,
  },
  supplychain: {
    root: "/api/supplychains",
    details: (id: string) => `/api/services/${id}`,
  },
  upload: {
    file: "/api/upload/file",
    files: "/api/upload/files",
  },
};
