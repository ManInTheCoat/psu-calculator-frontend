import type { FC } from "react";
import { Link, Outlet } from "react-router-dom";
import { TabBar } from "./components/TabBar/TabBar";
import { ROUTES } from "./Routes";
import { useAppSelector } from "./store";

// Общая обёртка: шапка, содержимое страницы и нижняя панель вкладок.
// В шапке справа - логин пользователя после авторизации.
export const AppLayout: FC = () => {
  const { isAuthenticated, login } = useAppSelector((state) => state.user);

  return (
    <div className="appShell">
      <header className="appHeader">
        <Link className="appHeader__logo" to={ROUTES.TILE}>
          PC Power Calc
        </Link>
        {isAuthenticated && <span className="appHeader__user">👤 {login}</span>}
      </header>
      <main className="appContent">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
};
