import { describe, it, expect } from 'vitest';
import { parseDuration } from '../src/common/parse-duration';

describe('parseDuration', () => {
  it('returns undefined for undefined input', () => {
    expect(parseDuration(undefined, 'ms', 'en')).toBeUndefined();
  });

  it('parses durations into milliseconds', () => {
    expect(parseDuration('1s', 'ms', 'en')).toBe(1000);
    expect(parseDuration('1h', 'ms', 'en')).toBe(3600000);
    expect(parseDuration('500ms', 'ms', 'en')).toBe(500);
  });

  it('honours the output format unit', () => {
    expect(parseDuration('1s', 's', 'en')).toBe(1);
    expect(parseDuration('3600s', 'h', 'en')).toBe(1);
  });

  it('normalises en-* locales', () => {
    expect(parseDuration('2s', 'ms', 'en-US')).toBe(2000);
  });
});
