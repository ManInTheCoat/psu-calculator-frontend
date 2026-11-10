import type { SyntheticEvent } from "react";

// Фото и видео по умолчанию лежат в папке public самого проекта
export const DEFAULT_IMAGE = "/default-component.png";
export const DEFAULT_VIDEO = "/default-component.mp4";

// Бакет MinIO. Бэкенд отдаёт полные ссылки вида
// http://localhost:9000/power-components/power_component_8_image_1a2b3c4d.png,
// фронтенд берёт файл через второй маршрут прокси Vite: /power-components/...
const MINIO_BUCKET_PATH = "/power-components/";

export const toMediaUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  try {
    const { pathname } = new URL(url, window.location.origin);
    return pathname.startsWith(MINIO_BUCKET_PATH) ? pathname : url;
  } catch {
    return url;
  }
};

// Если ссылка из MinIO не открылась, подменяем фото на заглушку
export const setDefaultImageOnError = (
  event: SyntheticEvent<HTMLImageElement>,
) => {
  const image = event.currentTarget;
  if (!image.src.endsWith(DEFAULT_IMAGE)) {
    image.src = DEFAULT_IMAGE;
  }
};
