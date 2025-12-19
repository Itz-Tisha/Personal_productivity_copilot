import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, '/home');
    }

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      axios.get('http://localhost:5000/user/me', {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then(res => setUser(res.data));
    }
  }, []);

  return (
    <div>
      <h1>Home</h1>
      {user && (
        <>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </>
      )}
    </div>
  );
};

export default Home;
