import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import draftReducer from "./draftSlice";
import feedReducer from "./feedSlice";
import powerComponentsReducer from "./powerComponentsSlice";
import userReducer from "./userSlice";

// Хранилище Redux Toolkit. Middleware redux-thunk подключается configureStore по умолчанию.
//   user            - гость или авторизованный пользователь
//   powerComponents - плитка: фильтр по мощности и список компонентов
//   feed            - лента: текущий компонент, лайк, удаление
//   draft           - добавление: черновик пользователя и его публикация
export const store = configureStore({
  reducer: {
    user: userReducer,
    powerComponents: powerComponentsReducer,
    feed: feedReducer,
    draft: draftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Типизированные хуки для компонентов
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
