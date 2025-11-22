import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/StatsPage.css';

export default function StatsPage({ apiBase }) {
  const { code } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLinkStats();
  }, [code]);

  const fetchLinkStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBase}/api/links/${code}`);
      if (!response.ok) throw new Error('Link not found');
      const data = await response.json();
      setLink(data);
      setError('');
    } catch (err) {
      setError('Link not found or has been deleted');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert('Copied to clipboard!');
};


  if (loading) return <div className="loading">Loading...</div>;
  if (error) {
    return (
      <div className="error-page">
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>

        <div className="stats-card">
          <h2>Link Statistics</h2>

          <div className="stat-item">
            <label>Short Code:</label>
            <div className="stat-value">{code}</div>
          </div>

          <div className="stat-item">
            <label>Original URL:</label>
            <div className="stat-value"><a href={link.original_url} target="_blank" rel="noopener noreferrer">{link.original_url}</a></div>
          </div>

          <div className="stat-item">
            <label>Total Clicks:</label>
            <div className="stat-value large">{link.clicks}</div>
          </div>

          <div className="stat-item">
            <label>Created:</label>
            <div className="stat-value">{new Date(link.created_at).toLocaleString()}</div>
          </div>

          {link.last_clicked && (
            <div className="stat-item">
              <label>Last Clicked:</label>
              <div className="stat-value">{new Date(link.last_clicked).toLocaleString()}</div>
            </div>
          )}

          <div className="stat-actions">
            <button onClick={() => copyToClipboard(`${apiBase}/${code}`)} className="btn-primary">Copy Short Link</button>
            <button onClick={() => window.open(`${apiBase}/${code}`, '_blank')} className="btn-secondary">Visit Link</button>
          </div>
        </div>
      </div>
    </div>
  );
}