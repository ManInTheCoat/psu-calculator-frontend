import { createSlice } from "@reduxjs/toolkit";
import { api, getErrorMessage, getErrorStatus, isBackendUnavailable } from "../api";
import { getPowerComponentFeedMock } from "../api/powerComponentsApi";
import type { PowerComponentFeedItem } from "../api/types";
import { createAppAsyncThunk } from "./createAppAsyncThunk";
import { resetUser } from "./userSlice";

// Лента: один компонент, лайк и удаление своего компонента

interface FeedState {
  item: PowerComponentFeedItem | null;
  loading: boolean; // загрузка компонента
  actionLoading: boolean; // выполняется лайк или удаление
  notFound: boolean; // бэкенд ответил 404
  fromMock: boolean; // бэкенд недоступен, компонент из mock-коллекции
  error: string | null;
}

const initialState: FeedState = {
  item: null,
  loading: false,
  actionLoading: false,
  notFound: false,
  fromMock: false,
  error: null,
};

interface FeedQuery {
  powerComponentId?: number; // без id - первый опубликованный (пункт «Лента» в меню)
  next: boolean; // true - следующий после powerComponentId
}

interface FeedResult {
  item: PowerComponentFeedItem;
  fromMock: boolean;
}

// GET /api/power_components/feed?power_component_id=...&next=true
export const getFeedItem = createAppAsyncThunk<FeedResult, FeedQuery>(
  "feed/getFeedItem",
  async ({ powerComponentId, next }, { getState, rejectWithValue }) => {
    try {
      const response = await api.powerComponents.getPowerComponentFeed(
        powerComponentId === undefined
          ? {}
          : { power_component_id: powerComponentId, next },
      );
      return { item: response.data, fromMock: false };
    } catch (error) {
      if (!getState().user.isAuthenticated && isBackendUnavailable(error)) {
        const item = getPowerComponentFeedMock(powerComponentId, next);
        if (item) return { item, fromMock: true };
        return rejectWithValue({ message: "Компонент не найден", status: 404 });
      }
      return rejectWithValue({
        message: getErrorMessage(error, "Не удалось загрузить ленту"),
        status: getErrorStatus(error),
      });
    }
  },
);

// POST /api/power_components/{id}/like: при is_liked = 0 отправляется like = 1, при is_liked = 1 - like = 0
export const toggleFeedLike = createAppAsyncThunk(
  "feed/toggleFeedLike",
  async (_: void, { getState, rejectWithValue }) => {
    const { item } = getState().feed;
    if (!item) return rejectWithValue({ message: "Компонент не загружен" });

    try {
      const response = await api.powerComponents.likePowerComponent(item.id, {
        like: item.is_liked ? 0 : 1,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: getErrorMessage(error, "Не удалось поставить лайк"),
        status: getErrorStatus(error),
      });
    }
  },
);

// DELETE /api/power_components/{id} - удаление своего компонента из ленты
export const deleteFeedItem = createAppAsyncThunk<number, number>(
  "feed/deleteFeedItem",
  async (powerComponentId, { rejectWithValue }) => {
    try {
      await api.powerComponents.deletePowerComponent(powerComponentId);
      return powerComponentId;
    } catch (error) {
      return rejectWithValue({
        message: getErrorMessage(error, "Не удалось удалить компонент"),
        status: getErrorStatus(error),
      });
    }
  },
);

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedItem.pending, (state) => {
        state.loading = true;
        state.notFound = false;
        state.error = null;
      })
      .addCase(getFeedItem.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload.item;
        state.fromMock = action.payload.fromMock;
      })
      .addCase(getFeedItem.rejected, (state, action) => {
        state.loading = false;
        state.item = null;
        state.fromMock = false;
        state.notFound = action.payload?.status === 404;
        state.error = action.payload?.message ?? "Не удалось загрузить ленту";
      })
      .addCase(toggleFeedLike.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(toggleFeedLike.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (state.item && state.item.id === action.payload.power_component_id) {
          state.item.is_liked = action.payload.is_liked;
          state.item.likes_count = action.payload.likes_count;
        }
      })
      .addCase(toggleFeedLike.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message ?? "Не удалось поставить лайк";
      })
      .addCase(deleteFeedItem.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteFeedItem.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(deleteFeedItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message ?? "Не удалось удалить компонент";
      })
      // После выхода признаки is_liked / is_mine прежнего пользователя не показываем
      .addCase(resetUser, (state) => {
        if (state.item) {
          state.item.is_liked = 0;
          state.item.is_mine = 0;
        }
      });
  },
});

export default feedSlice.reducer;
