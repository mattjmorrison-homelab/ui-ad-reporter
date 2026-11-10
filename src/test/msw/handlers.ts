import { graphql, HttpResponse } from 'msw';
import { DEFAULT_GRAPHQL_ENDPOINT } from '../../apolloClient';

const api = graphql.link(DEFAULT_GRAPHQL_ENDPOINT);

export const DEFAULT_REPORT = {
  id: '1',
  timestamp: '2026-01-15T18:30:00Z',
  clientIp: '192.168.68.42',
  resolved: false,
};

export const DEFAULT_UNRESOLVED_REPORTS = [
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
];

// Default happy-path handlers. Individual tests override these with
// `server.use(...)` to exercise loading/error paths.
export const handlers = [
  api.mutation('ReportAd', () => HttpResponse.json({ data: { reportAd: DEFAULT_REPORT } })),
  api.query('UnresolvedReports', () =>
    HttpResponse.json({ data: { unresolvedReports: DEFAULT_UNRESOLVED_REPORTS } }),
  ),
];

export { api };
