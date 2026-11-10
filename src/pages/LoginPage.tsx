import "./LoginPage.css";
import type { FC, SubmitEvent } from "react";
import { useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getErrorMessage, getErrorStatus } from "../api";
import { loginUser, type LoginForm } from "../api/authApi";
import { LoadingOverlay } from "../components/LoadingOverlay/LoadingOverlay";
import { ROUTES } from "../Routes";
import { useAppDispatch, useAppSelector } from "../store";
import { setUser } from "../store/userSlice";

// Вход: логин и пароль. Запрос POST /api/users/login выполняется через axios,
// ответ { id, login } вручную передаётся в Redux (setUser) - без thunk и кодогенерации.
const LoginPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, login } = useAppSelector((state) => state.user);

  const [form, setForm] = useState<LoginForm>({ login: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await loginUser({ login: form.login.trim(), password: form.password });
      dispatch(setUser(user));
      navigate(ROUTES.TILE);
    } catch (requestError) {
      setError(
        getErrorStatus(requestError) === 401
          ? "Неверный логин или пароль"
          : getErrorMessage(requestError, "Не удалось войти"),
      );
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="pageMessage">
        <p>Вы вошли как {login}.</p>
        <Button variant="accent" onClick={() => navigate(ROUTES.TILE)}>
          К плитке
        </Button>
      </div>
    );
  }

  return (
    <div className="login">
      <h1 className="login__title">Вход</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="login">
          <Form.Label className="login__label">Логин</Form.Label>
          <Form.Control
            name="login"
            autoComplete="username"
            value={form.login}
            required
            onChange={(event) => setForm({ ...form, login: event.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label className="login__label">Пароль</Form.Label>
          <Form.Control
            type="password"
            name="password"
            autoComplete="current-password"
            value={form.password}
            required
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </Form.Group>
        <Button
          type="submit"
          variant="accent"
          className="login__submit"
          disabled={loading || !form.login.trim() || !form.password}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Войти"}
        </Button>
      </Form>
      <LoadingOverlay show={loading} />
    </div>
  );
};

export default LoginPage;
