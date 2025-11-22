import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LinksList.css';

export default function LinksList({ links, loading, apiBase, onLinkDeleted }) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState({});

  const handleDelete = async (code) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;

    try {
      setDeleting(prev => ({ ...prev, [code]: true }));
      const response = await fetch(`${apiBase}/api/links/${code}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');
      onLinkDeleted(code);
    } catch (err) {
      alert('Failed to delete link');
    } finally {
      setDeleting(prev => ({ ...prev, [code]: false }));
    }
  };

  const copyToClipboard = (code) => {
  const shortUrl = `${apiBase}/${code}`;
  navigator.clipboard.writeText(shortUrl);
  alert('Copied to clipboard!');
};


  if (loading) return <div className="loading">Loading links...</div>;
  if (links.length === 0) return <div className="empty-state">No shortened links yet. Create one above!</div>;

  return (
    <div className="links-list">
      <h2>Your Shortened Links</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Short Code</th>
              <th>Original URL</th>
              <th>Clicks</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id}>
                <td className="code-cell">{link.short_code}</td>
                <td className="url-cell">
                  <a href={link.original_url} target="_blank" rel="noopener noreferrer">
                    {link.original_url.length > 50 ? link.original_url.substring(0, 50) + '...' : link.original_url}
                  </a>
                </td>
                <td className="clicks-cell">{link.clicks}</td>
                <td className="date-cell">{new Date(link.created_at).toLocaleDateString()}</td>
                <td className="actions-cell">
                  <button className="btn-small btn-copy" onClick={() => copyToClipboard(link.short_code)}>📋</button>
                  <button className="btn-small btn-stats" onClick={() => navigate(`/stats/${link.short_code}`)}>📊</button>
                  <button className="btn-small btn-delete" onClick={() => handleDelete(link.short_code)} disabled={deleting[link.short_code]}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}