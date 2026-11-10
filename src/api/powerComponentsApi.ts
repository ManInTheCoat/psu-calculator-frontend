import { POWER_COMPONENTS_MOCK } from "./mock";
import type { PowerComponentFeedItem, PowerComponentListItem } from "./types";

// Ответы веб-сервиса из mock-коллекции. Вызываются из thunk-ов,
// когда бэкенд недоступен и пользователь - гость.
// Логика та же, что у методов GET списка и GET ленты на бэкенде.

export const POWER_MIN = 0;
export const POWER_MAX = 500;
export const POWER_STEP = 10;

const toListItem = (item: PowerComponentFeedItem): PowerComponentListItem => ({
  id: item.id,
  title: item.title,
  image_url: item.image_url,
  power_watt: item.power_watt,
  weight_gram: item.weight_gram,
  likes_count: item.likes_count,
  is_mine: item.is_mine,
});

// Как GET /api/power_components?max_power=...
// Без max_power возвращаются все опубликованные компоненты.
export const getPowerComponentsMock = (maxPower?: number): PowerComponentListItem[] =>
  POWER_COMPONENTS_MOCK.filter(
    (item) => maxPower === undefined || (item.power_watt ?? 0) <= maxPower,
  ).map(toListItem);

// Как GET /api/power_components/feed?power_component_id=...&next=true
// Без id - первый компонент; с id - этот компонент;
// с id и next - следующий после него, после последнего снова первый.
// Если компонент не найден, возвращается null.
export const getPowerComponentFeedMock = (
  powerComponentId?: number,
  next = false,
): PowerComponentFeedItem | null => {
  const published = [...POWER_COMPONENTS_MOCK].sort((a, b) => a.id - b.id);

  if (published.length === 0) return null;
  if (powerComponentId === undefined) return published[0];

  if (next) {
    const nextItem = published.find((item) => item.id > powerComponentId);
    return nextItem ?? published[0];
  }

  return published.find((item) => item.id === powerComponentId) ?? null;
};
