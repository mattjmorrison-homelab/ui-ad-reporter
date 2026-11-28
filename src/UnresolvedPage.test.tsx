import { describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApolloProvider } from '@apollo/client';
import { HttpResponse } from 'msw';
import UnresolvedPage from './UnresolvedPage';
import { apolloClient } from './apolloClient';
import { server } from './test/msw/server';
import { api, DEFAULT_UNRESOLVED_REPORTS } from './test/msw/handlers';

function renderPage() {
  return render(
    <ApolloProvider client={apolloClient}>
      <UnresolvedPage />
    </ApolloProvider>,
  );
}

describe('UnresolvedPage', () => {
  it('renders rows newest-first with timestamp converted to America/Chicago and client IP', async () => {
    renderPage();

    const list = await screen.findByRole('list', { name: /unresolved reports/i });
    const rows = within(list).getAllByRole('listitem');

    expect(rows).toHaveLength(2);
    // DEFAULT_UNRESOLVED_REPORTS[1] (18:30Z) is newer than [0] (14:00Z) -> first.
    expect(within(rows[0]).getByText('192.168.68.42')).toBeInTheDocument();
    expect(within(rows[0]).getByText(/12:30 PM/)).toBeInTheDocument();
    expect(within(rows[1]).getByText('192.168.68.10')).toBeInTheDocument();
  });

  it('shows an empty state when there are no unresolved reports', async () => {
    server.use(
      api.query('UnresolvedReports', () => HttpResponse.json({ data: { ad: { unresolved: [] } } })),
    );

    renderPage();

    expect(await screen.findByText(/no unresolved reports/i)).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: /unresolved reports/i })).not.toBeInTheDocument();
  });

  it('shows a visible error when the query fails, with a working retry', async () => {
    server.use(
      api.query('UnresolvedReports', () =>
        HttpResponse.json({ errors: [{ message: 'backend unreachable' }] }),
      ),
    );

    const user = userEvent.setup();
    renderPage();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/couldn't load reports/i);
    expect(alert).toHaveTextContent(/backend unreachable/i);

    server.use(
      api.query('UnresolvedReports', () =>
        HttpResponse.json({ data: { ad: { unresolved: DEFAULT_UNRESOLVED_REPORTS } } }),
      ),
    );
    await user.click(screen.getByRole('button', { name: /retry/i }));

    await waitFor(() =>
      expect(screen.getByRole('list', { name: /unresolved reports/i })).toBeInTheDocument(),
    );
  });
});
