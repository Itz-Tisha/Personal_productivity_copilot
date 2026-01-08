import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [emails, setEmails] = useState([]);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      window.history.replaceState({}, document.title, '/home');
    }

    fetchEmails(); // default: today's emails
  }, []);

  const fetchEmails = async (selectedDate = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login again');
        window.location.href = '/';
        return;
      }

      const res = await axios.get('http://localhost:5000/gmail/emails', {
        headers: { Authorization: `Bearer ${token}` },
        params: selectedDate ? { date: selectedDate } : {},
      });

      setEmails(res.data.emails || []);
    } catch (err) {
      console.error('Email fetch error', err);
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/';
      }
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

      setEmails(res.data.emails || []);
    } catch (err) {
      console.error('Summarize error', err);
      alert('Failed to summarize emails.');
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

      setEmails(res.data.emails || []);
    } catch (err) {
      console.error('Categorize error', err);
      alert('Failed to categorize emails.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Inbox</h2>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <div style={{ marginTop: '10px' }}>
        <button onClick={() => fetchEmails()}>Today’s Emails</button>
        <button
          onClick={() => fetchEmails(date)}
          disabled={!date}
          style={{ marginLeft: '10px' }}
        >
          Fetch by Date
        </button>

        {/* Two separate AI buttons */}
        <button
          onClick={handleSummarize}
          disabled={!emails.length || aiLoading}
          style={{ marginLeft: '10px' }}
        >
          {aiLoading ? 'Processing...' : 'Summarize All'}
        </button>

        <button
          onClick={handleCategorize}
          disabled={!emails.length || aiLoading}
          style={{ marginLeft: '10px' }}
        >
          {aiLoading ? 'Processing...' : 'Categorize All'}
        </button>
      </div>

      {loading && <p>Loading emails...</p>}

      <ul style={{ marginTop: '20px' }}>
        {emails.map((email) => (
          <li key={email.id} style={{ marginBottom: '20px' }}>
            <strong>{email.subject}</strong>
            <br />
            <small>{email.from}</small>
            <p>{email.snippet}</p>
            {email.summary && (
              <div style={{ marginTop: '5px', color: 'green' }}>
                <strong>Summary:</strong> {email.summary}
              </div>
            )}
            {email.category && (
              <div style={{ marginTop: '5px', color: 'blue' }}>
                <strong>Category:</strong> {email.category}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
