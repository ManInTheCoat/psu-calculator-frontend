import axios from "axios";
import { Api } from "./Api";

// Экземпляр сгенерированного клиента (src/api/Api.ts).
// Адреса методов в Swagger уже начинаются с /api, поэтому baseURL пустой:
// запросы уходят на dev-сервер (127.0.0.1:3000/api/...), а он проксирует их на бэкенд.
// Кука session_id ставится на тот же адрес и отправляется браузером сама.
export const api = new Api({
  baseURL: "",
});

// Бэкенд недоступен: ответа нет совсем, либо прокси Vite не достучался до бэкенда
// и сам ответил 500 с пустым телом. Ошибка самого бэкенда (FastAPI) приходит с {"detail": ...}.
export const isBackendUnavailable = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;
  const { response } = error;
  if (!response) return true;
  const hasDetail =
    typeof response.data === "object" && response.data !== null && "detail" in response.data;
  return response.status >= 500 && !hasDetail;
};

// Текст ошибки для страницы: detail от бэкенда или общее сообщение
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const detail = (error.response?.data as { detail?: unknown } | undefined)?.detail;
    if (typeof detail === "string") return detail;
    if (!error.response || isBackendUnavailable(error)) return "Сервер недоступен";
  }
  return fallback;
};

export const getErrorStatus = (error: unknown): number | undefined =>
  axios.isAxiosError(error) ? error.response?.status : undefined;
