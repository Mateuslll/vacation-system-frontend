import axios, { type AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { parseApiFailure } from "./api-errors";

export const backendURL = (process.env.NEXT_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL) ?? "http://localhost:8080/api/v1/";
const timeoutApiRequest = 10000;

function attachResponseErrorInterceptor(client: AxiosInstance) {
  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(parseApiFailure(error))
  );
}

export const apiPublic = axios.create({
  baseURL: backendURL,
  timeout: timeoutApiRequest,
});

export const apiPrivate = axios.create({
  baseURL: backendURL,
  timeout: timeoutApiRequest,
});

apiPrivate.interceptors.request.use(
  (config) => {
    if (config.headers.Authorization) {
      return config;
    }
    const token = Cookies.get("Token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

attachResponseErrorInterceptor(apiPrivate);
attachResponseErrorInterceptor(apiPublic);