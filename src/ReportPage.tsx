import { useState } from 'react';
import { AlertTriangle, Check, Loader2, Megaphone } from 'lucide-react';
import { useReportAdMutation } from './graphql/generated';
import { errorMessage } from './errorMessage';

function ReportPage() {
  const [reportAd, { loading }] = useReportAdMutation();
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReport = async () => {
    setError(null);
    setConfirmation(null);

    try {
      const result = await reportAd();
      // The mutation's return value is the source of truth that the report
      // actually landed, not an assumption that the request we sent "worked".
      if (result.data?.reportAd) {
        setConfirmation('Reported. Thanks, we’ll look into it.');
      } else {
        setError('The report was not confirmed. Please try again.');
      }
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="page">
      <header className="app-header">
        <h1>Ad Reporter</h1>
      </header>

      <div className="page-body page-body--center">
        <button type="button" className="report-button" onClick={handleReport} disabled={loading}>
          {loading ? (
            <Loader2 className="spin" size={28} aria-hidden="true" />
          ) : (
            <Megaphone size={28} aria-hidden="true" />
          )}
          I just saw an ad
        </button>

        {confirmation && (
          <div className="status-panel status-panel--success status-panel--inline" role="status">
            <Check size={20} aria-hidden="true" />
            <p>{confirmation}</p>
          </div>
        )}

        {error && (
          <div className="status-panel status-panel--error status-panel--inline" role="alert">
            <AlertTriangle size={20} aria-hidden="true" />
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportPage;
