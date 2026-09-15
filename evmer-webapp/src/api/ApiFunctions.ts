import { api, publicApi } from "./AxiosInstance";

type resValues = string | number | boolean;
type QueryParms = Record<string, resValues>;

export interface ResponseEntity {
  message: string;
}

export const postPublicRequest = async <TResponse, TRequest>(
  path: string,
  body: TRequest,
): Promise<TResponse> => {
  try {
    const response = await publicApi.post<TResponse>(path, body);
    return response.data;
  } catch (error) {
    console.error("Public POST request failed:", error);
    throw error;
  }
};

export const postRequest = async <TResponse, TRequest>(
  path: string,
  body: TRequest,
): Promise<TResponse> => {
  try {
    const response = await api.post<TResponse>(path, body);
    return response.data;
  } catch (error) {
    console.error("Greška ", error);
    throw error;
  }
};

export const postRequestMultipart = async <TResponse, TRequest>(
  path: string,
  body: TRequest,
  file?: File,
  params?: QueryParms,
): Promise<TResponse> => {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(body)], { type: "application/json" }),
  );
  if (file) formData.append("file", file);
  try {
    const response = await api.post<TResponse>(path, formData, {
      params,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const putRequest = async <TResponse, TRequest>(
  path: string,
  body: TRequest,
): Promise<TResponse> => {
  try {
    const response = await api.put<TResponse>(path, body);
    return response.data;
  } catch (error) {
    console.error("PUT request failed:", error);
    throw error;
  }
};

export const patchRequest = async <TResponse, TRequest>(
  path: string,
  body: TRequest,
  params?: QueryParms,
): Promise<TResponse> => {
  try {
    const response = await api.patch<TResponse>(path, body, { params });
    return response.data;
  } catch (error) {
    console.error("PATCH request failed:", error);
    throw error;
  }
};

export const patchRequestNoBody = async <TResponse>(
  path: string,
): Promise<TResponse> => {
  try {
    const response = await api.patch<TResponse>(path);
    return response.data;
  } catch (error) {
    console.error("PATCH request failed:", error);
    throw error;
  }
};

export const patchRequestMultipart = async <TResponse, TRequest>(
  path: string,
  body: TRequest,
  file?: File,
  params?: QueryParms,
): Promise<TResponse> => {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(body)], { type: "application/json" }),
  );
  if (file != undefined) formData.append("file", file);

  try {
    const response = await api.patch<TResponse>(path, formData, {
      params,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("PATCH request failed:", error);
    throw error;
  }
};

export const getRequest = async <TResponse>(
  path: string,
  params?: any,
): Promise<TResponse> => {
  try {
    const response = await api.get<TResponse>(path, { params });
    return response.data;
  } catch (error) {
    console.error("GET request failed:", error);
    throw error;
  }
};

export const deleteRequest = async <TResponse, TRequest>(
  path: string,
  body: TRequest,
  params?: QueryParms,
): Promise<TResponse> => {
  try {
    const response = await api.delete<TResponse>(path, { params, data: body });
    return response.data;
  } catch (error) {
    console.error("DELETE:", error);
    throw error;
  }
};

export const deleteRequestNoBody = async <TResponse>(
  path: string,
  params?: QueryParms,
): Promise<TResponse> => {
  try {
    const response = await api.delete<TResponse>(path, { params });
    return response.data;
  } catch (error) {
    console.error("DELETE:", error);
    throw error;
  }
};
