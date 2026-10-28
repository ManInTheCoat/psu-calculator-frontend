import "./TabBar.css";
import type { FC, ReactNode } from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { ROUTES, ROUTE_LABELS, type RouteKeyType } from "../../Routes";

interface TabBarItem {
  key: RouteKeyType;
  icon: string;
  disabled: boolean;
}

// 4 пункта меню, в ЛР5 доступны только Лента и Плитка
const TAB_BAR_ITEMS: TabBarItem[] = [
  { key: "FEED", icon: "◉", disabled: false },
  { key: "DRAFT", icon: "⊕", disabled: true },
  { key: "TILE", icon: "▦", disabled: false },
  { key: "LOGIN", icon: "⇥", disabled: true },
];

const isActiveTab = (key: RouteKeyType, pathname: string) =>
  key === "FEED" ? pathname.startsWith(ROUTES.FEED) : pathname === ROUTES[key];

export const TabBar: FC = () => {
  const { pathname } = useLocation();

  const renderContent = (item: TabBarItem): ReactNode => (
    <>
      <span className="tabBar__icon">{item.icon}</span>
      <span className="tabBar__label">{ROUTE_LABELS[item.key]}</span>
    </>
  );

  return (
    <Nav as="nav" className="tabBar">
      {TAB_BAR_ITEMS.map((item) => (
        <Nav.Item key={item.key} className="tabBar__cell">
          {item.disabled ? (
            <Nav.Link className="tabBar__item" disabled>
              {renderContent(item)}
            </Nav.Link>
          ) : (
            <Nav.Link
              as={Link}
              to={ROUTES[item.key]}
              className="tabBar__item"
              active={isActiveTab(item.key, pathname)}
            >
              {renderContent(item)}
            </Nav.Link>
          )}
        </Nav.Item>
      ))}
    </Nav>
  );
};
