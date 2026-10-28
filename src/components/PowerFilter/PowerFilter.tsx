import "./PowerFilter.css";
import type { FC, FormEvent } from "react";
import { Button, Form } from "react-bootstrap";

interface PowerFilterProps {
  value: number;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  onChange: (value: number) => void;
  onSearch: () => void;
}

// Фильтр плитки по мощности: ползунок «Мощность до N Вт» и кнопка «Найти»
export const PowerFilter: FC<PowerFilterProps> = ({
  value,
  min,
  max,
  step,
  disabled = false,
  onChange,
  onSearch,
}) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <Form className="powerFilter" onSubmit={handleSubmit}>
      <Form.Label className="powerFilter__label" htmlFor="max_power">
        Мощность до <b className="powerFilter__value">{value} Вт</b>
      </Form.Label>
      <div className="powerFilter__row">
        <Form.Range
          id="max_power"
          className="powerFilter__slider"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <Button type="submit" variant="accent" disabled={disabled}>
          Найти
        </Button>
      </div>
      <div className="powerFilter__scale">
        <span>{min} Вт</span>
        <span>{max} Вт</span>
      </div>
    </Form>
  );
};
