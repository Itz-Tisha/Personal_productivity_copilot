// const Login = () => {
//   const params = new URLSearchParams(window.location.search);
//   const error = params.get('error');


//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       window.location.href = '/home';
//     }
//   }, []);

//   return (
//     <div style={{ textAlign: 'center', marginTop: '100px' }}>
//       <h2>Welcome</h2>

//       {error === 'NO_ACCOUNT' && <p>No account found. Please Sign up.</p>}
//       {error === 'ALREADY_EXISTS' && <p>Account exists. Please Login.</p>}

//       <a href="http://localhost:5000/auth/login?mode=login">
//         <button>Login with Google</button>
//       </a>

//       <br /><br />

//       <a href="http://localhost:5000/auth/login?mode=signup">
//         <button>Sign up with Google</button>
//       </a>
//     </div>
//   );
// };

// export default Login;


import { useEffect } from 'react';

const Login = () => {
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/home';
    }
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: 'radial-gradient(circle at top, #1d4ed8, #020617 55%)',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'rgba(15,23,42,0.96)',
          borderRadius: '24px',
          padding: '26px 24px 24px',
          border: '1px solid rgba(148,163,184,0.45)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
          color: '#e5e7eb',
        }}
      >
        <div style={{ marginBottom: '18px' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '999px',
              background:
                'radial-gradient(circle at 0 0, #22c55e, transparent 55%), radial-gradient(circle at 100% 100%, #0ea5e9, transparent 55%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px',
              boxShadow: '0 10px 25px rgba(22,163,74,0.6)',
            }}
          >
            <span
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#020617',
              }}
            >
              PC
            </span>
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              color: '#f9fafb',
            }}
          >
            Personal Productivity Copilot
          </h2>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: '13px',
              color: '#9ca3af',
            }}
          >
            Connect with Google to let your copilot summarize emails, generate smart replies,
            and create calendar events automatically.
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: '14px',
              padding: '8px 10px',
              borderRadius: '10px',
              backgroundColor: 'rgba(127,29,29,0.18)',
              border: '1px solid rgba(248,113,113,0.6)',
              color: '#fecaca',
              fontSize: '12px',
            }}
          >
            {error === 'NO_ACCOUNT' && 'No account found for this Google user. Please sign up.'}
            {error === 'ALREADY_EXISTS' && 'Account already exists. Please sign in instead.'}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
          <a
            href="http://localhost:5000/auth/login?mode=login"
            style={{ textDecoration: 'none' }}
          >
            <button
              type="button"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: '#f9fafb',
                color: '#020617',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '4px',
                  background:
                    'conic-gradient(from 180deg, #ea4335, #fbbc04, #34a853, #4285f4, #ea4335)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    backgroundColor: '#f9fafb',
                    width: 14,
                    height: 14,
                    borderRadius: '3px',
                    display: 'block',
                  }}
                />
              </span>
              <span>Continue with Google</span>
            </button>
          </a>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              color: '#6b7280',
              margin: '6px 0',
            }}
          >
            <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(55,65,81,0.9)' }} />
            <span>or</span>
            <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(55,65,81,0.9)' }} />
          </div>

          <a
            href="http://localhost:5000/auth/login?mode=signup"
            style={{ textDecoration: 'none' }}
          >
            <button
              type="button"
              style={{
                width: '100%',
                padding: '9px 14px',
                borderRadius: '999px',
                border: '1px solid rgba(148,163,184,0.7)',
                backgroundColor: 'rgba(15,23,42,0.95)',
                color: '#e5e7eb',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Sign up with Google
            </button>
          </a>
        </div>

        <p
          style={{
            marginTop: '14px',
            fontSize: '11px',
            color: '#6b7280',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          By continuing you agree to allow the copilot to read relevant Gmail metadata and
          manage calendar events on your behalf. You can revoke access at any time from your
          Google account.
        </p>
      </div>
    </div>
  );
};

export default Login;
