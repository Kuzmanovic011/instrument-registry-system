import { postPublicRequest } from "../ApiFunctions";

export async function ReqNewAccessToken(token: string) {
  return await postPublicRequest<string, string>("/auth/refresh", token);
}
