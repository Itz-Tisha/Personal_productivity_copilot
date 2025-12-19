const Login = () => {
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Welcome</h2>

      {error === 'NO_ACCOUNT' && <p>No account found. Please Sign up.</p>}
      {error === 'ALREADY_EXISTS' && <p>Account exists. Please Login.</p>}

      <a href="http://localhost:5000/auth/login?mode=login">
        <button>Login with Google</button>
      </a>

      <br /><br />

      <a href="http://localhost:5000/auth/login?mode=signup">
        <button>Sign up with Google</button>
      </a>
    </div>
  );
};

export default Login;