import { describe, it, expect } from 'vitest';
import millisecondsToDuration, { formatDuration } from '../src/common/duration';

describe('formatDuration', () => {
  it('formats seconds into m:ss', () => {
    expect(formatDuration('90', 's')).toBe('1:30');
  });

  it('formats hours into h:mm:ss', () => {
    expect(formatDuration('1', 'h')).toBe('1:00:00');
  });

  it('returns "0" for a zero duration', () => {
    expect(formatDuration('0', 's')).toBe('0');
  });

  it('formats sub-second milliseconds', () => {
    expect(formatDuration('500', 'ms')).toBe('0.500');
  });
});

describe('millisecondsToDuration', () => {
  it('returns null for 0', () => {
    expect(millisecondsToDuration(0)).toBeNull();
  });

  it('formats one hour', () => {
    expect(millisecondsToDuration(3600000)).toBe('1:00:00');
  });
});
