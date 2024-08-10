export function transferUrl(url: string, params: Record<string, any>) {
  const reg = /:[^\s/]+/;
  const matcher = url.match(reg);
  if (!matcher) return url;
  const key = matcher[0].substring(1);
  const _url = url.replace(matcher[0], params[key] || '');
  return transferUrl(_url, params);
}
