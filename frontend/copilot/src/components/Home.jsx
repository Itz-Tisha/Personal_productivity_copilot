import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [emails, setEmails] = useState([]);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      window.history.replaceState({}, document.title, '/home');
    }

    fetchEmails();
  }, []);

  const fetchEmails = async (selectedDate = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const res = await axios.get('http://localhost:5000/gmail/emails', {
        headers: { Authorization: `Bearer ${token}` },
        params: selectedDate ? { date: selectedDate } : {}
      });

      setEmails(res.data.emails || []);
      setExpanded({});
    } catch {
      alert('Session expired. Login again.');
      localStorage.removeItem('token');
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    try {
      setAiLoading(true);
      const token = localStorage.getItem('token');

      const res = await axios.post(
        'http://localhost:5000/gmail/emails/summarize',
        { emails },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmails(res.data.emails);
    } catch {
      alert('Summarization failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCategorize = async () => {
    try {
      setAiLoading(true);
      const token = localStorage.getItem('token');

      const res = await axios.post(
        'http://localhost:5000/gmail/emails/categorize',
        { emails },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmails(res.data.emails);
    } catch {
      alert('Categorization failed');
    } finally {
      setAiLoading(false);
    }
  };

  // ✅ PER EMAIL SUMMARIZE (NEW)
  const handleSingleSummarize = async (email) => {
    try {
      setAiLoading(true);
      const token = localStorage.getItem('token');

      const res = await axios.post(
        'http://localhost:5000/gmail/emails/summarize-one',
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmails(prev =>
        prev.map(e =>
          e.id === email.id ? { ...e, summary: res.data.summary } : e
        )
      );
    } catch {
      alert('Single email summarization failed');
    } finally {
      setAiLoading(false);
    }
  };

  const toggleRead = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const PREVIEW_LENGTH = 300;

  return (
    <div style={{ padding: 20 }}>
      <h2>Inbox</h2>

      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <div style={{ marginTop: 10 }}>
        <button onClick={() => fetchEmails()}>Today’s Emails</button>
        <button onClick={() => fetchEmails(date)} disabled={!date}>Fetch by Date</button>
        <button onClick={handleSummarize} disabled={aiLoading || !emails.length}>Summarize All</button>
        <button onClick={handleCategorize} disabled={aiLoading || !emails.length}>Categorize All</button>
      </div>

      {loading && <p>Loading…</p>}

      <div style={{ marginTop: 20 }}>
        {emails.map(email => {
          const fullText = email.body || '';
          const isLong = fullText.length > PREVIEW_LENGTH;
          const showFull = expanded[email.id];

          const displayText = showFull
            ? fullText
            : fullText.slice(0, PREVIEW_LENGTH) + (isLong ? '...' : '');

          return (
            <div key={email.id} style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 15,
              marginBottom: 15,
              background: '#fff',
              whiteSpace: 'pre-wrap'
            }}>
              <h3>{email.subject}</h3>
              <p><b>From:</b> {email.from}</p>

              <div style={{ background: '#f4f4f4', padding: 10 }}>
                {displayText || 'No content'}
              </div>

              {isLong && (
                <p
                  onClick={() => toggleRead(email.id)}
                  style={{ color: 'blue', cursor: 'pointer' }}
                >
                  {showFull ? 'Read Less' : 'Read More'}
                </p>
              )}

              {/* ✅ PER MAIL SUMMARIZE BUTTON */}
              <button
                onClick={() => handleSingleSummarize(email)}
                disabled={aiLoading}
              >
                🧠 Summarize This Email
              </button>

              {email.summary && (
                <p style={{ color: 'green' }}>
                  <b>Summary:</b> {email.summary}
                </p>
              )}

              {email.category && (
                <p style={{ color: 'blue' }}>
                  <b>Category:</b> {email.category}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
