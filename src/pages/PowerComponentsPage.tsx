import type { FC } from "react";
import { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import {
  getPowerComponents,
  POWER_MAX,
  POWER_MIN,
  POWER_STEP,
} from "../api/powerComponentsApi";
import type { PowerComponentListItem } from "../api/types";
import { PowerComponentCard } from "../components/PowerComponentCard/PowerComponentCard";
import { PowerFilter } from "../components/PowerFilter/PowerFilter";

// Значение max_power из адреса страницы: целое от 0 до 500, иначе фильтра нет
const parseMaxPower = (value: string | null): number | undefined => {
  if (value === null || value.trim() === "") return undefined;
  const maxPower = Number(value);
  if (!Number.isInteger(maxPower) || maxPower < POWER_MIN || maxPower > POWER_MAX) {
    return undefined;
  }
  return maxPower;
};

// Плитка: каталог опубликованных компонентов в два столбца с фильтром по мощности
const PowerComponentsPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const appliedMaxPower = parseMaxPower(searchParams.get("max_power"));

  const [maxPower, setMaxPower] = useState(appliedMaxPower ?? POWER_MAX);
  const [powerComponents, setPowerComponents] = useState<PowerComponentListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка списка при открытии страницы и при смене фильтра в адресе
  useEffect(() => {
    let ignore = false;
    setLoading(true);

    getPowerComponents(appliedMaxPower).then((list) => {
      if (ignore) return;
      setPowerComponents(list);
      setLoading(false);
    });

    // Ответ на устаревший запрос не записываем (смена фильтра или уход со страницы)
    return () => {
      ignore = true;
    };
  }, [appliedMaxPower]);

  // Ползунок повторяет фильтр из адреса, в том числе при переходе «Назад»
  useEffect(() => {
    setMaxPower(appliedMaxPower ?? POWER_MAX);
  }, [appliedMaxPower]);

  const handleSearch = () => {
    setSearchParams({ max_power: String(maxPower) });
  };

  const handleReset = () => {
    setMaxPower(POWER_MAX);
    setSearchParams({});
  };

  return (
    <>
      <PowerFilter
        value={maxPower}
        min={POWER_MIN}
        max={POWER_MAX}
        step={POWER_STEP}
        disabled={loading}
        onChange={setMaxPower}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {loading && (
        <div className="pageSpinner">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {!loading && powerComponents.length === 0 && (
        <p className="pageMessage">
          По заданному ограничению мощности компоненты не найдены.
        </p>
      )}

      {!loading && powerComponents.length > 0 && (
        <Row xs={2} className="g-3">
          {powerComponents.map((powerComponent) => (
            <Col key={powerComponent.id}>
              <PowerComponentCard powerComponent={powerComponent} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default PowerComponentsPage;
