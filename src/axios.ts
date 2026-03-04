import Axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "react-toastify";
import { QueryClient } from "@tanstack/react-query";

// Create a shared query client instance or get it from context
let queryClientInstance: QueryClient | null = null;

export const setQueryClient = (client: QueryClient) => {
  queryClientInstance = client;
};

const axios: AxiosInstance = Axios.create({
  // baseURL: "https://api-website.reefdevelopments.tech/api",
  baseURL: "https://api-website.reefdevelopments.ae/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

let previousLang: string | null = null;

axios.interceptors.request.use((config) => {
  const currentLang = localStorage.getItem("lang");
  config.headers["accept-language"] = currentLang;

  // If language changed, invalidate all queries to refetch with new language
  if (
    previousLang !== null &&
    previousLang !== currentLang &&
    queryClientInstance
  ) {
    queryClientInstance.invalidateQueries();
  }
  previousLang = currentLang;

  return config;
});
axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // console.log(error);

    if (error.message === "Network Error") {
      toast.error("Check your internet connection");
      localStorage.setItem("inovaToken", "");
      // window.location.replace('/login')
    } else if (error.response) {
      const status = +error.response.status;
      const message = error.response?.data?.message || "Unknown error occurred";

      if (status === 404) {
        toast.error("The requested data hasn't been found");
      } else if (status === 401) {
        toast.error("You have no permission to access this data");
      } else if (status === 403) {
        toast.error("Accessing this data is forbidden");
        localStorage.setItem("inovaToken", "");
        window.location.replace("/login");
      } else if (status === 500 || status === 422) {
        toast.error(message);
      } else {
        toast.error("Unknown error occurred");
      }
    } else {
      toast.error("Unknown error occurred");
    }

    return Promise.reject(error);
  }
);

export default axios;
