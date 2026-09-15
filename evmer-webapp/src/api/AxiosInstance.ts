import axios from "axios";
import { useLoadingStore } from "./LoadingStore";

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

export const api = axios.create({
  baseURL: `${apiUrl}/api/authenticated`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

export const publicApi = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    useLoadingStore.getState().startLoading();
    const accessToken = sessionStorage.getItem("accessTokenRaw");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    useLoadingStore.getState().stopLoading();
    Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().stopLoading();
    return response;
  },
  (error) => {
    useLoadingStore.getState().stopLoading();
    return Promise.reject(error);
  },
);
