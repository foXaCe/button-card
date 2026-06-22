import { describe, it, expect } from 'vitest';
import { deepEqual } from '../src/deep-equal';

describe('deepEqual', () => {
  it('compares primitives', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual('a', 'a')).toBe(true);
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual(true, false)).toBe(false);
  });

  it('treats NaN as equal to NaN', () => {
    expect(deepEqual(NaN, NaN)).toBe(true);
  });

  it('handles null and undefined', () => {
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(undefined, undefined)).toBe(true);
    expect(deepEqual(null, {})).toBe(false);
    expect(deepEqual(undefined, null)).toBe(false);
  });

  it('compares nested objects deeply', () => {
    expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
    expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })).toBe(false);
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it('compares arrays', () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(deepEqual([{ a: 1 }], [{ a: 1 }])).toBe(true);
  });

  it('compares Map and Set', () => {
    expect(
      deepEqual(
        new Map([['a', 1]]),
        new Map([['a', 1]]),
      ),
    ).toBe(true);
    expect(
      deepEqual(
        new Map([['a', 1]]),
        new Map([['a', 2]]),
      ),
    ).toBe(false);
    expect(deepEqual(new Set([1, 2]), new Set([1, 2]))).toBe(true);
    expect(deepEqual(new Set([1]), new Set([1, 2]))).toBe(false);
  });

  it('compares Date and RegExp by value', () => {
    expect(deepEqual(new Date(0), new Date(0))).toBe(true);
    expect(deepEqual(new Date(0), new Date(1))).toBe(false);
    expect(deepEqual(/abc/g, /abc/g)).toBe(true);
    expect(deepEqual(/abc/g, /abc/i)).toBe(false);
  });

  it('returns false for mismatched constructors or object-vs-primitive', () => {
    expect(deepEqual({}, [])).toBe(false);
    expect(deepEqual({ a: 1 }, 'a')).toBe(false);
  });

  it('compares typed arrays element-wise', () => {
    expect(deepEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]))).toBe(true);
    expect(deepEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4]))).toBe(false);
    expect(deepEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2, 3]))).toBe(false);
  });
});
