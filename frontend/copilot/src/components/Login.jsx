import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Login = () => {
  const { colors, theme, toggleTheme } = useTheme();
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
        padding: '24px',
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
          : 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        transition: 'background 0.5s ease',
        overflow: 'auto',
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: theme === 'dark'
            ? 'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139,92,246,0.15) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139,92,246,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Theme Toggle - Floating */}
        <button
          onClick={toggleTheme}
          style={{
            position: 'absolute',
            top: '-60px',
            right: 0,
            padding: '10px 16px',
            borderRadius: '12px',
            border: 'none',
            background: theme === 'dark'
              ? 'rgba(59,130,246,0.2)'
              : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            color: theme === 'dark' ? '#93c5fd' : '#1e40af',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            boxShadow: theme === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.3)'
              : '0 8px 32px rgba(0,0,0,0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.background = theme === 'dark'
              ? 'rgba(59,130,246,0.3)'
              : 'rgba(255,255,255,1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = theme === 'dark'
              ? 'rgba(59,130,246,0.2)'
              : 'rgba(255,255,255,0.9)';
          }}
        >
          <span style={{ fontSize: '16px' }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Main Card */}
        <div
          style={{
            backgroundColor: theme === 'dark'
              ? 'rgba(15,23,42,0.8)'
              : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '32px',
            padding: '48px 40px',
            border: theme === 'dark'
              ? '1px solid rgba(59,130,246,0.2)'
              : '1px solid rgba(59,130,246,0.2)',
            boxShadow: theme === 'dark'
              ? '0 20px 60px rgba(0,0,0,0.5)'
              : '0 20px 60px rgba(59,130,246,0.2)',
            color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Logo Section */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 10px 30px rgba(59,130,246,0.4)',
              }}
            >
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                PC
              </span>
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                marginBottom: '12px',
              }}
            >
              Welcome Back
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: '15px',
                color: theme === 'dark' ? 'rgba(241,245,249,0.7)' : 'rgba(15,23,42,0.7)',
                lineHeight: 1.6,
              }}
            >
              Sign in to your productivity copilot
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                marginBottom: '24px',
                padding: '14px 18px',
                borderRadius: '16px',
                backgroundColor: theme === 'dark'
                  ? 'rgba(239,68,68,0.2)'
                  : 'rgba(254,226,226,0.8)',
                border: `1px solid ${theme === 'dark' ? 'rgba(239,68,68,0.4)' : 'rgba(239,68,68,0.5)'}`,
                color: theme === 'dark' ? '#fecaca' : '#991b1b',
                fontSize: '13px',
                backdropFilter: 'blur(10px)',
              }}
            >
              {error === 'NO_ACCOUNT' && 'No account found. Please sign up first.'}
              {error === 'ALREADY_EXISTS' && 'Account exists. Please sign in instead.'}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <a
              href="http://localhost:5000/auth/login?mode=login"
              style={{ textDecoration: 'none', width: '100%' }}
            >
              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: '16px',
                  border: 'none',
                  background: theme === 'dark'
                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                    : '#ffffff',
                  color: theme === 'dark' ? '#ffffff' : '#1e40af',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease',
                  boxShadow: theme === 'dark'
                    ? '0 4px 20px rgba(59,130,246,0.4)'
                    : '0 4px 20px rgba(0,0,0,0.15)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = theme === 'dark'
                    ? '0 8px 30px rgba(59,130,246,0.5)'
                    : '0 8px 30px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = theme === 'dark'
                    ? '0 4px 20px rgba(59,130,246,0.4)'
                    : '0 4px 20px rgba(0,0,0,0.15)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </a>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '8px 0',
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: '1px',
                  background: theme === 'dark'
                    ? 'rgba(148,163,184,0.3)'
                    : 'rgba(59,130,246,0.3)',
                }}
              />
              <span
                style={{
                  fontSize: '12px',
                  color: theme === 'dark' ? 'rgba(148,163,184,0.7)' : 'rgba(59,130,246,0.7)',
                  fontWeight: 500,
                }}
              >
                OR
              </span>
              <div
                style={{
                  flex: 1,
                  height: '1px',
                  background: theme === 'dark'
                    ? 'rgba(148,163,184,0.3)'
                    : 'rgba(59,130,246,0.3)',
                }}
              />
            </div>

            <a
              href="http://localhost:5000/auth/login?mode=signup"
              style={{ textDecoration: 'none', width: '100%' }}
            >
              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: '16px',
                  border: `2px solid ${theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.3)'}`,
                  background: theme === 'dark'
                    ? 'rgba(59,130,246,0.1)'
                    : 'rgba(59,130,246,0.05)',
                  backdropFilter: 'blur(10px)',
                  color: theme === 'dark' ? '#93c5fd' : '#1e40af',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme === 'dark'
                    ? 'rgba(59,130,246,0.2)'
                    : 'rgba(59,130,246,0.1)';
                  e.currentTarget.style.borderColor = theme === 'dark'
                    ? 'rgba(59,130,246,0.5)'
                    : 'rgba(59,130,246,0.5)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = theme === 'dark'
                    ? 'rgba(59,130,246,0.1)'
                    : 'rgba(59,130,246,0.05)';
                  e.currentTarget.style.borderColor = theme === 'dark'
                    ? 'rgba(59,130,246,0.3)'
                    : 'rgba(59,130,246,0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Create New Account
              </button>
            </a>
          </div>

          {/* Footer */}
          <p
            style={{
              marginTop: '32px',
              fontSize: '12px',
              color: theme === 'dark' ? 'rgba(148,163,184,0.7)' : 'rgba(59,130,246,0.7)',
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            By continuing, you agree to allow access to Gmail metadata and calendar management.
            You can revoke access anytime from your Google account settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
