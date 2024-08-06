export abstract class BaseRequest {
  _url = '';
  _base = '';
  _header: Record<string, string> = {};
  _credentials: RequestCredentials = 'same-origin';
  _searchParams = new URLSearchParams();
  _cache: RequestCache = 'default';
  _keepalive: boolean = false;
  _body?: XMLHttpRequestBodyInit;

  base(url: string) {
    this._base = url;
    return this;
  }

  url(url: string) {
    this._url = url;
    return this;
  }

  header(key: string, value: string) {
    this._header[key] = value;
    return this;
  }

  headers(header: Record<string, string> | [string, string][]) {
    if (Array.isArray(header)) {
      this._header = {}; // reset
      header.forEach(([key, value]) => this.header(key, value));
    } else {
      this._header = header;
    }
    return this;
  }

  cache(mode: RequestCache) {
    this._cache = mode;
    return this;
  }

  keepalive(active?: boolean) {
    this._keepalive = !(active === false);
  }

  cookie(key: string, value: string) {
    if (typeof this._header.Cookie !== 'string') {
      this._header.Cookie = '';
    }
    this._header.Cookie += `${key}=${value}; `;
    return this;
  }

  credentials(mode: RequestCredentials | boolean) {
    if (mode === true) {
      this._credentials = 'include';
    } else if (mode === false) {
      this._credentials = 'omit';
    } else {
      this._credentials = mode;
    }
    return this;
  }

  query(key: string | Record<string, string>, value?: string): BaseRequest {
    if (typeof key === 'string' && typeof value === 'string') {
      this._searchParams.set(key, value);
    } else {
      Object.entries(key).forEach(([_key, _value]) => this._searchParams.set(_key, _value));
    }
    return this;
  }

  auth(value: string, key: string = 'Authorization') {
    return this.header(key, value);
  }

  body(body: XMLHttpRequestBodyInit) {
    this._body = body;
    return this;
  }
}
