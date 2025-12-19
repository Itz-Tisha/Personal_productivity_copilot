import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get('token');

    if (tokenFromURL) {
      localStorage.setItem('token', tokenFromURL);
      window.history.replaceState({}, document.title, '/home');
    }

    const token = tokenFromURL || localStorage.getItem('token');
    if (!token) return;

    axios
      .get('http://localhost:5000/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data));

    axios
      .get('http://localhost:5000/gmail/today', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setEmails(res.data.emails || []));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Home</h1>

      {user && (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </>
      )}

      <hr />

      <h2>Today's Emails</h2>
      {emails.length ? (
        <ul>
          {emails.map((e, i) => (
            <li key={i}>
              <p><b>From:</b> {e.from}</p>
              <p><b>Subject:</b> {e.subject}</p>
              <p>{e.snippet}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No emails today</p>
      )}
    </div>
  );
};

export default Home;
