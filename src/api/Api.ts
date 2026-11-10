/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Body_create_power_component_api_power_components_post */
export interface BodyCreatePowerComponentApiPowerComponentsPost {
  /**
   * Title
   * Название компонента
   * @minLength 1
   * @maxLength 100
   */
  title: string;
  /**
   * Image
   * Фото: PNG, JPEG, GIF, WEBP до 5 МБ
   */
  image?: File | null;
  /**
   * Video
   * Короткое видео: MP4, MOV, WEBM до 50 МБ
   */
  video?: File | null;
}

/** ErrorDetail */
export interface ErrorDetail {
  /** Detail */
  detail: string;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** PowerComponentDeletedSerializer */
export interface PowerComponentDeletedSerializer {
  /** Id */
  id: number;
  /** Status */
  status: string;
}

/**
 * PowerComponentFeedSerializer
 * Карточка ленты: вложенная сериализация создателя (creator).
 */
export interface PowerComponentFeedSerializer {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Description */
  description: string | null;
  /** Image Url */
  image_url: string;
  /** Video Url */
  video_url: string;
  /** Power Watt */
  power_watt: number | null;
  /** Weight Gram */
  weight_gram: number | null;
  /** Formed At */
  formed_at: string | null;
  creator: UserSerializer;
  /** Likes Count */
  likes_count: number;
  /**
   * Is Liked
   * 1 - текущий пользователь уже поставил лайк, иначе 0. Нужен ленте: закрашенное или пустое сердце и какое значение like отправить в POST лайка
   */
  is_liked: number;
  /**
   * Is Mine
   * 1 - компонент создан текущим пользователем, иначе 0. Нужен ленте, чтобы показать кнопку удаления у своей карточки
   */
  is_mine: number;
}

/**
 * PowerComponentLikeRequest
 * Тело POST лайка: 1 - поставить лайк, 0 - отменить.
 */
export interface PowerComponentLikeRequest {
  /**
   * Like
   * @min 0
   * @max 1
   */
  like: number;
}

/** PowerComponentLikeSerializer */
export interface PowerComponentLikeSerializer {
  /** Power Component Id */
  power_component_id: number;
  /** Is Liked */
  is_liked: number;
  /** Likes Count */
  likes_count: number;
}

/**
 * PowerComponentListItemSerializer
 * Карточка в плитке (списке).
 */
export interface PowerComponentListItemSerializer {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Image Url */
  image_url: string;
  /** Power Watt */
  power_watt: number | null;
  /** Weight Gram */
  weight_gram: number | null;
  /** Likes Count */
  likes_count: number;
  /**
   * Is Mine
   * 1 - компонент создан текущим пользователем, иначе 0. Нужен плитке: кнопка «Удалить» показывается только у своих карточек
   */
  is_mine: number;
}

/**
 * PowerComponentPublishRequest
 * Тело PUT публикации: дозаполнение черновика полями по теме.
 */
export interface PowerComponentPublishRequest {
  /**
   * Description
   * @minLength 1
   * @maxLength 500
   */
  description: string;
  /**
   * Power Watt
   * Потребляемая мощность, Вт
   * @exclusiveMin 0
   * @max 500
   */
  power_watt: number;
  /**
   * Weight Gram
   * Вес, г
   * @exclusiveMin 0
   * @max 100000
   */
  weight_gram: number;
}

/**
 * PowerComponentSerializer
 * Компонент со всеми полями таблицы power_components (черновик, публикация).
 */
export interface PowerComponentSerializer {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Description */
  description: string | null;
  /** Status */
  status: string;
  /** Image Url */
  image_url: string;
  /** Video Url */
  video_url: string;
  /** Power Watt */
  power_watt: number | null;
  /** Weight Gram */
  weight_gram: number | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /** Formed At */
  formed_at: string | null;
  /** Creator Id */
  creator_id: number;
}

/** UserLoginRequest */
export interface UserLoginRequest {
  /**
   * Login
   * @minLength 1
   * @maxLength 50
   */
  login: string;
  /**
   * Password
   * @minLength 1
   * @maxLength 128
   */
  password: string;
}

/** UserRegisterRequest */
export interface UserRegisterRequest {
  /**
   * Login
   * @minLength 3
   * @maxLength 50
   * @pattern ^[A-Za-z0-9_.-]+$
   */
  login: string;
  /**
   * Password
   * @minLength 6
   * @maxLength 128
   */
  password: string;
}

/** UserSerializer */
export interface UserSerializer {
  /** Id */
  id: number;
  /** Login */
  login: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title PC Power Calc
 * @version 0.1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  powerComponents = {
    /**
     * No description
     *
     * @tags power_components
     * @name GetPowerComponents
     * @summary Список опубликованных компонентов с фильтрацией по мощности
     * @request GET:/api/power_components
     */
    getPowerComponents: (
      query?: {
        /**
         * Max Power
         * Мощность до, Вт
         */
        max_power?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        PowerComponentListItemSerializer[],
        ErrorDetail | HTTPValidationError
      >({
        path: `/api/power_components`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags power_components
     * @name CreatePowerComponent
     * @summary Добавление черновика с фото и видео
     * @request POST:/api/power_components
     * @secure
     */
    createPowerComponent: (
      data: BodyCreatePowerComponentApiPowerComponentsPost,
      params: RequestParams = {},
    ) =>
      this.request<
        PowerComponentSerializer,
        ErrorDetail | HTTPValidationError
      >({
        path: `/api/power_components`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags power_components
     * @name GetPowerComponentFeed
     * @summary Лента: без ид - первый опубликованный, с ид - этот компонент, с ид и next=true - следующий
     * @request GET:/api/power_components/feed
     */
    getPowerComponentFeed: (
      query?: {
        /**
         * Power Component Id
         * ID компонента; для панели вкладок не указывается
         */
        power_component_id?: number | null;
        /**
         * Next
         * true - следующий опубликованный после ID
         * @default false
         */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        PowerComponentFeedSerializer,
        ErrorDetail | HTTPValidationError
      >({
        path: `/api/power_components/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags power_components
     * @name GetPowerComponentDraft
     * @summary Черновик текущего пользователя
     * @request GET:/api/power_components/draft
     * @secure
     */
    getPowerComponentDraft: (params: RequestParams = {}) =>
      this.request<PowerComponentSerializer, ErrorDetail>({
        path: `/api/power_components/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags power_components
     * @name PublishPowerComponent
     * @summary Публикация черновика: draft -> published
     * @request PUT:/api/power_components/{power_component_id}/publish
     * @secure
     */
    publishPowerComponent: (
      powerComponentId: number,
      data: PowerComponentPublishRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        PowerComponentSerializer,
        ErrorDetail | HTTPValidationError
      >({
        path: `/api/power_components/${powerComponentId}/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags power_components
     * @name DeletePowerComponent
     * @summary Логическое удаление своего компонента (статус deleted)
     * @request DELETE:/api/power_components/{power_component_id}
     * @secure
     */
    deletePowerComponent: (
      powerComponentId: number,
      params: RequestParams = {},
    ) =>
      this.request<
        PowerComponentDeletedSerializer,
        ErrorDetail | HTTPValidationError
      >({
        path: `/api/power_components/${powerComponentId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags power_components
     * @name LikePowerComponent
     * @summary Лайк от текущего пользователя: like=1 ставит, like=0 отменяет
     * @request POST:/api/power_components/{power_component_id}/like
     * @secure
     */
    likePowerComponent: (
      powerComponentId: number,
      data: PowerComponentLikeRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        PowerComponentLikeSerializer,
        ErrorDetail | HTTPValidationError
      >({
        path: `/api/power_components/${powerComponentId}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name RegisterUser
     * @summary Регистрация нового пользователя
     * @request POST:/api/users/register
     */
    registerUser: (data: UserRegisterRequest, params: RequestParams = {}) =>
      this.request<UserSerializer, ErrorDetail | HTTPValidationError>({
        path: `/api/users/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name LoginUser
     * @summary Аутентификация: создаёт сессию в Redis и ставит куку session_id
     * @request POST:/api/users/login
     */
    loginUser: (data: UserLoginRequest, params: RequestParams = {}) =>
      this.request<UserSerializer, ErrorDetail | HTTPValidationError>({
        path: `/api/users/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name LogoutUser
     * @summary Деавторизация: удаляет сессию из Redis и куку
     * @request POST:/api/users/logout
     * @secure
     */
    logoutUser: (params: RequestParams = {}) =>
      this.request<void, ErrorDetail>({
        path: `/api/users/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
}
