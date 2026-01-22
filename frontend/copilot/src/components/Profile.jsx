import { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ReactChart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const BACKEND_URL = 'http://localhost:5000';
const KEYWORDS = ['due date', 'deadline', 'last date'];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    Promise.all([
      axios.get(`${BACKEND_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${BACKEND_URL}/gmail/emails`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([userRes, emailRes]) => {
        setUser(userRes.data);
        setEmails(Array.isArray(emailRes.data.emails) ? emailRes.data.emails : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Failed to load user</p>;

  const actionRequired = emails.filter(email =>
    KEYWORDS.some(keyword =>
      `${email.subject} ${email.snippet}`.toLowerCase().includes(keyword)
    )
  ).length;

  const normalEmails = emails.length - actionRequired;

  const data = {
    labels: ['Action Required', 'Normal Emails'],
    datasets: [
      {
        data: [actionRequired, normalEmails],
        backgroundColor: ['#ff6384', '#36a2eb'],
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <button
        onClick={handleLogout}
        style={{
          float: 'right',
          backgroundColor: '#ff4d4d',
          color: 'white',
          border: 'none',
          padding: '8px 14px',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>

      <h1>Profile</h1>

      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>

      <hr />

      <h2>Email Insights</h2>

      {emails.length === 0 ? (
        <p>No emails found</p>
      ) : (
        <div style={{ width: '300px' }}>
          <ReactChart type="pie" data={data} />
        </div>
      )}
    </div>
  );
};

export default Profile;
