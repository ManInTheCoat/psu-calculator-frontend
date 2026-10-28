import { POWER_COMPONENTS_MOCK } from "./mock";
import type { PowerComponentFeedItem, PowerComponentListItem } from "./types";

// В ЛР5 бэкенд не вызывается: функции повторяют методы веб-сервиса
// (те же параметры и формат ответа), но берут данные из mock-коллекции.
// Задержка имитирует сетевой запрос, чтобы был виден индикатор загрузки.

export const POWER_MIN = 0;
export const POWER_MAX = 500;
export const POWER_STEP = 10;

const MOCK_DELAY_MS = 300;

const withDelay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY_MS));

const toListItem = (item: PowerComponentFeedItem): PowerComponentListItem => ({
  id: item.id,
  title: item.title,
  image_url: item.image_url,
  power_watt: item.power_watt,
  weight_gram: item.weight_gram,
  likes_count: item.likes_count,
  is_mine: item.is_mine,
});

// Аналог GET /api/power_components?max_power=...
// Без max_power возвращаются все опубликованные компоненты.
export const getPowerComponents = (
  maxPower?: number,
): Promise<PowerComponentListItem[]> => {
  const list = POWER_COMPONENTS_MOCK.filter(
    (item) => maxPower === undefined || item.power_watt <= maxPower,
  ).map(toListItem);

  return withDelay(list);
};

// Аналог GET /api/power_components/feed?power_component_id=...&next=true
// Без id - первый компонент; с id - этот компонент;
// с id и next - следующий после него, после последнего снова первый.
// Если компонент не найден, возвращается null (на бэкенде это 404).
export const getPowerComponentFeed = (
  powerComponentId?: number,
  next = false,
): Promise<PowerComponentFeedItem | null> => {
  const published = [...POWER_COMPONENTS_MOCK].sort((a, b) => a.id - b.id);

  if (published.length === 0) {
    return withDelay(null);
  }

  if (powerComponentId === undefined) {
    return withDelay(published[0]);
  }

  if (next) {
    const nextItem = published.find((item) => item.id > powerComponentId);
    return withDelay(nextItem ?? published[0]);
  }

  const item = published.find((item) => item.id === powerComponentId);
  return withDelay(item ?? null);
};
