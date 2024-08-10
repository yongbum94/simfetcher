export function merge<T extends any>(target: any, dest: any): T {
  Object.keys(dest).forEach((key) => {
    const value = dest[key];
    if (typeof value !== 'object' || value === null) {
      target[key] = value;
    } else {
      target[key] = merge(target[key] || {}, value);
    }
  });
  return target as T;
}
