const URL_REGEX = /:[^\s/]+/;

export function transferUrl(url: string, params: Record<string, any>) {
  const matcher = url.match(URL_REGEX);
  if (!matcher) return url;

  let pattern = matcher[0];
  const key = pattern.substring(1);
  let value = params[key];

  if (value === '' || typeof value === 'undefined') {
    pattern = '/' + pattern;
    value = '';
  }

  return transferUrl(url.replace(pattern, value), params);
}
