import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { ROUTES } from "./Routes";
import LoginPage from "./pages/LoginPage";
import PowerComponentDraftPage from "./pages/PowerComponentDraftPage";
import PowerComponentFeedPage from "./pages/PowerComponentFeedPage";
import PowerComponentsPage from "./pages/PowerComponentsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to={ROUTES.TILE} replace />} />
          <Route path={ROUTES.TILE} element={<PowerComponentsPage />} />
          <Route path={ROUTES.FEED} element={<PowerComponentFeedPage />} />
          <Route path={`${ROUTES.FEED}/:id`} element={<PowerComponentFeedPage />} />
          <Route path={ROUTES.DRAFT} element={<PowerComponentDraftPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path="*" element={<Navigate to={ROUTES.TILE} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
