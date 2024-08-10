export function cloneDeep<T>(target: any): T {
  if (typeof target !== 'object' || target === null) return target;
  if (Array.isArray(target)) {
    return target.map((v) => cloneDeep(v)) as T;
  } else {
    const result: any = {};
    Object.keys(target).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        result[key] = cloneDeep(target[key]);
      }
    });
    return result as T;
  }
}
