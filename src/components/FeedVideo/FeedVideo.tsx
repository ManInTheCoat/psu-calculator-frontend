import type { FC } from "react";
import { useState } from "react";
import { DEFAULT_IMAGE, DEFAULT_VIDEO, toMediaUrl } from "../../media";

interface FeedVideoProps {
  videoUrl: string;
  imageUrl: string;
  title: string;
}

// Видео ленты. Пустая ссылка или ошибка загрузки - видео по умолчанию.
// Фото компонента (или фото по умолчанию) показывается как обложка до старта видео.
// Файлы из MinIO загружаются через прокси (/power-components/...).
export const FeedVideo: FC<FeedVideoProps> = ({ videoUrl, imageUrl, title }) => {
  const [videoFailed, setVideoFailed] = useState(false);

  const video = toMediaUrl(videoUrl);
  const src = video && !videoFailed ? video : DEFAULT_VIDEO;

  return (
    <video
      className="feed__video"
      src={src}
      poster={toMediaUrl(imageUrl) || DEFAULT_IMAGE}
      aria-label={title}
      autoPlay
      muted
      loop
      playsInline
      onError={() => setVideoFailed(true)}
    />
  );
};
