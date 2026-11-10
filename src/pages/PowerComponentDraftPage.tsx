import "./PowerComponentDraftPage.css";
import type { ChangeEvent, FC, SubmitEvent } from "react";
import { useEffect, useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { POWER_MAX } from "../api/powerComponentsApi";
import { LoadingOverlay } from "../components/LoadingOverlay/LoadingOverlay";
import { DEFAULT_IMAGE, DEFAULT_VIDEO, setDefaultImageOnError, toMediaUrl } from "../media";
import { ROUTES } from "../Routes";
import { useAppDispatch, useAppSelector } from "../store";
import {
  clearPublishedId,
  createDraft,
  deleteDraft,
  getDraft,
  publishDraft,
} from "../store/draftSlice";

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;
const WEIGHT_MAX = 100000;

// Добавление компонента (только после входа).
// Нет черновика: название, фото, видео и кнопка «Далее» - POST создаёт черновик.
// Есть черновик: его фото, видео и название, ниже описание и поля по теме
// (мощность и вес) и кнопка «Опубликовать» - PUT публикации, затем переход в ленту.
const PowerComponentDraftPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const { draft, loaded, loading, publishedId, error } = useAppSelector((state) => state.draft);

  // Шаг 1: поля создания черновика
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");

  // Шаг 2: поля публикации
  const [description, setDescription] = useState("");
  const [powerWatt, setPowerWatt] = useState("");
  const [weightGram, setWeightGram] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getDraft());
    }
  }, [dispatch, isAuthenticated]);

  // Опубликовано - открываем компонент в ленте
  useEffect(() => {
    if (publishedId !== null) {
      dispatch(clearPublishedId());
      navigate(`${ROUTES.FEED}/${publishedId}`);
    }
  }, [dispatch, navigate, publishedId]);

  // Локальные ссылки на выбранные файлы для предпросмотра, старые освобождаем
  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return;
    }
    const url = URL.createObjectURL(image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  useEffect(() => {
    if (!video) {
      setVideoPreview("");
      return;
    }
    const url = URL.createObjectURL(video);
    setVideoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [video]);

  const handleFile =
    (setter: (file: File | null) => void) => (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.files?.[0] ?? null);
    };

  const handleCreate = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(createDraft({ title: title.trim(), image, video }));
    if (createDraft.fulfilled.match(result)) {
      setTitle("");
      setImage(null);
      setVideo(null);
    }
  };

  const handlePublish = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(
      publishDraft({
        description: description.trim(),
        power_watt: Number(powerWatt),
        weight_gram: Number(weightGram),
      }),
    );
  };

  const handleDeleteDraft = async () => {
    if (!window.confirm("Удалить черновик?")) return;
    const result = await dispatch(deleteDraft());
    if (deleteDraft.fulfilled.match(result)) {
      setDescription("");
      setPowerWatt("");
      setWeightGram("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pageMessage">
        <p>Добавлять компоненты могут только авторизованные пользователи.</p>
        <Button variant="accent" onClick={() => navigate(ROUTES.LOGIN)}>
          Войти
        </Button>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="pageSpinner">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <div className="draft">
      <h1 className="draft__heading">{draft ? "Публикация компонента" : "Новый компонент"}</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      {!draft && (
        <Form onSubmit={handleCreate}>
          <section className="draft__section">
            <h2 className="draft__sectionTitle">Фото и видео</h2>
            <div className="draft__media">
              <img
                className="draft__image"
                src={imagePreview || DEFAULT_IMAGE}
                alt="Фото компонента"
              />
              <video
                className="draft__video"
                src={videoPreview || DEFAULT_VIDEO}
                muted
                loop
                autoPlay
                playsInline
              />
            </div>
            <Form.Group className="mb-2" controlId="draftImage">
              <Form.Label className="draft__label">Фото (PNG, JPEG, GIF, WEBP до 5 МБ)</Form.Label>
              <Form.Control
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                onChange={handleFile(setImage)}
              />
            </Form.Group>
            <Form.Group controlId="draftVideo">
              <Form.Label className="draft__label">Видео (MP4, MOV, WEBM до 50 МБ)</Form.Label>
              <Form.Control
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                onChange={handleFile(setVideo)}
              />
            </Form.Group>
          </section>

          <section className="draft__section">
            <h2 className="draft__sectionTitle">Название</h2>
            <Form.Control
              value={title}
              maxLength={TITLE_MAX_LENGTH}
              placeholder="Например, NVIDIA RTX 4070"
              required
              onChange={(event) => setTitle(event.target.value)}
            />
          </section>

          <Button
            type="submit"
            variant="accent"
            className="draft__submit"
            disabled={loading || !title.trim()}
          >
            Далее
          </Button>
        </Form>
      )}

      {draft && (
        <Form onSubmit={handlePublish}>
          <section className="draft__section">
            <h2 className="draft__sectionTitle">Фото и видео</h2>
            <div className="draft__media">
              <img
                className="draft__image"
                src={toMediaUrl(draft.image_url) || DEFAULT_IMAGE}
                alt={draft.title}
                onError={setDefaultImageOnError}
              />
              <video
                key={draft.id}
                className="draft__video"
                src={toMediaUrl(draft.video_url) || DEFAULT_VIDEO}
                poster={toMediaUrl(draft.image_url) || DEFAULT_IMAGE}
                muted
                loop
                autoPlay
                playsInline
                onError={(event) => {
                  if (!event.currentTarget.src.endsWith(DEFAULT_VIDEO)) {
                    event.currentTarget.src = DEFAULT_VIDEO;
                  }
                }}
              />
            </div>
            <p className="draft__title">{draft.title}</p>
          </section>

          <section className="draft__section">
            <h2 className="draft__sectionTitle">Описание и характеристики</h2>
            <Form.Group className="mb-2" controlId="draftDescription">
              <Form.Label className="draft__label">Краткое описание</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                maxLength={DESCRIPTION_MAX_LENGTH}
                required
                onChange={(event) => setDescription(event.target.value)}
              />
            </Form.Group>
            <div className="draft__row">
              <Form.Group controlId="draftPower">
                <Form.Label className="draft__label">⚡ Мощность, Вт</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={POWER_MAX}
                  value={powerWatt}
                  required
                  onChange={(event) => setPowerWatt(event.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="draftWeight">
                <Form.Label className="draft__label">⚖ Вес, г</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={WEIGHT_MAX}
                  value={weightGram}
                  required
                  onChange={(event) => setWeightGram(event.target.value)}
                />
              </Form.Group>
            </div>
          </section>

          <Button type="submit" variant="accent" className="draft__submit" disabled={loading}>
            Опубликовать
          </Button>
          <Button
            variant="outline-danger"
            className="draft__submit mt-2"
            disabled={loading}
            onClick={handleDeleteDraft}
          >
            Удалить черновик
          </Button>
        </Form>
      )}

      <LoadingOverlay show={loading} />
    </div>
  );
};

export default PowerComponentDraftPage;
