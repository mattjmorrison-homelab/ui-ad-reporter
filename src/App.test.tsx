import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApolloProvider } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { apolloClient } from './apolloClient';

function renderApp() {
  return render(
    <ApolloProvider client={apolloClient}>
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    </ApolloProvider>,
  );
}

describe('App', () => {
  it('shows the report button on the default route', () => {
    renderApp();
    expect(screen.getByRole('button', { name: /i just saw an ad/i })).toBeInTheDocument();
  });

  it('navigates to the unresolved-reports list via the nav bar', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('link', { name: /unresolved/i }));

    expect(await screen.findByRole('heading', { name: /unresolved reports/i })).toBeInTheDocument();
  });

  describe('reload button', () => {
    let unregister: ReturnType<typeof vi.fn>;
    let getRegistrations: ReturnType<typeof vi.fn>;
    let cachesDelete: ReturnType<typeof vi.fn>;
    let cachesKeys: ReturnType<typeof vi.fn>;
    let reload: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      unregister = vi.fn().mockResolvedValue(true);
      getRegistrations = vi.fn().mockResolvedValue([{ unregister }]);
      cachesKeys = vi.fn().mockResolvedValue(['cache-a']);
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

    it('unregisters service workers, clears caches, and reloads when clicked', async () => {
      const user = userEvent.setup();
      renderApp();

      await user.click(screen.getByRole('button', { name: /reload app/i }));

      expect(getRegistrations).toHaveBeenCalledTimes(1);
      await vi.waitFor(() => expect(unregister).toHaveBeenCalledTimes(1));
      expect(cachesKeys).toHaveBeenCalledTimes(1);
      await vi.waitFor(() => expect(cachesDelete).toHaveBeenCalledWith('cache-a'));
      await vi.waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
    });
  });
});
