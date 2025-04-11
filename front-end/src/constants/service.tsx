export const convertToUpperCase = (str: string): string => {
  return str.replace(/ /g, "_").toUpperCase();
};

export const VITE_API_BASE_URL = import.meta.env.VITE_BASE_URL ?? "";
export const VITE_BASE_QR_CODE = import.meta.env.VITE_BASE_QR_CODE ?? "";
export const SERVICE_CONFIG_ACCESS_KEY = `PTMS_ACCESS_KEY`;
export const SERVICE_CONFIG_REFRESH_KEY = `PTMS_REFRESH_KEY`;
export const SERVICE_CONFIG_DATA_USER = `PTMS_DATA_USER`;
export const SERVICE_CONFIG_SIGN_IN_PATH = "";
