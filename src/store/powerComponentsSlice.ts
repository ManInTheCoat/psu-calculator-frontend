import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api, getErrorMessage, getErrorStatus, isBackendUnavailable } from "../api";
import { getPowerComponentsMock, POWER_MAX } from "../api/powerComponentsApi";
import type { PowerComponentListItem } from "../api/types";
import { createAppAsyncThunk } from "./createAppAsyncThunk";
import { resetUser } from "./userSlice";

// Плитка: фильтр по мощности и список опубликованных компонентов

interface PowerComponentsState {
  maxPower: number; // значение ползунка «Мощность до N Вт»
  appliedMaxPower: number | null; // фильтр, применённый кнопкой «Найти» (null - без фильтра)
  items: PowerComponentListItem[];
  loading: boolean; // загрузка списка
  deletingId: number | null; // id компонента, который сейчас удаляется
  fromMock: boolean; // бэкенд недоступен, список из mock-коллекции
  error: string | null;
}

const initialState: PowerComponentsState = {
  maxPower: POWER_MAX,
  appliedMaxPower: null,
  items: [],
  loading: false,
  deletingId: null,
  fromMock: false,
  error: null,
};

interface PowerComponentsListResult {
  items: PowerComponentListItem[];
  fromMock: boolean;
}

// GET /api/power_components?max_power=... (сгенерированный api.powerComponents.getPowerComponents).
// Фильтр берётся из хранилища. Если бэкенд недоступен, гость получает mock-коллекцию.
export const getPowerComponentsList = createAppAsyncThunk<PowerComponentsListResult, void>(
  "powerComponents/getPowerComponentsList",
  async (_, { getState, rejectWithValue }) => {
    const { powerComponents, user } = getState();
    const maxPower = powerComponents.appliedMaxPower ?? undefined;

    try {
      const response = await api.powerComponents.getPowerComponents(
        maxPower === undefined ? {} : { max_power: maxPower },
      );
      return { items: response.data, fromMock: false };
    } catch (error) {
      if (!user.isAuthenticated && isBackendUnavailable(error)) {
        return { items: getPowerComponentsMock(maxPower), fromMock: true };
      }
      return rejectWithValue({
        message: getErrorMessage(error, "Не удалось загрузить компоненты"),
        status: getErrorStatus(error),
      });
    }
  },
);

// DELETE /api/power_components/{id} - логическое удаление своего компонента
export const deletePowerComponent = createAppAsyncThunk<number, number>(
  "powerComponents/deletePowerComponent",
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

const powerComponentsSlice = createSlice({
  name: "powerComponents",
  initialState,
  reducers: {
    // Движение ползунка
    setMaxPower(state, action: PayloadAction<number>) {
      state.maxPower = action.payload;
    },
    // Кнопка «Найти»: значение ползунка становится фильтром запроса
    applyMaxPowerFilter(state) {
      state.appliedMaxPower = state.maxPower;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPowerComponentsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPowerComponentsList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.fromMock = action.payload.fromMock;
      })
      .addCase(getPowerComponentsList.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.fromMock = false;
        state.error = action.payload?.message ?? "Не удалось загрузить компоненты";
      })
      .addCase(deletePowerComponent.pending, (state, action) => {
        state.deletingId = action.meta.arg;
        state.error = null;
      })
      .addCase(deletePowerComponent.fulfilled, (state, action) => {
        state.deletingId = null;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deletePowerComponent.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload?.message ?? "Не удалось удалить компонент";
      })
      // Выход пользователя: фильтр сбрасывается
      .addCase(resetUser, (state) => {
        state.maxPower = initialState.maxPower;
        state.appliedMaxPower = initialState.appliedMaxPower;
      });
  },
});

export const { setMaxPower, applyMaxPowerFilter } = powerComponentsSlice.actions;
export default powerComponentsSlice.reducer;
