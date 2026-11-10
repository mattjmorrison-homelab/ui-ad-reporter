import { describe, expect, it } from 'vitest';
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
});
