import { expect, test, type Page, type Route } from '@playwright/test';

const GRAPHQL_URL = 'https://graphql.morrisons.site/';

// Set to "false" for the post-deploy smoke run against the real, live app --
// see the `@smoke` test below, the only one safe to run unmocked (it never
// fires the reportAd mutation, so it can't create a real report row).
const MOCKS_ENABLED = process.env.E2E_MOCK_API !== 'false';

async function mockGraphql(
  page: Page,
  handlers: Record<
    string,
    (route: Route, body: { variables?: Record<string, unknown> }) => Promise<void> | void
  >,
) {
  await page.route(GRAPHQL_URL, async (route) => {
    const body = route.request().postDataJSON() as {
      operationName?: string;
      variables?: Record<string, unknown>;
    };
    const handler = body.operationName ? handlers[body.operationName] : undefined;
    if (!handler) {
      await route.fulfill({
        status: 400,
        json: { errors: [{ message: `no handler for ${body.operationName}` }] },
      });
      return;
    }
    await handler(route, body);
  });
}

test('reports an ad on tap, showing a confirmation', async ({ page }) => {
  await mockGraphql(page, {
    ReportAd: async (route) => {
      await route.fulfill({
        json: {
          data: {
            reportAd: {
              id: '1',
              timestamp: '2026-01-15T18:30:00Z',
              clientIp: '192.168.68.42',
              resolved: false,
            },
          },
        },
      });
    },
  });

  await page.goto('/');
  await page.getByRole('button', { name: /i just saw an ad/i }).click();

  await expect(page.getByRole('status')).toContainText(/reported/i);
});

test('shows a visible error when the report fails', async ({ page }) => {
  await mockGraphql(page, {
    ReportAd: async (route) => {
      await route.fulfill({ json: { errors: [{ message: 'backend unreachable' }] } });
    },
  });

  await page.goto('/');
  await page.getByRole('button', { name: /i just saw an ad/i }).click();

  await expect(page.getByRole('alert')).toContainText(/backend unreachable/i);
});

test('lists unresolved reports newest first, with timestamp and client IP', async ({ page }) => {
  await mockGraphql(page, {
    UnresolvedReports: async (route) => {
      await route.fulfill({
        json: {
          data: {
            unresolvedReports: [
              {
                id: '1',
                timestamp: '2026-01-15T14:00:00Z',
                clientIp: '192.168.68.10',
                resolved: false,
                resolutionNote: null,
              },
              {
                id: '2',
                timestamp: '2026-01-15T18:30:00Z',
                clientIp: '192.168.68.42',
                resolved: false,
                resolutionNote: null,
              },
            ],
          },
        },
      });
    },
  });

  await page.goto('/unresolved');

  const list = page.getByRole('list', { name: /unresolved reports/i });
  const rows = list.getByRole('listitem');
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0)).toContainText('192.168.68.42');
  await expect(rows.nth(1)).toContainText('192.168.68.10');
});

test('shows an empty state when there are no unresolved reports', async ({ page }) => {
  await mockGraphql(page, {
    UnresolvedReports: async (route) => {
      await route.fulfill({ json: { data: { unresolvedReports: [] } } });
    },
  });

  await page.goto('/unresolved');

  await expect(page.getByText(/no unresolved reports/i)).toBeVisible();
});

// The only test in this file that's safe to run against the real, live app:
// it never taps the report button, so it can never create a real report row
// against production. Run with E2E_MOCK_API=false to skip mocking and hit
// the real backend.
test('loads both views without error', { tag: '@smoke' }, async ({ page }) => {
  if (MOCKS_ENABLED) {
    await mockGraphql(page, {
      UnresolvedReports: async (route) => {
        await route.fulfill({ json: { data: { unresolvedReports: [] } } });
      },
    });
  }

  await page.goto('/');
  await expect(page.getByRole('button', { name: /i just saw an ad/i })).toBeVisible();

  await page.getByRole('link', { name: /unresolved/i }).click();
  await expect(page.getByRole('heading', { name: /unresolved reports/i })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
});
