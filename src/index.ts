import { Request } from './Request.js';

export function create() {
  return new Request();
}

export function get(url: string, query?: Record<string, string>) {
  return create().get(url, query).call();
}

export function post(url: string, body?: XMLHttpRequestBodyInit) {
  return create().post(url, body).call();
}

export function put(url: string, body?: XMLHttpRequestBodyInit) {
  return create().put(url, body).call();
}

export function patch(url: string, body?: XMLHttpRequestBodyInit) {
  return create().patch(url, body).call();
}

export function del(url: string, body?: XMLHttpRequestBodyInit) {
  return create().delete(url, body).call();
}

export default { create, get, post, put, patch, del, delete: del };
