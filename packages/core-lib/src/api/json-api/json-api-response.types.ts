/**
 * @link https://jsonapi.org/format/#errors
 */
export type JsonApiError = {
  /** a short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization. */
  title: string;
  /** a unique identifier for this particular occurrence of the problem. */
  id?: string | number;
  /** the HTTP status code applicable to this problem, expressed as a string value. */
  status?: number;
  /** an application-specific error code, expressed as a string value. */
  code?: string;
  /** a human-readable explanation specific to this occurrence of the problem. Like title, this field’s value can be localized. */
  detail?: string;
  /** a string indicating which URI query parameter caused the error. */
  parameter?: string;
  /** a meta object containing non-standard meta-information about the error. */
  meta?: Record<string, unknown>;
};

export type JsonApiErrorResponse = {
  success: false;
  errors: JsonApiError[];
};

export type JsonApiResponseMeta = {
  meta?: {
    cacheHit?: boolean;
  } & Record<string, string | number | boolean>;
};

export type JsonApiSuccessResponse<T> = {
  success: true;
  data: T;
} & JsonApiResponseMeta;

export type JsonApiResponse<T> =
  | JsonApiErrorResponse
  | JsonApiSuccessResponse<T>;
