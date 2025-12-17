import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   // Get JWT token from URL query params after Google login
  //   const params = new URLSearchParams(window.location.search);
  //   const t = params.get('token');
  //   if (t) {
  //     setToken(t);

  //     // Fetch user info from backend protected route
  //     axios
  //       .get('http://localhost:5000/user/me', {
  //         headers: { Authorization: `Bearer ${t}` },
  //       })
  //       .then((res) => setUser(res.data))
  //       .catch((err) => console.log(err));
  //   }
  // }, []);

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const t = params.get('token');
  if (t) {
    setToken(t);

    axios.get('http://localhost:5000/user/me', {
      headers: { Authorization: `Bearer ${t}` },
    })
    .then(res => setUser(res.data))
    .catch(err => console.log(err));

    // Remove token from URL for clean display
    window.history.replaceState({}, document.title, "/login");
  }
}, []);


  return (
    <div>
      {!token && (
        <a
          href="http://localhost:5000/auth/login"
          style={{
            padding: '10px 20px',
            background: 'blue',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
          }}
        >
          Login with Google
        </a>
      )}
      {user && (
        <div style={{ marginTop: '20px' }}>
          <h2>Welcome, {user.name}!</h2>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
