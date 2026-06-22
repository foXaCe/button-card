import { describe, it, expect } from 'vitest';
import '../src/button-card';

// The custom element registers itself on import. Each test creates a fresh
// instance; we never connect it to the DOM, so setConfig only validates and
// normalises the config (no rendering, no hass required).
const makeCard = (): any => document.createElement('button-card');

describe('button-card setConfig', () => {
  it('throws on a falsy config', () => {
    const card = makeCard();
    expect(() => card.setConfig(undefined)).toThrow();
    expect(() => card.setConfig(null)).toThrow();
  });

  it('applies sensible defaults for a minimal config', () => {
    const card = makeCard();
    card.setConfig({ entity: 'light.living_room' });
    const cfg = card._config;
    expect(cfg.type).toBe('custom:button-card');
    expect(cfg.color_type).toBe('icon');
    expect(cfg.show_name).toBe(true);
    expect(cfg.show_icon).toBe(true);
    expect(cfg.card_size).toBe(3);
    expect(cfg.lock.enabled).toBe(false);
  });

  it('lets the user config override defaults', () => {
    const card = makeCard();
    card.setConfig({ entity: 'light.x', color_type: 'card', show_name: false, card_size: 5 });
    expect(card._config.color_type).toBe('card');
    expect(card._config.show_name).toBe(false);
    expect(card._config.card_size).toBe(5);
  });

  it('accepts a config without entity (blank / label card)', () => {
    const card = makeCard();
    expect(() => card.setConfig({ color_type: 'blank-card' })).not.toThrow();
  });
});

describe('button-card sizing API', () => {
  it('getCardSize returns card_size (default 3)', () => {
    const card = makeCard();
    card.setConfig({ entity: 'light.x' });
    expect(card.getCardSize()).toBe(3);
    card.setConfig({ entity: 'light.x', card_size: 7 });
    expect(card.getCardSize()).toBe(7);
  });

  it('getGridOptions is undefined unless section_mode (content-driven height by default)', () => {
    const card = makeCard();
    card.setConfig({ entity: 'light.x' });
    expect(card.getGridOptions()).toBeUndefined();
  });

  it('getGridOptions returns a tile default in section_mode, columns being a multiple of 3', () => {
    const card = makeCard();
    card.setConfig({ entity: 'light.x', section_mode: true });
    const opts = card.getGridOptions();
    expect(opts).toBeDefined();
    expect(opts.columns % 3).toBe(0);
    expect(typeof opts.rows).toBe('number');
    expect(opts.min_rows).toBeGreaterThanOrEqual(1);
  });
});
