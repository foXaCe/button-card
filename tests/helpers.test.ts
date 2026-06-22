import { describe, it, expect } from 'vitest';
import type { HassEntity } from 'home-assistant-js-websocket';
import {
  computeDomain,
  computeEntity,
  atLeastVersion,
  buildNameStateConcat,
  slugify,
  durationToSeconds,
  secondsToDuration,
  isNumericFromAttributes,
  stateActive,
  isButtonCardTemplate,
  mergeDeep,
  isMediaSourceContentId,
  computeStateDomain,
  batteryStateColorProperty,
  computeCssVariable,
} from '../src/helpers';

const entity = (entity_id: string, state: string, attributes: Record<string, unknown> = {}): HassEntity =>
  ({
    entity_id,
    state,
    attributes,
    last_changed: '',
    last_updated: '',
    context: { id: '', user_id: null, parent_id: null },
  }) as unknown as HassEntity;

describe('computeDomain / computeEntity', () => {
  it('splits an entity id', () => {
    expect(computeDomain('light.living_room')).toBe('light');
    expect(computeEntity('light.living_room')).toBe('living_room');
  });
});

describe('atLeastVersion', () => {
  it('compares major then minor', () => {
    expect(atLeastVersion('2026.5.4', 2026, 5)).toBe(true);
    expect(atLeastVersion('2026.4.0', 2026, 5)).toBe(false);
    expect(atLeastVersion('2027.1.0', 2026, 5)).toBe(true);
    expect(atLeastVersion('2025.12.0', 2026, 1)).toBe(false);
  });
});

describe('buildNameStateConcat', () => {
  it('joins name and state', () => {
    expect(buildNameStateConcat('Lamp', 'on')).toBe('Lamp: on');
    expect(buildNameStateConcat(undefined, 'on')).toBe('on');
    expect(buildNameStateConcat('Lamp', undefined)).toBe('Lamp');
    expect(buildNameStateConcat(undefined, undefined)).toBeUndefined();
  });
});

describe('slugify', () => {
  it('slugifies with the default delimiter', () => {
    expect(slugify('Hello World')).toBe('hello_world');
    expect(slugify('Été À côté')).toBe('ete_a_cote');
    expect(slugify('a & b')).toBe('a_and_b');
  });

  it('supports a custom delimiter', () => {
    expect(slugify('Hello World', '-')).toBe('hello-world');
  });
});

describe('durationToSeconds / secondsToDuration', () => {
  it('parses hh:mm:ss into seconds', () => {
    expect(durationToSeconds('1:02:03')).toBe(3723);
    expect(durationToSeconds('0:00:30')).toBe(30);
  });

  it('formats seconds back into a duration string', () => {
    expect(secondsToDuration(3723)).toBe('1:02:03');
    expect(secondsToDuration(90)).toBe('1:30');
    expect(secondsToDuration(30)).toBe('30');
    expect(secondsToDuration(0)).toBeNull();
  });
});

describe('isNumericFromAttributes', () => {
  it('detects numeric entities', () => {
    expect(isNumericFromAttributes({ unit_of_measurement: '°C' } as never)).toBe(true);
    expect(isNumericFromAttributes({ state_class: 'measurement' } as never)).toBe(true);
    expect(isNumericFromAttributes({} as never)).toBe(false);
  });
});

describe('stateActive', () => {
  it('returns false for an undefined state object', () => {
    expect(stateActive(undefined)).toBe(false);
  });

  it('handles generic on/off domains', () => {
    expect(stateActive(entity('switch.x', 'on'))).toBe(true);
    expect(stateActive(entity('switch.x', 'off'))).toBe(false);
  });

  it('handles domain-specific (in)activity', () => {
    expect(stateActive(entity('cover.x', 'closed'))).toBe(false);
    expect(stateActive(entity('cover.x', 'open'))).toBe(true);
    expect(stateActive(entity('lock.x', 'locked'))).toBe(false);
    expect(stateActive(entity('timer.x', 'active'))).toBe(true);
    expect(stateActive(entity('timer.x', 'idle'))).toBe(false);
  });
});

describe('isButtonCardTemplate', () => {
  it('detects [[[ ... ]]] JS templates and rejects the rest', () => {
    expect(isButtonCardTemplate('[[[ return 1 ]]]')).toBe(true);
    expect(isButtonCardTemplate('plain string')).toBe(false);
    expect(isButtonCardTemplate(42)).toBe(false);
    expect(isButtonCardTemplate(undefined)).toBe(false);
  });
});

describe('mergeDeep', () => {
  it('deep-merges nested objects', () => {
    expect(mergeDeep({ a: 1, b: { c: 2 } }, { b: { d: 3 } })).toEqual({ a: 1, b: { c: 2, d: 3 } });
  });

  it('concatenates arrays', () => {
    expect(mergeDeep({ a: [1, 2] }, { a: [3] })).toEqual({ a: [1, 2, 3] });
  });

  it('overwrites primitives', () => {
    expect(mergeDeep({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
  });
});

describe('isMediaSourceContentId', () => {
  it('detects media-source content ids', () => {
    expect(isMediaSourceContentId('media-source://media_source/local/x.mp3')).toBe(true);
    expect(isMediaSourceContentId('http://example.org/x.mp3')).toBe(false);
  });
});

describe('computeStateDomain', () => {
  it('derives the domain from the entity id', () => {
    expect(computeStateDomain(entity('light.kitchen', 'on'))).toBe('light');
  });
});

describe('batteryStateColorProperty', () => {
  it('maps a battery level to a color property', () => {
    expect(batteryStateColorProperty('85')).toBe('--state-sensor-battery-high-color');
    expect(batteryStateColorProperty('50')).toBe('--state-sensor-battery-medium-color');
    expect(batteryStateColorProperty('10')).toBe('--state-sensor-battery-low-color');
    expect(batteryStateColorProperty('unknown')).toBeUndefined();
  });
});

describe('computeCssVariable', () => {
  it('builds a single var()', () => {
    expect(computeCssVariable('--foo')).toBe('var(--foo)');
  });

  it('builds nested var() fallbacks from an array', () => {
    expect(computeCssVariable(['--a', '--b'])).toBe('var(--a, var(--b))');
  });
});

describe('stateActive (additional domains)', () => {
  it('covers domain-specific active rules', () => {
    expect(stateActive(entity('alarm_control_panel.x', 'disarmed'))).toBe(false);
    expect(stateActive(entity('alarm_control_panel.x', 'armed_home'))).toBe(true);
    expect(stateActive(entity('person.x', 'not_home'))).toBe(false);
    expect(stateActive(entity('person.x', 'home'))).toBe(true);
    expect(stateActive(entity('media_player.x', 'standby'))).toBe(false);
    expect(stateActive(entity('media_player.x', 'playing'))).toBe(true);
    expect(stateActive(entity('vacuum.x', 'docked'))).toBe(false);
    expect(stateActive(entity('vacuum.x', 'cleaning'))).toBe(true);
    expect(stateActive(entity('camera.x', 'streaming'))).toBe(true);
    expect(stateActive(entity('camera.x', 'idle'))).toBe(false);
    expect(stateActive(entity('button.x', '2024-01-01T00:00:00'))).toBe(true);
  });
});
