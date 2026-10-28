import type { FC } from "react";
import { Link, Outlet } from "react-router-dom";
import { TabBar } from "./components/TabBar/TabBar";
import { ROUTES } from "./Routes";

// Общая обёртка: шапка, содержимое страницы и нижняя панель вкладок
export const AppLayout: FC = () => (
  <div className="appShell">
    <header className="appHeader">
      <Link className="appHeader__logo" to={ROUTES.TILE}>
        PC Power Calc
      </Link>
    </header>
    <main className="appContent">
      <Outlet />
    </main>
    <TabBar />
  </div>
);
