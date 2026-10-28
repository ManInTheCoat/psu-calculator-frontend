export const ROUTES = {
  FEED: "/power_components/feed",
  DRAFT: "/power_components/draft",
  TILE: "/power_components",
  LOGIN: "/login",
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  FEED: "Лента",
  DRAFT: "Добавление",
  TILE: "Плитка",
  LOGIN: "Вход",
};
