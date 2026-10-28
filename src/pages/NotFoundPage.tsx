import type { FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";

const NotFoundPage: FC = () => (
  <div className="pageMessage">
    <p>Страница не найдена.</p>
    <Link to={ROUTES.TILE}>Перейти к плитке</Link>
  </div>
);

export default NotFoundPage;
