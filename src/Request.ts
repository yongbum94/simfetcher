import { BaseRequest } from './BaseRequest';

export interface WrapperResponse<T extends any> extends Response {
  jsonbody: T;
}

export class Request extends BaseRequest {
  _method = '';

  private async _fetch<T extends any>() {
    let url = this._base + this._url;

    if (this._searchParams.size > 0) {
      url += '&' + this._searchParams.toString();
    }

    const res = (await fetch(url, {
      method: this._method,
      headers: this._header,
      credentials: this._credentials,
      cache: this._cache,
      keepalive: this._keepalive,
      body: this._body,
    })) as WrapperResponse<T>;

    // safe json body
    try {
      res.jsonbody = (await res.json()) as T;
    } catch {
      res.jsonbody = {} as T;
    }

    return res;
  }

  get<T>(url?: string, query?: Record<string, string>) {
    this._method = 'GET';
    if (url) this._url = url;
    if (query) this.query(query);
    return this._fetch<T>();
  }

  post<T>(url?: string, body?: XMLHttpRequestBodyInit) {
    this._method = 'POST';
    if (url) this._url = url;
    if (body) this._body = body;
    return this._fetch<T>();
  }

  put<T>(url?: string, body?: XMLHttpRequestBodyInit) {
    this._method = 'PUT';
    if (url) this._url = url;
    if (body) this._body = body;
    return this._fetch<T>();
  }

  patch<T>(url?: string, body?: XMLHttpRequestBodyInit) {
    this._method = 'PATCH';
    if (url) this._url = url;
    if (body) this._body = body;
    return this._fetch<T>();
  }

  delete<T>(url?: string, body?: XMLHttpRequestBodyInit) {
    this._method = 'DELETE';
    if (url) this._url = url;
    if (body) this._body = body;
    return this._fetch<T>();
  }
}
