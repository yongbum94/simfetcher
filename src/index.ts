import { Request, type WrapperResponse } from './Request';

export type { Request, WrapperResponse };

/**
 * 요청을 위한 베이스 생성
 * @returns {Request}
 */
export function create() {
  return new Request();
}

/**
 * GET 요청
 * @param {string} url 요청 URL 주소
 * @param {object|undefined} query query 값
 * @returns {Promise<WrapperResponse<T>>}
 */
export function get<T>(url: string, query?: Record<string, string>) {
  return create().get<T>(url, query);
}

/**
 * POST 요청
 * @param {string} url 요청 URL 주소
 * @param {XMLHttpRequestBodyInit|undefined} body Body 값
 * @returns {Promise<WrapperResponse<T>>}
 */
export function post<T>(url: string, body?: XMLHttpRequestBodyInit) {
  return create().post<T>(url, body);
}

/**
 * PUT 요청
 * @param {string} url 요청 URL 주소
 * @param {XMLHttpRequestBodyInit|undefined} body Body 값
 * @returns {Promise<WrapperResponse<T>>}
 */
export function put<T>(url: string, body?: XMLHttpRequestBodyInit) {
  return create().put<T>(url, body);
}

/**
 * PATCH 요청
 * @param {string} url 요청 URL 주소
 * @param {XMLHttpRequestBodyInit|undefined} body Body 값
 * @returns {Promise<WrapperResponse<T>>}
 */
export function patch<T>(url: string, body?: XMLHttpRequestBodyInit) {
  return create().patch<T>(url, body);
}

/**
 * DELETE 요청
 * @param {string} url 요청 URL 주소
 * @param {XMLHttpRequestBodyInit|undefined} body Body 값
 * @returns {Promise<WrapperResponse<T>>}
 */
export function del<T>(url: string, body?: XMLHttpRequestBodyInit) {
  return create().delete<T>(url, body);
}

export default { create, get, post, put, patch, del, delete: del };
