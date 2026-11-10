import "./TabBar.css";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../api/authApi";
import { LOGOUT_LABEL, ROUTES, ROUTE_LABELS, type RouteKeyType } from "../../Routes";
import { useAppDispatch, useAppSelector } from "../../store";
import { resetUser } from "../../store/userSlice";
import { LoadingOverlay } from "../LoadingOverlay/LoadingOverlay";

interface TabBarItem {
  key: RouteKeyType;
  icon: string;
}

// 4 пункта меню. «Добавление» доступно только после входа,
// последний пункт - «Вход» для гостя и «Выход» для пользователя.
const TAB_BAR_ITEMS: TabBarItem[] = [
  { key: "FEED", icon: "◉" },
  { key: "DRAFT", icon: "⊕" },
  { key: "TILE", icon: "▦" },
  { key: "LOGIN", icon: "⇥" },
];

const isActiveTab = (key: RouteKeyType, pathname: string) =>
  key === "FEED" ? pathname.startsWith(ROUTES.FEED) : pathname === ROUTES[key];

export const TabBar: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const [loggingOut, setLoggingOut] = useState(false);

  // Выход: POST /api/users/logout через axios, затем вручную сбрасываем Redux.
  // resetUser сбрасывает и фильтр плитки, и черновик.
  // 401 (сессия уже истекла) - тоже выход: на сервере сессии и так нет.
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
    } catch {
      // сессии на сервере нет или сервер недоступен - интерфейс всё равно возвращаем гостю
    } finally {
      dispatch(resetUser());
      setLoggingOut(false);
      navigate(ROUTES.TILE);
    }
  };

  const renderContent = (icon: string, label: string): ReactNode => (
    <>
      <span className="tabBar__icon">{icon}</span>
      <span className="tabBar__label">{label}</span>
    </>
  );

  const renderItem = (item: TabBarItem): ReactNode => {
    if (item.key === "LOGIN" && isAuthenticated) {
      return (
        <Nav.Link as="button" className="tabBar__item" onClick={handleLogout} disabled={loggingOut}>
          {renderContent("⇤", LOGOUT_LABEL)}
        </Nav.Link>
      );
    }

    if (item.key === "DRAFT" && !isAuthenticated) {
      return (
        <Nav.Link className="tabBar__item" disabled>
          {renderContent(item.icon, ROUTE_LABELS[item.key])}
        </Nav.Link>
      );
    }

    return (
      <Nav.Link
        as={Link}
        to={ROUTES[item.key]}
        className="tabBar__item"
        active={isActiveTab(item.key, pathname)}
      >
        {renderContent(item.icon, ROUTE_LABELS[item.key])}
      </Nav.Link>
    );
  };

  return (
    <>
      <Navbar fixed="bottom" className="tabBar">
        <Nav className="tabBar__nav">
          {TAB_BAR_ITEMS.map((item) => (
            <Nav.Item key={item.key} className="tabBar__cell">
              {renderItem(item)}
            </Nav.Item>
          ))}
        </Nav>
      </Navbar>
      <LoadingOverlay show={loggingOut} />
    </>
  );
};
