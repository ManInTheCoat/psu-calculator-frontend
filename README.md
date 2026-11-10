# PC Power Calc - фронтенд

Тема 18: определение необходимой мощности блока питания для ПК.
Услуга - компонент ПК (`power_component`) с потребляемой мощностью и весом.

Бэкенд: [psu-calculator-backend](https://github.com/ManInTheCoat/psu-calculator-backend).

Стек: React 19, TypeScript, Vite, React-Bootstrap (Bootstrap 5), React Router, Redux Toolkit (redux-thunk), axios, swagger-typescript-api.

## Лабораторная 6 - интерфейс пользователя, Redux Toolkit и axios

Данные карточек приходят из веб-сервиса. Добавлены авторизация, страница добавления компонента, удаление своих компонентов и лайки. Фильтр, списки и состояние интерфейса (гость или пользователь) хранятся в Redux Toolkit. Запросы к домену компонентов выполняются сгенерированным из Swagger клиентом axios внутри thunk-ов.

### Запуск

1. Запустить бэкенд (`python main.py`, `http://127.0.0.1:8000`), PostgreSQL, MinIO и Redis - см. README бэкенда.
2. Установить зависимости и запустить фронтенд:

```bash
npm install
npm run dev
```

Приложение открывается по адресу `http://127.0.0.1:3000`.

- `npm run generate-api` - кодогенерация клиента `src/api/Api.ts` из Swagger бэкенда (бэкенд должен быть запущен)
- `npm run build` - проверка типов и сборка в папку `dist`
- `npm run lint` - проверка кода ESLint

Если бэкенд не запущен, гость видит плитку и ленту из mock-коллекции `src/api/mock.ts` (сверху выводится «Сервер недоступен - показаны демонстрационные данные»). После входа mock не используется: при недоступном бэкенде выводится ошибка.

### Прокси (CORS)

Браузер обращается только к dev-серверу Vite `127.0.0.1:3000`, поэтому запросы с другого адреса не нужны и ограничение CORS не возникает. Два маршрута в `vite.config.ts`:

| Маршрут на фронтенде | Куда проксируется | Что |
|---|---|---|
| `/api/...` | `http://127.0.0.1:8000/api/...` | веб-сервис |
| `/power-components/...` | `http://127.0.0.1:9000/power-components/...` | файлы S3 (MinIO), бакет `power-components` |

Бэкенд отдаёт полные ссылки MinIO (`http://localhost:9000/power-components/power_component_8_image_1a2b3c4d.png`). Функция `toMediaUrl` (`src/media.ts`) оставляет от них путь `/power-components/...`, поэтому фото и видео тоже идут через прокси. Во вкладке Network видны адреса `127.0.0.1:3000/api/power_components?max_power=300` и `127.0.0.1:3000/power-components/power_component_..._image_....png`.

Кука `session_id` ставится бэкендом на адрес `127.0.0.1:3000` (через прокси) и отправляется браузером со всеми запросами `/api`.

### Кодогенерация

`scripts/generate-api.mjs` читает `http://127.0.0.1:8000/openapi.json` и создаёт `src/api/Api.ts` (`swagger-typescript-api`, клиент `axios`). Модули клиента - по тегам Swagger, имена методов - по именам функций бэкенда (из `operationId` FastAPI отрезается хвост с адресом и методом):

| Метод клиента | HTTP-метод бэкенда | Где используется |
|---|---|---|
| `api.powerComponents.getPowerComponents({ max_power })` | `GET /api/power_components` | thunk `getPowerComponentsList` |
| `api.powerComponents.getPowerComponentFeed({ power_component_id, next })` | `GET /api/power_components/feed` | thunk `getFeedItem` |
| `api.powerComponents.getPowerComponentDraft()` | `GET /api/power_components/draft` | thunk `getDraft` |
| `api.powerComponents.createPowerComponent({ title, image, video })` | `POST /api/power_components` (multipart) | thunk `createDraft` |
| `api.powerComponents.publishPowerComponent(id, { description, power_watt, weight_gram })` | `PUT /api/power_components/{id}/publish` | thunk `publishDraft` |
| `api.powerComponents.deletePowerComponent(id)` | `DELETE /api/power_components/{id}` | thunk-и `deletePowerComponent`, `deleteFeedItem`, `deleteDraft` |
| `api.powerComponents.likePowerComponent(id, { like })` | `POST /api/power_components/{id}/like` | thunk `toggleFeedLike` |

Экземпляр клиента создаётся в `src/api/index.ts` с пустым `baseURL`: адреса в Swagger уже начинаются с `/api`.

Вход и выход выполняются без кодогенерации и thunk - напрямую через `axios` (`src/api/authApi.ts`), результат страница сама передаёт в Redux.

### Redux Toolkit

Хранилище - `src/store/index.ts`, middleware `redux-thunk` подключается `configureStore` по умолчанию. Типизированные хуки `useAppDispatch` и `useAppSelector`.

| Слайс | Состояние | Действия (reducers) | Thunk-и |
|---|---|---|---|
| `user` | `id`, `login`, `isAuthenticated` | `setUser` (после входа), `resetUser` (после выхода) | - |
| `powerComponents` | `maxPower` - ползунок, `appliedMaxPower` - применённый фильтр, `items`, `loading`, `deletingId`, `fromMock`, `error` | `setMaxPower`, `applyMaxPowerFilter` | `getPowerComponentsList`, `deletePowerComponent` |
| `feed` | `item`, `loading`, `actionLoading`, `notFound`, `fromMock`, `error` | - | `getFeedItem`, `toggleFeedLike`, `deleteFeedItem` |
| `draft` | `draft`, `loaded`, `loading`, `publishedId`, `error` | `clearPublishedId` | `getDraft`, `createDraft`, `publishDraft`, `deleteDraft` |

- Действие `resetUser` обрабатывают и другие слайсы: при выходе сбрасывается фильтр плитки, черновик и признаки `is_liked` / `is_mine` в ленте.
- Mock-коллекция подставляется внутри thunk-ов `getPowerComponentsList` и `getFeedItem`, только если пользователь - гость и бэкенд недоступен (нет ответа или прокси Vite ответил 500 без тела `{"detail": ...}`).
- Состояние Redux живёт до перезагрузки страницы: после F5 интерфейс снова гостевой, а кука `session_id` остаётся в браузере (DevTools, Application, Cookies, `http://127.0.0.1:3000`).

### Анимация запросов

Пока выполняется запрос, поверх страницы показывается `LoadingOverlay` - полупрозрачный слой со спиннером, который перехватывает клики. Кнопки страницы на это время тоже отключаются (`disabled`).

## Страницы

| Адрес | Страница | Доступ |
|---|---|---|
| `/` | перенаправление на плитку | все |
| `/power_components` | Плитка | все |
| `/power_components/feed` | Лента, первый компонент | все |
| `/power_components/feed/3` | Лента, компонент с id 3 | все |
| `/power_components/feed/3?next=true` | Лента, следующий компонент после id 3 (после последнего снова первый) | все |
| `/power_components/draft` | Добавление | после входа |
| `/login` | Вход | гость |

### Плитка - `/power_components`

Каталог опубликованных компонентов в два столбца.

| Элемент | Описание |
|---|---|
| Ползунок «Мощность до N Вт» | Значение фильтра от 0 до 500 Вт с шагом 10, хранится в Redux (`maxPower`) |
| Кнопка «Найти» | Значение ползунка становится фильтром (`applyMaxPowerFilter`) и выполняется `GET /api/power_components?max_power=...`. Фильтр сохраняется при переходах между страницами и сбрасывается при выходе |
| Карточка компонента | Фото, название, мощность (⚡ Вт), количество лайков (♥). Клик по карточке открывает ленту с этим компонентом |
| Кнопка «Удалить» | Только у своих карточек (`is_mine = 1`) после входа. `DELETE /api/power_components/{id}`, карточка убирается из списка |

Если подходящих компонентов нет, выводится сообщение «По заданному ограничению мощности компоненты не найдены».

### Лента - `/power_components/feed/:id`

Один компонент на весь экран в вертикальном формате: видео проигрывается автоматически (без звука, по кругу), информация расположена поверх видео.

| Элемент | Описание |
|---|---|
| Видео | Видео компонента, до начала воспроизведения - его фото как обложка |
| Название и описание | Внизу слева. Длинное описание обрезается до 70 символов |
| Кнопка «ещё» / «скрыть» | Показывает полное описание или снова сворачивает его |
| ⚡ Вт, ⚖ г | Справа: поля по теме - потребляемая мощность и вес |
| ♥ / ♡ и число | Лайк. После входа - кнопка: при `is_liked = 0` отправляется `like = 1`, при `is_liked = 1` - `like = 0`. У гостя неактивна |
| Кнопка «Удалить» | Только у своего компонента (`is_mine = 1`) после входа. После удаления открывается следующий компонент |
| Кнопка «След. →» | Переход к следующему компоненту: `/power_components/feed/{id}?next=true` |

Для несуществующего id выводится «Компонент не найден» и кнопка «К плитке». Неизвестный адрес перенаправляется на плитку.

### Добавление - `/power_components/draft`

Доступно после входа, гостю выводится сообщение и кнопка «Войти». Сверху блок фото и видео, ниже - текст и поля по теме.

| Состояние | Элементы | Запрос |
|---|---|---|
| Черновика нет | Фото, видео (выбор файлов с предпросмотром), название, кнопка «Далее» | `POST /api/power_components` (multipart/form-data) - создаётся черновик, файлы сохраняются в MinIO |
| Черновик есть | Фото, видео и название черновика; краткое описание, мощность (1-500 Вт), вес (1-100000 г), кнопки «Опубликовать» и «Удалить черновик» | `PUT /api/power_components/{id}/publish`, затем переход в ленту на опубликованный компонент; `DELETE /api/power_components/{id}` |

При открытии страницы выполняется `GET /api/power_components/draft` (404 - черновика нет).

### Вход - `/login`

Поля «Логин» и «Пароль», кнопка «Войти». `POST /api/users/login` через axios, ответ `{ id, login }` передаётся в Redux (`setUser`), затем переход на плитку. Неверные данные - «Неверный логин или пароль».

### Нижняя панель вкладок

4 пункта: «Лента», «Добавление», «Плитка», «Вход». Для гостя «Добавление» неактивно. После входа «Добавление» доступно, последний пункт становится «Выход», а в шапке выводится логин пользователя. «Выход» - `POST /api/users/logout` через axios и `resetUser` в Redux; интерфейс возвращается к гостевому, фильтр сбрасывается. Пункт текущей страницы выделен оранжевым.

## Фото и видео по умолчанию

Файлы лежат в самом проекте, в папке `public`: `default-component.png` и `default-component.mp4` (`src/media.ts`).

- Пустое поле `image_url` - в карточке плитки, на обложке видео ленты и на странице добавления выводится `default-component.png`.
- Пустое поле `video_url` - в ленте проигрывается `default-component.mp4`.
- Ссылка заполнена, но файл не загрузился (например, MinIO не запущен) - фото подменяется в обработчике `onError`, видео переключается на заглушку через состояние `videoFailed` в `FeedVideo`.

В mock-коллекции у компонентов 4 и 6 поля `image_url` и `video_url` пустые.

## Компоненты

| Компонент | Props | Назначение |
|---|---|---|
| `AppLayout` | - | Шапка с логином пользователя, `Outlet` для страниц и нижняя панель вкладок |
| `TabBar` | - | Нижняя панель из 4 пунктов (`Navbar`, `Nav`, `Nav.Link`), выход пользователя |
| `PowerFilter` | `value`, `min`, `max`, `step`, `disabled`, `onChange`, `onSearch` | Фильтр плитки по мощности (`Form`, `Form.Range`, `Button`) |
| `PowerComponentCard` | `powerComponent`, `onDelete`, `disabled` | Карточка плитки (`Card`, `Badge`), кнопка «Удалить» у своих карточек |
| `FeedVideo` | `videoUrl`, `imageUrl`, `title` | Видео ленты с заглушками |
| `FeedParam` | `icon`, `value`, `accent`, `onClick`, `disabled`, `title` | Плашка справа на ленте; с `onClick` - кнопка лайка |
| `LoadingOverlay` | `show` | Анимация запроса, блокирующая кнопки |
| `MockNotice` | - | Плашка «Сервер недоступен - показаны демонстрационные данные» |

Значение ползунка хранится в Redux, в `PowerFilter` оно передаётся через props `value` и `onChange` (`setMaxPower`), нажатие «Найти» возвращается в страницу через `onSearch`.

## Хуки

| Хук | Где | Зачем |
|---|---|---|
| `useAppSelector` (`useSelector`) | страницы, `AppLayout`, `TabBar` | чтение состояния Redux: фильтр и список, лента, черновик, пользователь |
| `useAppDispatch` (`useDispatch`) | страницы, `TabBar` | отправка действий и thunk-ов |
| `useState` | `LoginPage` | поля формы, `loading`, `error` |
| `useState` | `PowerComponentDraftPage` | поля форм создания и публикации, выбранные файлы и ссылки для предпросмотра |
| `useState` | `PowerComponentFeedPage` | развёрнуто ли описание `expanded` |
| `useState` | `FeedVideo` | `videoFailed` - видео не загрузилось, нужна заглушка |
| `useState` | `TabBar` | `loggingOut` - выполняется выход |
| `useEffect` | `PowerComponentsPage` | загрузка списка при открытии страницы, после входа и выхода |
| `useEffect` | `PowerComponentFeedPage` | загрузка компонента при смене `id` или `next` в адресе, после входа и выхода |
| `useEffect` | `PowerComponentDraftPage` | загрузка черновика; переход в ленту после публикации; ссылки предпросмотра файлов |
| `useSearchParams` | `PowerComponentFeedPage` | чтение `next` |
| `useParams` | `PowerComponentFeedPage` | `id` компонента из адреса |
| `useNavigate` | страницы, `TabBar` | переходы по кнопкам |
| `useLocation` | `TabBar` | выделение пункта текущей страницы |

## Структура проекта

| Папка / файл | Назначение |
|---|---|
| `vite.config.ts` | Dev-сервер и прокси `/api` и `/power-components` |
| `scripts/generate-api.mjs` | Кодогенерация клиента из Swagger |
| `src/main.tsx` | Точка входа, `Provider` хранилища Redux, стили Bootstrap |
| `src/App.tsx` | Маршруты приложения |
| `src/Routes.ts` | Адреса страниц и подписи пунктов меню |
| `src/AppLayout.tsx` | Общая обёртка страниц |
| `src/api/Api.ts` | Сгенерированный клиент веб-сервиса (axios) и типы ответов |
| `src/api/index.ts` | Экземпляр клиента `api`, разбор ошибок axios |
| `src/api/authApi.ts` | Вход и выход через axios |
| `src/api/types.ts` | Короткие имена сгенерированных типов |
| `src/api/mock.ts` | Mock-коллекция компонентов |
| `src/api/powerComponentsApi.ts` | Ответы списка и ленты из mock-коллекции |
| `src/store/` | Хранилище и слайсы Redux Toolkit |
| `src/media.ts` | Фото и видео по умолчанию, ссылки MinIO через прокси |
| `src/components/` | Компоненты интерфейса |
| `src/pages/` | Страницы: плитка, лента, добавление, вход |
| `src/index.css` | Цвета приложения (как в ЛР1) и общие стили |
| `public/` | Фото и видео по умолчанию, иконка |

## Лабораторная 5 - базовое SPA на React

Интерфейс гостя из двух страниц ЛР1: `плитка` и `лента` на mock-коллекции, без бэкенда и Redux. Код ЛР5 - в ветке `lab5-react`.
