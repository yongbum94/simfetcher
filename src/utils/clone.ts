export function clone<T extends any>(target: any): T {
  if (typeof target !== 'object' || target === null) return target;
  if (Array.isArray(target)) {
    return target.map((v) => clone(v)) as T;
  } else {
    const result: any = {};
    Object.keys(target).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        result[key] = clone(target[key]);
      }
    });
    return result as T;
  }
}
