const normalizedBasePath = import.meta.env.BASE_URL.replace(/^\/+|\/+$/g, "");

export const APP_BASE_PATH = normalizedBasePath
  ? `/${normalizedBasePath}`
  : "/";

const ASSET_BASE_URL = APP_BASE_PATH === "/" ? "/" : `${APP_BASE_PATH}/`;

export const assetUrl = (path: string) =>
  `${ASSET_BASE_URL}${path.replace(/^\/+/, "")}`;
