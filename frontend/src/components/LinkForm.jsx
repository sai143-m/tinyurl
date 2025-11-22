import { useState } from 'react';
import '../styles/LinkForm.css';

export default function LinkForm({ apiBase, onLinkCreated }) {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${apiBase}/api/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_url: url,
          custom_code: customCode || undefined,
        }),
      });

      if (response.status === 409) {
        setError('This custom code is already taken');
        return;
      }

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || 'Failed to create link');
        return;
      }

      const newLink = await response.json();
      setSuccess('Link created successfully!');
      onLinkCreated(newLink);
      setUrl('');
      setCustomCode('');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="link-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">Enter URL to Shorten</label>
          <input
            id="url"
            type="url"
            placeholder="https://example.com/very/long/url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="customCode">Custom Code (Optional)</label>
          <input
            id="customCode"
            type="text"
            placeholder="e.g., mycode"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
            disabled={loading}
            maxLength="8"
          />
          <small>6-8 alphanumeric characters</small>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Creating...' : 'Shorten URL'}
        </button>
      </form>
    </div>
  );
}