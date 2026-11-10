import type { FC } from "react";
import { Alert } from "react-bootstrap";

// Плашка: бэкенд недоступен, показаны данные из mock-коллекции
export const MockNotice: FC = () => (
  <Alert variant="warning" className="mockNotice">
    Сервер недоступен - показаны демонстрационные данные
  </Alert>
);
