import { createSlice } from "@reduxjs/toolkit";
import { api, getErrorMessage, getErrorStatus } from "../api";
import type { PowerComponentPublishRequest } from "../api/Api";
import type { PowerComponentDraft } from "../api/types";
import { createAppAsyncThunk } from "./createAppAsyncThunk";
import { resetUser } from "./userSlice";

// Добавление: черновик текущего пользователя.
// Шаг 1 - название, фото и видео, кнопка «Далее» (POST, создаётся черновик).
// Шаг 2 - описание и поля по теме, кнопка «Опубликовать» (PUT публикации).

interface DraftState {
  draft: PowerComponentDraft | null;
  loaded: boolean; // GET черновика выполнен (черновик есть или его нет)
  loading: boolean; // выполняется любой запрос страницы
  publishedId: number | null; // id опубликованного компонента для перехода в ленту
  error: string | null;
}

const initialState: DraftState = {
  draft: null,
  loaded: false,
  loading: false,
  publishedId: null,
  error: null,
};

export interface DraftCreateForm {
  title: string;
  image: File | null;
  video: File | null;
}

// GET /api/power_components/draft. 404 - черновика нет, это не ошибка
export const getDraft = createAppAsyncThunk<PowerComponentDraft | null, void>(
  "draft/getDraft",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.powerComponents.getPowerComponentDraft();
      return response.data;
    } catch (error) {
      if (getErrorStatus(error) === 404) return null;
      return rejectWithValue({
        message: getErrorMessage(error, "Не удалось загрузить черновик"),
        status: getErrorStatus(error),
      });
    }
  },
);

// POST /api/power_components (multipart/form-data): название, фото и видео.
// Пустые файлы в форму не добавляются - тогда бэкенд оставляет ссылки пустыми.
export const createDraft = createAppAsyncThunk<PowerComponentDraft, DraftCreateForm>(
  "draft/createDraft",
  async ({ title, image, video }, { rejectWithValue }) => {
    try {
      const response = await api.powerComponents.createPowerComponent({
        title,
        ...(image ? { image } : {}),
        ...(video ? { video } : {}),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: getErrorMessage(error, "Не удалось создать черновик"),
        status: getErrorStatus(error),
      });
    }
  },
);

// PUT /api/power_components/{id}/publish: draft -> published
export const publishDraft = createAppAsyncThunk<PowerComponentDraft, PowerComponentPublishRequest>(
  "draft/publishDraft",
  async (form, { getState, rejectWithValue }) => {
    const { draft } = getState().draft;
    if (!draft) return rejectWithValue({ message: "Черновик не найден" });

    try {
      const response = await api.powerComponents.publishPowerComponent(draft.id, form);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: getErrorMessage(error, "Не удалось опубликовать компонент"),
        status: getErrorStatus(error),
      });
    }
  },
);

// DELETE /api/power_components/{id} - удаление черновика
export const deleteDraft = createAppAsyncThunk<number, void>(
  "draft/deleteDraft",
  async (_, { getState, rejectWithValue }) => {
    const { draft } = getState().draft;
    if (!draft) return rejectWithValue({ message: "Черновик не найден" });

    try {
      await api.powerComponents.deletePowerComponent(draft.id);
      return draft.id;
    } catch (error) {
      return rejectWithValue({
        message: getErrorMessage(error, "Не удалось удалить черновик"),
        status: getErrorStatus(error),
      });
    }
  },
);

const draftSlice = createSlice({
  name: "draft",
  initialState,
  reducers: {
    // Переход в ленту выполнен
    clearPublishedId(state) {
      state.publishedId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.draft = action.payload;
      })
      .addCase(getDraft.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.draft = null;
        state.error = action.payload?.message ?? "Не удалось загрузить черновик";
      })
      .addCase(createDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.draft = action.payload;
      })
      .addCase(createDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Не удалось создать черновик";
      })
      .addCase(publishDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.draft = null;
        state.publishedId = action.payload.id;
      })
      .addCase(publishDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Не удалось опубликовать компонент";
      })
      .addCase(deleteDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDraft.fulfilled, (state) => {
        state.loading = false;
        state.draft = null;
      })
      .addCase(deleteDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Не удалось удалить черновик";
      })
      // Выход пользователя: черновик принадлежал ему, сбрасываем
      .addCase(resetUser, () => initialState);
  },
});

export const { clearPublishedId } = draftSlice.actions;
export default draftSlice.reducer;
