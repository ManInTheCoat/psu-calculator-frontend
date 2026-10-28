import type { PowerComponentFeedItem } from "./types";

// Mock-коллекция опубликованных компонентов ПК.
// Поля такие же, как в ответе ленты веб-сервиса, список строится из них же.
// У компонентов 4 и 6 пустые image_url и video_url - для них показываются
// фото и видео по умолчанию из папки public.

const MINIO_BUCKET_URL = "http://localhost:9000/power-components";

const builder = { id: 1, login: "builder" };
const pcMaster = { id: 2, login: "pc_master" };

export const POWER_COMPONENTS_MOCK: PowerComponentFeedItem[] = [
  {
    id: 1,
    title: "Intel Core i5-13600K",
    description:
      "14 ядер, разгоняемый, лучший баланс цены и производительности для игровой сборки. " +
      "Требует хорошего охлаждения при работе под нагрузкой.",
    image_url: `${MINIO_BUCKET_URL}/cpu-i5-13600k.jpg`,
    video_url: `${MINIO_BUCKET_URL}/cpu-i5-13600k.mp4`,
    power_watt: 125,
    weight_gram: 55,
    formed_at: "2026-09-15T10:00:00",
    creator: builder,
    likes_count: 3,
    is_liked: 0,
    is_mine: 0,
  },
  {
    id: 2,
    title: "NVIDIA RTX 4070",
    description:
      "Оптимальная видеокарта для разрешения 1440p, поддержка DLSS 3, " +
      "тихая работа под нагрузкой и умеренное энергопотребление.",
    image_url: `${MINIO_BUCKET_URL}/gpu-rtx-4070.jpg`,
    video_url: `${MINIO_BUCKET_URL}/gpu-rtx-4070.mp4`,
    power_watt: 200,
    weight_gram: 1050,
    formed_at: "2026-09-15T10:05:00",
    creator: builder,
    likes_count: 4,
    is_liked: 0,
    is_mine: 0,
  },
  {
    id: 3,
    title: "AMD Ryzen 7 7800X3D",
    description:
      "Лидер по игровой производительности благодаря технологии 3D V-Cache, " +
      "невысокий нагрев и низкое энергопотребление для своего класса.",
    image_url: `${MINIO_BUCKET_URL}/cpu-7800x3d.jpg`,
    video_url: `${MINIO_BUCKET_URL}/cpu-7800x3d.mp4`,
    power_watt: 120,
    weight_gram: 50,
    formed_at: "2026-09-15T10:10:00",
    creator: pcMaster,
    likes_count: 7,
    is_liked: 0,
    is_mine: 0,
  },
  {
    id: 4,
    title: "Kingston FURY Beast 32 ГБ DDR5",
    description:
      "Комплект из двух модулей оперативной памяти DDR5-6000 по 16 ГБ " +
      "с низкопрофильными радиаторами, профили XMP 3.0 и EXPO.",
    image_url: "",
    video_url: "",
    power_watt: 10,
    weight_gram: 70,
    formed_at: "2026-09-16T12:00:00",
    creator: pcMaster,
    likes_count: 2,
    is_liked: 0,
    is_mine: 0,
  },
  {
    id: 5,
    title: "RTX 4080 Super",
    description:
      "Производительная видеокарта для разрешения 4K. Требует мощного блока " +
      "питания и хорошей продувки корпуса.",
    image_url: `${MINIO_BUCKET_URL}/gpu-4080-super.jpg`,
    video_url: `${MINIO_BUCKET_URL}/gpu-4080-super.mp4`,
    power_watt: 320,
    weight_gram: 2050,
    formed_at: "2026-09-16T12:10:00",
    creator: builder,
    likes_count: 5,
    is_liked: 0,
    is_mine: 0,
  },
  {
    id: 6,
    title: "Samsung 990 PRO 2 ТБ",
    description:
      "Твердотельный накопитель M.2 NVMe PCIe 4.0 со скоростью чтения до 7450 МБ/с, " +
      "подходит для системы и игр.",
    image_url: "",
    video_url: "",
    power_watt: 9,
    weight_gram: 9,
    formed_at: "2026-09-17T09:30:00",
    creator: pcMaster,
    likes_count: 1,
    is_liked: 0,
    is_mine: 0,
  },
  {
    id: 7,
    title: "ASUS TUF Gaming RTX 4080",
    description:
      "Надёжная и холодная видеокарта с металлическим кожухом и вентиляторами " +
      "повышенной прочности. Усиленная система охлаждения снижает шум.",
    image_url: `${MINIO_BUCKET_URL}/gpu-asus-tuf-4080.jpg`,
    video_url: `${MINIO_BUCKET_URL}/gpu-asus-tuf-4080.mp4`,
    power_watt: 320,
    weight_gram: 2380,
    formed_at: "2026-09-17T09:40:00",
    creator: builder,
    likes_count: 5,
    is_liked: 0,
    is_mine: 0,
  },
];
