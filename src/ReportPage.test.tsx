import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApolloProvider } from '@apollo/client';
import { delay, HttpResponse } from 'msw';
import ReportPage from './ReportPage';
import { apolloClient } from './apolloClient';
import { server } from './test/msw/server';
import { api, DEFAULT_REPORT } from './test/msw/handlers';

function renderPage() {
  return render(
    <ApolloProvider client={apolloClient}>
      <ReportPage />
    </ApolloProvider>,
  );
}

describe('ReportPage', () => {
  it('fires the reportAd mutation and shows a confirmation on tap', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /i just saw an ad/i }));

    const confirmation = await screen.findByRole('status');
    expect(confirmation).toHaveTextContent(/reported/i);
  });

  it('shows a pending/disabled state while the mutation is in flight', async () => {
    server.use(
      api.mutation('ReportAd', async () => {
        await delay(50);
        return HttpResponse.json({ data: { ad: { reportAd: DEFAULT_REPORT } } });
      }),
    );

    const user = userEvent.setup();
    renderPage();

    const button = screen.getByRole('button', { name: /i just saw an ad/i });
    await user.click(button);

    expect(button).toBeDisabled();
    await waitFor(() => expect(button).not.toBeDisabled());
    expect(await screen.findByRole('status')).toHaveTextContent(/reported/i);
  });

  it('shows a visible error when the mutation fails', async () => {
    server.use(
      api.mutation('ReportAd', () =>
        HttpResponse.json({ errors: [{ message: 'backend unreachable' }] }),
      ),
    );

    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /i just saw an ad/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/backend unreachable/i);
  });

  it('shows a visible error when the mutation does not confirm the report', async () => {
    server.use(
      api.mutation('ReportAd', () => HttpResponse.json({ data: { ad: { reportAd: null } } })),
    );

    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /i just saw an ad/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/not confirmed/i);
  });

  it('clears a prior error on the next successful report', async () => {
    server.use(
      api.mutation('ReportAd', () =>
        HttpResponse.json({ errors: [{ message: 'backend unreachable' }] }),
      ),
    );

    const user = userEvent.setup();
    renderPage();

    const button = screen.getByRole('button', { name: /i just saw an ad/i });
    await user.click(button);
    await screen.findByRole('alert');

    server.use(
      api.mutation('ReportAd', () =>
        HttpResponse.json({ data: { ad: { reportAd: DEFAULT_REPORT } } }),
      ),
    );
    await user.click(button);

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
    expect(await screen.findByRole('status')).toHaveTextContent(/reported/i);
  });
});
