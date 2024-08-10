import { clone, merge } from '../src/utils';

const INIT_SOURCE_OBJ = () => ({
  nul: null,
  und: undefined,
  num: 20,
  str: 'str',
  arr: [{ num: 1 }, 'str'],
  foo: 'foo',
  obj: {
    obj: { str: 'str' },
  },
});

describe('Utils', () => {
  describe('clone()', () => {
    it('should be Return Equal Object', () => {
      const target = INIT_SOURCE_OBJ();
      const result = clone(target);
      expect(target).toEqual(result);
    });

    it('should be obj !== clone(obj)', () => {
      const target = { obj: {} };
      const result = clone(target);
      expect(target !== result).toBe(true);
    });
  });

  describe('merge()', () => {
    it('should be append propertys..', () => {
      const source = INIT_SOURCE_OBJ();
      const dest = { foo: 'foo', arr: [0], obj: { newer: 'newer' } };
      const result = merge(source, dest);
      expect(result).toEqual({
        ...INIT_SOURCE_OBJ(),
        foo: 'foo',
        arr: [0, 'str'],
        obj: {
          newer: 'newer',
          obj: { str: 'str' },
        },
      });
    });
  });
});
