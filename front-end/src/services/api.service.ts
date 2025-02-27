/* eslint-disable @typescript-eslint/no-explicit-any */

import { TAuth } from "@/types";
import { cookieCryptoUtils } from "@/utils";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { useNavigate } from "react-router-dom";

export interface APIServiceConfig {
  accessTokenKey?: string;
  refreshTokenKey?: string;
  userIdKey?: string;
  roleKey?: string;
  signInPath?: string;
}

export abstract class APIService {
  protected axiosInstance: AxiosInstance;
  protected baseURL: string;
  private accessTokenKey: string;
  private refreshTokenKey: string;
  private userIdKey: string;
  private roleKey: string;
  navigate = useNavigate();

  constructor(baseURL: string, config: APIServiceConfig = {}) {
    this.baseURL = baseURL || "http://localhost:3000";
    this.accessTokenKey = config.accessTokenKey || "ACCESS_TOKEN";
    this.refreshTokenKey = config.refreshTokenKey || "REFRESH_TOKEN";
    this.userIdKey = config.userIdKey || "USER_ID";
    this.roleKey = config.roleKey || "ROLE";

    this.axiosInstance = axios.create({
      baseURL,
      headers: this.getDefaultHeaders(),
    });

    this.setupInterceptors();
  }

  private getDefaultHeaders = (): Record<string, string> => {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  private setupInterceptors = (): void => {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await this.handleUnauthorizedError();
        }
        return Promise.reject(error);
      }
    );
  };

  private handleUnauthorizedError = async (): Promise<void> => {
    console.log("401 Unauthorized error");
    await this.signOut();
  };

  private clearAuthCookies = (): void => {
    cookieCryptoUtils.delete(this.accessTokenKey);
    cookieCryptoUtils.delete(this.refreshTokenKey);
    cookieCryptoUtils.delete(this.userIdKey);
    cookieCryptoUtils.delete(this.roleKey);
    this.navigate("/login");
  };

  getAccessToken = (): string | null =>
    cookieCryptoUtils.get(this.accessTokenKey) || null;

  setAccessToken = (token: string): void => {
    cookieCryptoUtils.set(this.accessTokenKey, token);
  };

  getRefreshToken = (): string | null =>
    cookieCryptoUtils.get(this.refreshTokenKey) || null;

  setRefreshToken = (token: string): void => {
    cookieCryptoUtils.set(this.refreshTokenKey, token);
  };

  getDataUser = (): TAuth => {
    const user = cookieCryptoUtils.get(this.userIdKey);
    return user ? user : ({} as TAuth);
  };

  setDataUser = (user: TAuth): void => {
    cookieCryptoUtils.set(this.userIdKey, user);
  };

  getRole = (): string | null => cookieCryptoUtils.get(this.roleKey) || null;

  setRole = (role: string): void => {
    cookieCryptoUtils.set(this.roleKey, role);
  };

  signOut = async (): Promise<boolean> => {
    this.clearAuthCookies();
    return true;
  };

  get = <T>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    return this.axiosInstance.get<T>(url, config);
  };

  post = <T>(
    url: string,
    data: any = {},
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    return this.axiosInstance.post<T>(url, data, config);
  };

  put = <T>(
    url: string,
    data: any = {},
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    return this.axiosInstance.put<T>(url, data, config);
  };

  patch = <T>(
    url: string,
    data: any = {},
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    return this.axiosInstance.patch<T>(url, data, config);
  };

  delete = <T>(
    url: string,
    data: any = {},
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    return this.axiosInstance.delete<T>(url, {
      data,
      ...config,
    });
  };

  request = <T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return this.axiosInstance.request<T>(config);
  };
}
