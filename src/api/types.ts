// Типы повторяют ответы веб-сервиса (ЛР3, методы 1 и 2 домена power_components)

export type Flag = 0 | 1;

// Элемент списка: GET /api/power_components?max_power=...
export interface PowerComponentListItem {
  id: number;
  title: string;
  image_url: string;
  power_watt: number;
  weight_gram: number;
  likes_count: number;
  is_mine: Flag;
}

export interface PowerComponentCreator {
  id: number;
  login: string;
}

// Карточка ленты: GET /api/power_components/feed?power_component_id=...&next=true
export interface PowerComponentFeedItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  video_url: string;
  power_watt: number;
  weight_gram: number;
  formed_at: string;
  creator: PowerComponentCreator;
  likes_count: number;
  is_liked: Flag;
  is_mine: Flag;
}
