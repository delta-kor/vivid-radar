import qs from 'qs';

export type RequestMethod = 'GET' | 'POST';
export type RequestQuery = Record<string, string | number>;
export type RequestHeaders = Record<string, string>;
export type RequestPayloadType = 'json';
export type ResponseType = 'json' | 'text';

export interface RequestConfig {
  url: string;
  method: RequestMethod;
  headers?: RequestHeaders;
  query?: RequestQuery;
  payload?: any;
  requestType?: RequestPayloadType;
  responseType?: ResponseType;
  encoder?: (data: any) => any;
}

export interface Response<T> {
  data: T;
  headers: Record<string, string>;
}

export default class Request<T> {
  constructor(private readonly config: RequestConfig) {}

  public async send(): Promise<Response<T>> {
    const endpoint = this.config.url;
    const query = this.config.query
      ? qs.stringify(this.config.query, { encoder: this.config.encoder })
      : '';
    const url = query ? `${endpoint}?${query}` : endpoint;
    console.log(url);

    const requestInit: RequestInit = {
      method: this.config.method,
    };

    if (this.config.requestType === 'json') {
      requestInit.body = JSON.stringify(this.config.payload);
      requestInit.headers = {
        'Content-Type': 'application/json',
      };
    }

    if (this.config.headers) {
      requestInit.headers = {
        ...requestInit.headers,
        ...this.config.headers,
      };
    }

    const response = await fetch(url, requestInit);

    if (this.config.responseType === 'text') {
      const data = await response.text();
      return {
        data: data as T,
        headers: Object.fromEntries(response.headers),
      };
    } else {
      const data = await response.json();
      return {
        data: data,
        headers: Object.fromEntries(response.headers),
      };
    }
  }
}
