import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from ".";

// Ошибка thunk-а: текст для страницы и HTTP-код ответа бэкенда (если он был)
export interface ThunkError {
  message: string;
  status?: number;
}

// createAsyncThunk с типами нашего хранилища: getState() возвращает RootState,
// rejectWithValue принимает ThunkError
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: ThunkError;
}>();
