import type { FC } from "react";
import { useState } from "react";
import { DEFAULT_IMAGE, DEFAULT_VIDEO } from "../../media";

interface FeedVideoProps {
  videoUrl: string;
  imageUrl: string;
  title: string;
}

// Видео ленты. Пустая ссылка или ошибка загрузки - видео по умолчанию.
// Фото компонента (или фото по умолчанию) показывается как обложка до старта видео.
export const FeedVideo: FC<FeedVideoProps> = ({ videoUrl, imageUrl, title }) => {
  const [videoFailed, setVideoFailed] = useState(false);

  const src = videoUrl && !videoFailed ? videoUrl : DEFAULT_VIDEO;

  return (
    <video
      className="feed__video"
      src={src}
      poster={imageUrl || DEFAULT_IMAGE}
      aria-label={title}
      autoPlay
      muted
      loop
      playsInline
      onError={() => setVideoFailed(true)}
    />
  );
};
