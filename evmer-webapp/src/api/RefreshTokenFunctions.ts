import { publicApi } from "./AxiosInstance";
import type { LoginResponse } from "./users/users";

export async function refreshAccessToken(): Promise<string> {
  const response = await publicApi.post<LoginResponse>("/auth/refresh");

  const newAccessToken = response.data.accessToken;
  sessionStorage.setItem("accessToken", newAccessToken);

  return newAccessToken;
}
