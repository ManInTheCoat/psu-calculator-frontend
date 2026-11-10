// Кодогенерация клиента веб-сервиса из Swagger (OpenAPI) бэкенда.
// Запуск при работающем бэкенде: npm run generate-api
// Результат - src/api/Api.ts (axios), руками этот файл не редактируется.

import { resolve } from 'path';
import { generateApi } from 'swagger-typescript-api';

// FastAPI формирует operationId вида get_power_components_api_power_components_get.
// Отрезаем хвост с адресом и HTTP-методом, остаётся имя функции бэкенда:
// get_power_components -> getPowerComponents, like_power_component -> likePowerComponent
const toRouteName = (operationId) =>
  operationId
    .replace(/_api_.+$/, '')
    .replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase());

await generateApi({
  fileName: 'Api.ts',
  output: resolve(process.cwd(), './src/api'),
  url: 'http://127.0.0.1:8000/openapi.json',
  httpClientType: 'axios',
  // Модули клиента по тегам бэкенда: api.powerComponents.*, api.users.*
  moduleNameFirstTag: true,
  hooks: {
    onFormatRouteName: (routeInfo, templateRouteName) =>
      routeInfo.operationId ? toRouteName(routeInfo.operationId) : templateRouteName,
  },
});
