import "./PowerComponentFeedPage.css";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FeedParam } from "../components/FeedParam/FeedParam";
import { FeedVideo } from "../components/FeedVideo/FeedVideo";
import { LoadingOverlay } from "../components/LoadingOverlay/LoadingOverlay";
import { MockNotice } from "../components/MockNotice/MockNotice";
import { ROUTES } from "../Routes";
import { useAppDispatch, useAppSelector } from "../store";
import { deleteFeedItem, getFeedItem, toggleFeedLike } from "../store/feedSlice";

const SHORT_DESCRIPTION_LENGTH = 70;

// id из адреса: положительное целое, иначе компонент считается не найденным
const parsePowerComponentId = (value: string | undefined): number | null | undefined => {
  if (value === undefined) return undefined;
  const id = Number(value);
  return Number.isInteger(id) && id >= 1 ? id : null;
};

// Лента: один компонент на весь экран, видео на фоне, информация поверх.
// /power_components/feed             - первый компонент (пункт «Лента» в меню)
// /power_components/feed/3           - компонент 3
// /power_components/feed/3?next=true - следующий после компонента 3
// Пользователь после входа ставит лайк и удаляет свой компонент.
const PowerComponentFeedPage: FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isNext = searchParams.get("next") === "true";
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { item, loading, actionLoading, notFound, fromMock, error } = useAppSelector(
    (state) => state.feed,
  );
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const [expanded, setExpanded] = useState(false);
  const powerComponentId = parsePowerComponentId(id);

  // Загрузка компонента при смене id или next в адресе, а также после входа и выхода
  useEffect(() => {
    setExpanded(false);
    if (powerComponentId === null) return;
    dispatch(getFeedItem({ powerComponentId, next: isNext }));
  }, [dispatch, powerComponentId, isNext, isAuthenticated]);

  const handleNext = () => {
    if (item) {
      navigate(`${ROUTES.FEED}/${item.id}?next=true`);
    }
  };

  const handleLike = () => {
    dispatch(toggleFeedLike());
  };

  // После удаления открываем следующий компонент после удалённого
  const handleDelete = async () => {
    if (!item || !window.confirm("Удалить компонент?")) return;
    const result = await dispatch(deleteFeedItem(item.id));
    if (deleteFeedItem.fulfilled.match(result)) {
      navigate(`${ROUTES.FEED}/${item.id}?next=true`, { replace: true });
    }
  };

  if (powerComponentId === null || (!loading && notFound)) {
    return (
      <div className="pageMessage">
        <p>Компонент не найден.</p>
        <Button variant="accent" onClick={() => navigate(ROUTES.TILE)}>
          К плитке
        </Button>
      </div>
    );
  }

  if (loading && !item) {
    return (
      <div className="pageSpinner">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (!item) {
    return error ? <Alert variant="danger">{error}</Alert> : null;
  }

  const { title, image_url, video_url, power_watt, weight_gram, likes_count, is_liked, is_mine } =
    item;
  const description = item.description ?? "";
  const isLongDescription = description.length > SHORT_DESCRIPTION_LENGTH;
  const shownDescription =
    expanded || !isLongDescription
      ? description
      : `${description.slice(0, SHORT_DESCRIPTION_LENGTH).trimEnd()}…`;
  const busy = loading || actionLoading;

  return (
    <>
      {fromMock && <MockNotice />}
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="feed">
        <FeedVideo key={item.id} videoUrl={video_url} imageUrl={image_url} title={title} />

        <aside className="feed__side">
          <FeedParam icon="⚡" value={`${power_watt ?? "-"} Вт`} />
          <FeedParam icon="⚖" value={`${weight_gram ?? "-"} г`} />
          <FeedParam
            icon={is_liked ? "♥" : "♡"}
            value={String(likes_count)}
            accent
            onClick={handleLike}
            disabled={!isAuthenticated || fromMock || busy}
            title={isAuthenticated ? "Нравится" : "Войдите, чтобы ставить лайки"}
          />
          {isAuthenticated && is_mine === 1 && (
            <Button
              variant="danger"
              className="feed__delete"
              disabled={busy}
              onClick={handleDelete}
            >
              Удалить
            </Button>
          )}
          <Button variant="accent" className="feed__next" disabled={busy} onClick={handleNext}>
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

      <LoadingOverlay show={busy} />
    </>
  );
};

export default PowerComponentFeedPage;
