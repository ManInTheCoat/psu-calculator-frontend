import axios from "axios";
import type { UserSerializer } from "./Api";

// Авторизация и деавторизация - только axios, без кодогенерации и thunk.
// Результат запроса страница сама передаёт в Redux (setUser / resetUser).
// Кука session_id (HttpOnly) приходит в Set-Cookie и хранится браузером.

export interface LoginForm {
  login: string;
  password: string;
}

// POST /api/users/login -> { id, login } и кука session_id
export const loginUser = async (form: LoginForm): Promise<UserSerializer> => {
  const response = await axios.post<UserSerializer>("/api/users/login", form);
  return response.data;
};

// POST /api/users/logout -> 204, сессия удаляется из Redis, кука удаляется
export const logoutUser = async (): Promise<void> => {
  await axios.post("/api/users/logout");
};
