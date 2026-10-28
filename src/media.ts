import type { SyntheticEvent } from "react";

// Фото и видео по умолчанию лежат в папке public самого проекта
export const DEFAULT_IMAGE = "/default-component.png";
export const DEFAULT_VIDEO = "/default-component.mp4";

// Если ссылка из MinIO не открылась, подменяем фото на заглушку
export const setDefaultImageOnError = (
  event: SyntheticEvent<HTMLImageElement>,
) => {
  const image = event.currentTarget;
  if (!image.src.endsWith(DEFAULT_IMAGE)) {
    image.src = DEFAULT_IMAGE;
  }
};
