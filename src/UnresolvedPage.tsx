import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { useUnresolvedReportsQuery } from './graphql/generated';
import { errorMessage } from './errorMessage';
import { formatAsChicagoTime } from './timezone';

function UnresolvedPage() {
  const { data, loading, error, refetch } = useUnresolvedReportsQuery();

  // Newest first -- display order, not something the query guarantees.
  const reports = [...(data?.ad?.unresolved ?? [])].sort((a, b) =>
    b.timestamp.localeCompare(a.timestamp),
  );

  return (
    <div className="page">
      <header className="app-header">
        <h1>Unresolved Reports</h1>
      </header>

      <div className="page-body">
        {loading && (
          <div className="status-panel" role="status">
            <Loader2 className="spin" size={32} aria-hidden="true" />
            <p>Loading reports…</p>
          </div>
        )}

        {!loading && error && (
          <div className="status-panel status-panel--error" role="alert">
            <AlertTriangle size={32} aria-hidden="true" />
            <p>Couldn&apos;t load reports.</p>
            <p className="status-detail">{errorMessage(error)}</p>
            <button type="button" className="retry-button" onClick={() => refetch()}>
              <RefreshCw size={16} aria-hidden="true" />
              Retry
            </button>
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="status-panel" role="status">
            <p>No unresolved reports.</p>
          </div>
        )}

        {!loading && !error && reports.length > 0 && (
          <ul className="report-list" aria-label="Unresolved reports">
            {reports.map((report) => (
              <li key={report.id} className="report-list__item">
                <span className="report-list__timestamp">
                  {formatAsChicagoTime(report.timestamp)}
                </span>
                <span className="report-list__ip">{report.clientIp}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UnresolvedPage;
