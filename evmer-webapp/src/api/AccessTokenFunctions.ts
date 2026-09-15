import { jwtDecode } from "jwt-decode";
import type { AccessTokenType } from "./users/users";

export function checkAccessTokenTime(): boolean {
  const accessToken = sessionStorage.getItem("accessTokenRaw");

  if (!accessToken) {
    return false;
  }

  const decodedToken = jwtDecode<AccessTokenType>(accessToken);

  const expiresAtMs = decodedToken.exp * 1000;
  const remainingTime = expiresAtMs - Date.now();

  const FIVE_MINUTES = 5 * 60 * 1000;

  return remainingTime < FIVE_MINUTES;
}
