import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    // 1️⃣ Get token from URL query (after Google login)
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get('token');

    if (tokenFromURL) {
      localStorage.setItem('token', tokenFromURL);
      // Remove token from URL
      window.history.replaceState({}, document.title, '/home');
    }

    const token = tokenFromURL || localStorage.getItem('token');
    if (!token) return;

    // 2️⃣ Fetch user info
    axios
      .get('http://localhost:5000/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUser(res.data))
      .catch(err => console.error('User fetch error:', err));

    // 3️⃣ Fetch today’s emails
    axios
      .get('http://localhost:5000/gmail/today', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setEmails(res.data.emails || []))
      .catch(err => console.error('Gmail fetch error:', err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Home</h1>

      {user ? (
        <div>
          <h2>User Info</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}

      <hr />

      <div>
        <h2>Today's Emails</h2>
        {emails.length > 0 ? (
          <ul>
            {emails.map((email, idx) => (
              <li key={idx} style={{ marginBottom: '10px' }}>
                <p><strong>From:</strong> {email.from}</p>
                <p><strong>Subject:</strong> {email.subject}</p>
                <p><strong>Snippet:</strong> {email.snippet}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No emails found for today.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
