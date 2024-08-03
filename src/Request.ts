import { BaseRequest } from './BaseRequest.js';

export interface WrapperResponse<T extends any> extends Response {
  jsonbody: T;
}

export class Request extends BaseRequest {
  private _url = '';
  private _method = '';

  get(url: string, query?: Record<string, string>) {
    this._url = url;
    this._method = 'GET';
    if (query) this.query(query);
    return this;
  }

  post(url: string, body?: XMLHttpRequestBodyInit) {
    this._url = url;
    this._method = 'POST';
    if (body) this._body = body;
    return this;
  }

  put(url: string, body?: XMLHttpRequestBodyInit) {
    this._url = url;
    this._method = 'PUT';
    if (body) this._body = body;
    return this;
  }

  patch(url: string, body?: XMLHttpRequestBodyInit) {
    this._url = url;
    this._method = 'PATCH';
    if (body) this._body = body;
    return this;
  }

  delete(url: string, body?: XMLHttpRequestBodyInit) {
    this._url = url;
    this._method = 'DELETE';
    if (body) this._body = body;
    return this;
  }

  async call<T>() {
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
}
