import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { reloadApp } from './reloadApp';

describe('reloadApp', () => {
  let unregister: ReturnType<typeof vi.fn>;
  let getRegistrations: ReturnType<typeof vi.fn>;
  let cachesDelete: ReturnType<typeof vi.fn>;
  let cachesKeys: ReturnType<typeof vi.fn>;
  let reload: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    unregister = vi.fn().mockResolvedValue(true);
    getRegistrations = vi.fn().mockResolvedValue([{ unregister }, { unregister }]);
    cachesKeys = vi.fn().mockResolvedValue(['cache-a', 'cache-b']);
    cachesDelete = vi.fn().mockResolvedValue(true);
    reload = vi.fn();

    vi.stubGlobal('navigator', {
      ...navigator,
      serviceWorker: { getRegistrations },
    });
    vi.stubGlobal('caches', { keys: cachesKeys, delete: cachesDelete });
    vi.stubGlobal('location', { ...window.location, reload });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('unregisters every service worker registration, clears every cache, and reloads', async () => {
    await reloadApp();

    expect(getRegistrations).toHaveBeenCalledTimes(1);
    expect(unregister).toHaveBeenCalledTimes(2);
    expect(cachesKeys).toHaveBeenCalledTimes(1);
    expect(cachesDelete).toHaveBeenCalledWith('cache-a');
    expect(cachesDelete).toHaveBeenCalledWith('cache-b');
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
