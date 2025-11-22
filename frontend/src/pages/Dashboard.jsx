import { useState, useEffect } from 'react';
import LinkForm from '../components/LinkForm';
import LinksList from '../components/LinksList';
import '../styles/Dashboard.css';

export default function Dashboard({ apiBase }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // FIXED: Fetch on mount AND when apiBase changes
  useEffect(() => {
    if (apiBase) {
      fetchLinks();
    }
  }, [apiBase]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log(`🔄 Fetching from: ${apiBase}/api/links`);
      const response = await fetch(`${apiBase}/api/links`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Loaded ${data.length} links`);
      
      setLinks(data);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError('Failed to load links. Click retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkCreated = (newLink) => {
    setLinks([newLink, ...links]);
  };

  const handleLinkDeleted = (code) => {
    setLinks(links.filter(link => link.short_code !== code));
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>TinyLink</h1>
          <p>Shorten your URLs and track click statistics</p>
        </div>

        <LinkForm apiBase={apiBase} onLinkCreated={handleLinkCreated} />

        {error && (
          <div className="error-message">
            {error}
            <button 
              onClick={fetchLinks} 
              style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}
            >
              🔄 Retry
            </button>
          </div>
        )}

        <LinksList 
          links={links} 
          loading={loading}
          apiBase={apiBase}
          onLinkDeleted={handleLinkDeleted}
        />
      </div>
    </div>
  );
}
