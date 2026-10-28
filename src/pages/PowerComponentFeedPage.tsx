import "./PowerComponentFeedPage.css";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getPowerComponentFeed } from "../api/powerComponentsApi";
import type { PowerComponentFeedItem } from "../api/types";
import { FeedParam } from "../components/FeedParam/FeedParam";
import { FeedVideo } from "../components/FeedVideo/FeedVideo";
import { ROUTES } from "../Routes";

const SHORT_DESCRIPTION_LENGTH = 70;

// id из адреса: положительное целое, иначе компонент считается не найденным
const parsePowerComponentId = (value: string | undefined): number | null | undefined => {
  if (value === undefined) return undefined;
  const id = Number(value);
  return Number.isInteger(id) && id >= 1 ? id : null;
};

// Лента: один компонент на весь экран, видео на фоне, информация поверх.
// /power_components/feed          - первый компонент (пункт «Лента» в меню)
// /power_components/feed/3        - компонент 3
// /power_components/feed/3?next=true - следующий после компонента 3
const PowerComponentFeedPage: FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isNext = searchParams.get("next") === "true";
  const navigate = useNavigate();

  const [feedItem, setFeedItem] = useState<PowerComponentFeedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const powerComponentId = parsePowerComponentId(id);
    let ignore = false;
    setLoading(true);
    setExpanded(false);

    if (powerComponentId === null) {
      setFeedItem(null);
      setLoading(false);
      return;
    }

    getPowerComponentFeed(powerComponentId, isNext).then((item) => {
      if (ignore) return;
      setFeedItem(item);
      setLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, [id, isNext]);

  const handleNext = () => {
    if (feedItem) {
      navigate(`${ROUTES.FEED}/${feedItem.id}?next=true`);
    }
  };

  if (loading) {
    return (
      <div className="pageSpinner">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (!feedItem) {
    return (
      <div className="pageMessage">
        <p>Компонент не найден.</p>
        <Button variant="accent" onClick={() => navigate(ROUTES.TILE)}>
          К плитке
        </Button>
      </div>
    );
  }

  const { title, description, image_url, video_url, power_watt, weight_gram, likes_count } =
    feedItem;
  const isLongDescription = description.length > SHORT_DESCRIPTION_LENGTH;
  const shownDescription =
    expanded || !isLongDescription
      ? description
      : `${description.slice(0, SHORT_DESCRIPTION_LENGTH).trimEnd()}…`;

  return (
    <div className="feed">
      <FeedVideo key={feedItem.id} videoUrl={video_url} imageUrl={image_url} title={title} />

      <aside className="feed__side">
        <FeedParam icon="⚡" value={`${power_watt} Вт`} />
        <FeedParam icon="⚖" value={`${weight_gram} г`} />
        <FeedParam icon="♥" value={String(likes_count)} accent />
        <Button variant="accent" className="feed__next" onClick={handleNext}>
          След. →
        </Button>
      </aside>

      <div className="feed__overlay">
        <h1 className="feed__title">{title}</h1>
        {description && (
          <p className="feed__description">
            {shownDescription}
            {isLongDescription && (
              <Button
                variant="link"
                className="feed__more"
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? "скрыть" : "ещё"}
              </Button>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default PowerComponentFeedPage;
