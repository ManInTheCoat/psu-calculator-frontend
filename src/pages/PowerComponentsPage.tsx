import type { FC } from "react";
import { useEffect } from "react";
import { Alert, Col, Row, Spinner } from "react-bootstrap";
import { POWER_MAX, POWER_MIN, POWER_STEP } from "../api/powerComponentsApi";
import { LoadingOverlay } from "../components/LoadingOverlay/LoadingOverlay";
import { MockNotice } from "../components/MockNotice/MockNotice";
import { PowerComponentCard } from "../components/PowerComponentCard/PowerComponentCard";
import { PowerFilter } from "../components/PowerFilter/PowerFilter";
import { useAppDispatch, useAppSelector } from "../store";
import {
  applyMaxPowerFilter,
  deletePowerComponent,
  getPowerComponentsList,
  setMaxPower,
} from "../store/powerComponentsSlice";

// Плитка: каталог опубликованных компонентов в два столбца с фильтром по мощности.
// Фильтр и список хранятся в Redux (слайс powerComponents), запросы - в thunk-ах.
const PowerComponentsPage: FC = () => {
  const dispatch = useAppDispatch();
  const { maxPower, items, loading, deletingId, fromMock, error } = useAppSelector(
    (state) => state.powerComponents,
  );
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  // Загрузка при открытии страницы, а также после входа и выхода:
  // меняются признаки is_mine и сбрасывается фильтр
  useEffect(() => {
    dispatch(getPowerComponentsList());
  }, [dispatch, isAuthenticated]);

  // Кнопка «Найти»: ползунок -> фильтр в хранилище -> запрос с max_power
  const handleSearch = () => {
    dispatch(applyMaxPowerFilter());
    dispatch(getPowerComponentsList());
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Удалить компонент?")) {
      dispatch(deletePowerComponent(id));
    }
  };

  const busy = loading || deletingId !== null;

  return (
    <>
      <PowerFilter
        value={maxPower}
        min={POWER_MIN}
        max={POWER_MAX}
        step={POWER_STEP}
        disabled={busy}
        onChange={(value) => dispatch(setMaxPower(value))}
        onSearch={handleSearch}
      />

      {fromMock && <MockNotice />}
      {error && <Alert variant="danger">{error}</Alert>}

      {loading && items.length === 0 && (
        <div className="pageSpinner">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="pageMessage">
          По заданному ограничению мощности компоненты не найдены.
        </p>
      )}

      {items.length > 0 && (
        <Row xs={2} className="g-3">
          {items.map((powerComponent) => (
            <Col key={powerComponent.id}>
              <PowerComponentCard
                powerComponent={powerComponent}
                onDelete={isAuthenticated && powerComponent.is_mine ? handleDelete : undefined}
                disabled={busy}
              />
            </Col>
          ))}
        </Row>
      )}

      <LoadingOverlay show={busy && items.length > 0} />
    </>
  );
};

export default PowerComponentsPage;
