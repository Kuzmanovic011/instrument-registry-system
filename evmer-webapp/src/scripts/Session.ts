import { jwtDecode } from "jwt-decode";
import type { AccessTokenType, LoginResponse } from "../api/users/users";

export const saveCredentials = (res: LoginResponse) => {
  const accessToken = res.accessToken;

  sessionStorage.setItem("accessTokenRaw", accessToken);

  const decodedResponse = jwtDecode<AccessTokenType>(accessToken);

  sessionStorage.setItem("accessToken", JSON.stringify(decodedResponse));
};

export const getUser = (): AccessTokenType | null => {
  const user = sessionStorage.getItem("accessToken");

  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("accessTokenRaw");
};

export const isAuthenticated = (): boolean => {
  return getUser() !== null;
};

export const getRole = (): string | null => {
  const user = getUser();

  if (user) {
    return user.role;
  }

  return null;
};
