import type { FC } from "react";
import { Spinner } from "react-bootstrap";

interface LoadingOverlayProps {
  show: boolean;
}

// Анимация на время запроса: полупрозрачный слой поверх приложения со спиннером.
// Слой перехватывает клики, поэтому кнопки пользователя заблокированы до ответа.
export const LoadingOverlay: FC<LoadingOverlayProps> = ({ show }) =>
  show ? (
    <div className="loadingOverlay" role="status" aria-live="polite">
      <Spinner animation="border" className="loadingOverlay__spinner" />
    </div>
  ) : null;
