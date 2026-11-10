import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../api/types";

// Состояние интерфейса: гость или авторизованный пользователь.
// Запросы входа и выхода выполняются через axios на странице (src/api/authApi.ts),
// результат передаётся сюда вручную через setUser и resetUser - без thunk.
// После F5 состояние снова гостевое, но кука session_id в браузере остаётся.

interface UserState {
  id: number | null;
  login: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  id: null,
  login: "",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Успешный POST /api/users/login
    setUser(state, action: PayloadAction<User>) {
      state.id = action.payload.id;
      state.login = action.payload.login;
      state.isAuthenticated = true;
    },
    // POST /api/users/logout. Это же действие сбрасывает фильтр и черновик в других слайсах
    resetUser() {
      return initialState;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
