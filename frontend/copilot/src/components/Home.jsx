


// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const BACKEND_URL = 'http://localhost:5000';

// const Home = () => {
//   const [user, setUser] = useState(null);
//   const [emails, setEmails] = useState([]);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [loadingEmails, setLoadingEmails] = useState(false);

//   const [categorization, setCategorization] = useState(null);
//   const [aiLoading, setAiLoading] = useState(false);

//   const fetchEmails = async (date = '') => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       setLoadingEmails(true);

//       let url = `${BACKEND_URL}/gmail/emails`;
//       if (date) url += `?date=${date}`;

//       const res = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setEmails(res.data.emails || []);
//       setCategorization(null);
//     } catch (err) {
//       console.error('Gmail fetch error:', err);
//     } finally {
//       setLoadingEmails(false);
//     }
//   };

//   const categorizeEmails = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token || emails.length === 0) return;

//       setAiLoading(true);

//       const res = await axios.post(
//         `${BACKEND_URL}/ai/categorize`,
//         { emails: emails.slice(0, 3) }, // 🔒 LIMIT
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setCategorization(res.data.categorized);
//     } catch (err) {
//       console.error('AI categorization error:', err);
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const tokenFromURL = params.get('token');

//     if (tokenFromURL) {
//       localStorage.setItem('token', tokenFromURL);
//       window.history.replaceState({}, document.title, '/home');
//     }

//     const token = tokenFromURL || localStorage.getItem('token');
//     if (!token) return;

//     axios
//       .get(`${BACKEND_URL}/user/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(res => setUser(res.data))
//       .catch(err => console.error(err));

//     fetchEmails();
//   }, []);

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Home</h1>

//       {user ? (
//         <>
//           <p><b>Name:</b> {user.name}</p>
//           <p><b>Email:</b> {user.email}</p>
//         </>
//       ) : (
//         <p>Loading user info...</p>
//       )}

//       <hr />

//       <input
//         type="date"
//         value={selectedDate}
//         onChange={e => setSelectedDate(e.target.value)}
//       />

//       <button onClick={() => fetchEmails(selectedDate)}>Fetch</button>
//       <button onClick={() => fetchEmails()}>Today</button>

//       <hr />

//       {loadingEmails ? (
//         <p>Loading emails...</p>
//       ) : (
//         <>
//           <ul>
//             {emails.map((email, i) => (
//               <li key={i}>
//                 <p><b>From:</b> {email.from}</p>
//                 <p><b>Subject:</b> {email.subject}</p>
//                 <p>{email.snippet}</p>
//               </li>
//             ))}
//           </ul>

         
//         </>
//       )}

     
//     </div>
//   );
// };

// export default Home;















//add events but make duplicate 
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const BACKEND_URL = 'http://localhost:5000';

// const extractDueDate = (text) => {
//   // YYYY-MM-DD
//   let match = text.match(/(\d{4})-(\d{2})-(\d{2})/);
//   if (match) {
//     return `${match[1]}-${match[2]}-${match[3]}`;
//   }

//   // DD-MM-YYYY
//   match = text.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
//   if (match) {
//     const day = match[1].padStart(2, '0');
//     const month = match[2].padStart(2, '0');
//     const year = match[3];
//     return `${year}-${month}-${day}`;
//   }

//   return null;
// };



// const Home = () => {
//   const [user, setUser] = useState(null);
//   const [emails, setEmails] = useState([]);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [loadingEmails, setLoadingEmails] = useState(false);

//   const [categorization, setCategorization] = useState(null);
//   const [aiLoading, setAiLoading] = useState(false);

//   const fetchEmails = async (date = '') => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       setLoadingEmails(true);

//       let url = `${BACKEND_URL}/gmail/emails`;
//       if (date) url += `?date=${date}`;

//       const res = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setEmails(res.data.emails || []);
//       setCategorization(null);
//     } catch (err) {
//       console.error('Gmail fetch error:', err);
//     } finally {
//       setLoadingEmails(false);
//     }
//   };

//    const generateCalendarEvents = async () => {
//   try {
//     const token = localStorage.getItem('token');
//     if (!token || emails.length === 0) return;

//     setAiLoading(true);

//     const KEYWORDS = ['due date', 'deadline', 'last date'];

//     const filteredEmails = emails.filter(email =>
//       KEYWORDS.some(keyword =>
//         (email.subject + ' ' + email.snippet)
//           .toLowerCase()
//           .includes(keyword)
//       )
//     );

//     if (filteredEmails.length === 0) {
//       alert('No emails with relevant keywords found.');
//       return;
//     }

//     const events = filteredEmails
//       .map(email => {
//         const dueDate = extractDueDate(
//           `${email.subject} ${email.snippet}`
//         );

//         if (!dueDate) return null;

//         return {
//           subject: email.subject,      // ✅ REQUIRED
//           from: email.from,            // ✅ REQUIRED
//           description: email.snippet,
//           dueDate,                     // ✅ YYYY-MM-DD
//         };
//       })
//       .filter(Boolean);

//     if (events.length === 0) {
//       alert('No valid due dates found.');
//       return;
//     }

//     const res = await axios.post(
//       `${BACKEND_URL}/calendar/add-events`,
//       { events },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     alert(
//       `Added: ${res.data.added}\nSkipped (duplicates): ${res.data.skipped}`
//     );
//   } catch (err) {
//     console.error('Calendar event generation error:', err);
//     alert('Failed to add events');
//   } finally {
//     setAiLoading(false);
//   }
// };




//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const tokenFromURL = params.get('token');

//     if (tokenFromURL) {
//       localStorage.setItem('token', tokenFromURL);
//       window.history.replaceState({}, document.title, '/home');
//     }

//     const token = tokenFromURL || localStorage.getItem('token');
//     if (!token) return;

//     axios
//       .get(`${BACKEND_URL}/user/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(res => setUser(res.data))
//       .catch(err => console.error(err));

//     fetchEmails();
//   }, []);

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Home</h1>

//       {user ? (
//         <>
//           <p><b>Name:</b> {user.name}</p>
//           <p><b>Email:</b> {user.email}</p>
//         </>
//       ) : (
//         <p>Loading user info...</p>
//       )}

//       <hr />

//       <input
//         type="date"
//         value={selectedDate}
//         onChange={e => setSelectedDate(e.target.value)}
//       />

//       <button onClick={() => fetchEmails(selectedDate)}>Fetch</button>
//       <button onClick={() => fetchEmails()}>Today</button>

//       <hr />

//       {loadingEmails ? (
//         <p>Loading emails...</p>
//       ) : (
//         <>
//           <ul>
//             {emails.map((email, i) => (
//               <li key={i}>
//                 <p><b>From:</b> {email.from}</p>
//                 <p><b>Subject:</b> {email.subject}</p>
//                 <p>{email.snippet}</p>
//               </li>
//             ))}
//           </ul>

//           {/* 🔴 NEW BUTTON (ADDED ONLY) */}
//           <button onClick={generateCalendarEvents} disabled={aiLoading}>
//             {aiLoading ? 'Processing...' : 'Generate Events & Add to Calendar'}
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default Home;














//draft mails
import { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const extractDueDate = (text) => {
  let match = text.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[1]}-${match[2]}-${match[3]}`;

  match = text.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
  if (match) {
    const day = match[1].padStart(2, '0');
    const month = match[2].padStart(2, '0');
    return `${match[3]}-${month}-${day}`;
  }

  return null;
};

const Home = () => {
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState({});
  const [expanded, setExpanded] = useState({});

  const summarizeEmail = async (email, index) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${BACKEND_URL}/ai-extra/summarize`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAiResult(prev => ({
        ...prev,
        [index]: { ...(prev[index] || {}), summary: res.data.summary }
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const categorizeEmail = async (email, index) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${BACKEND_URL}/ai-extra/categorize`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAiResult(prev => ({
        ...prev,
        [index]: { ...(prev[index] || {}), category: res.data }
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmails = async (date = '') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      setLoadingEmails(true);

      let url = `${BACKEND_URL}/gmail/emails`;
      if (date) url += `?date=${date}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEmails(res.data.emails || []);
    } catch (err) {
      console.error('Gmail fetch error:', err);
    } finally {
      setLoadingEmails(false);
    }
  };

  const generateCalendarEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || emails.length === 0) return;

      setAiLoading(true);

      const KEYWORDS = ['due date', 'deadline', 'last date'];

      const filteredEmails = emails.filter(email =>
        KEYWORDS.some(keyword =>
          (email.subject + ' ' + email.snippet)
            .toLowerCase()
            .includes(keyword)
        )
      );

      const events = filteredEmails
        .map(email => {
          const dueDate = extractDueDate(
            `${email.subject} ${email.snippet}`
          );
          if (!dueDate) return null;

          return {
            subject: email.subject,
            from: email.from,
            description: email.snippet,
            dueDate,
          };
        })
        .filter(Boolean);

      if (events.length === 0) {
        alert('No valid due dates found.');
        return;
      }

      const res = await axios.post(
        `${BACKEND_URL}/calendar/add-events`,
        { events },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Added: ${res.data.added}\nSkipped: ${res.data.skipped}`);
    } catch (err) {
      console.error(err);
      alert('Failed to add events');
    } finally {
      setAiLoading(false);
    }
  };

  const generateAIDrafts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || emails.length === 0) return;

      setAiLoading(true);

      await axios.post(
        `${BACKEND_URL}/gmail/generate-drafts`,
        { emails },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('AI reply drafts created in Gmail (Drafts)');
    } catch (err) {
      console.error(err);
      alert('Failed to generate drafts');
    } finally {
      setAiLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

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
      .get(`${BACKEND_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUser(res.data))
      .catch(err => console.error(err));

    fetchEmails();
  }, []);

  const stripDisclaimer = (htmlOrText) => {
    if (!htmlOrText) return '';

    const lower = htmlOrText.toLowerCase();
    const markers = [
      'disclaimer:',
      'disclaimer -',
      'confidentiality notice',
      'this message is intended only for the person or entity',
      'you received this message because',
    ];

    let cutIndex = htmlOrText.length;
    markers.forEach(marker => {
      const idx = lower.indexOf(marker.toLowerCase());
      if (idx !== -1 && idx < cutIndex) {
        cutIndex = idx;
      }
    });

    return htmlOrText.slice(0, cutIndex);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a, #020617)',
        padding: '32px 16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflowY: 'auto',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          backgroundColor: 'rgba(15,23,42,0.98)',
          borderRadius: '24px',
          padding: '24px 24px 28px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.65)',
          color: '#e5e7eb',
          border: '1px solid rgba(148,163,184,0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            gap: '12px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(22,163,74,0.12)',
                color: '#4ade80',
                border: '1px solid rgba(74,222,128,0.28)',
                marginBottom: '6px',
              }}
            >
              Gmail • Calendar • AI
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                color: '#f9fafb',
              }}
            >
              Personal Productivity Copilot
            </h1>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '13px',
                color: '#9ca3af',
              }}
            >
              See today&apos;s important emails, generate events & AI replies in one focused workspace.
            </p>
          </div>

          <div style={{ textAlign: 'right', minWidth: '120px' }}>
            <button
              onClick={() => window.location.href = '/profile'}
              style={{
                padding: '8px 14px',
                borderRadius: '999px',
                border: '1px solid rgba(148,163,184,0.4)',
                background: 'rgba(15,23,42,0.8)',
                color: '#e5e7eb',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '999px',
                  background:
                    'radial-gradient(circle at 0 0, #22c55e, transparent 55%), radial-gradient(circle at 100% 100%, #0ea5e9, transparent 55%)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#0b1120',
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
              </span>
              <span>Profile</span>
            </button>
            <button
              onClick={handleLogout}
              style={{
                marginTop: '8px',
                padding: '6px 12px',
                borderRadius: '999px',
                border: '1px solid rgba(239,68,68,0.7)',
                background: 'rgba(127,29,29,0.25)',
                color: '#fecaca',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Logout
            </button>
            {user && (
              <p
                style={{
                  margin: '6px 0 0',
                  fontSize: '11px',
                  color: '#9ca3af',
                }}
              >
                Signed in as <span style={{ color: '#e5e7eb' }}>{user.email}</span>
              </p>
            )}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            marginTop: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              alignItems: 'center',
              padding: '10px 14px',
              borderRadius: '14px',
              backgroundColor: 'rgba(15,23,42,0.9)',
              border: '1px solid rgba(55,65,81,0.9)',
            }}
          >
            <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500 }}>
              Filter by date
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{
                padding: '7px 10px',
                borderRadius: '10px',
                border: '1px solid rgba(75,85,99,0.9)',
                backgroundColor: '#020617',
                color: '#e5e7eb',
                fontSize: '12px',
                outline: 'none',
              }}
            />
            <button
              onClick={() => fetchEmails(selectedDate)}
              style={{
                padding: '7px 12px',
                borderRadius: '999px',
                border: 'none',
                background:
                  'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#0b1120',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Fetch for date
            </button>
            <button
              onClick={() => fetchEmails()}
              style={{
                padding: '7px 12px',
                borderRadius: '999px',
                border: '1px solid rgba(148,163,184,0.6)',
                background: 'transparent',
                color: '#e5e7eb',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Today
            </button>

            <div style={{ flex: 1 }} />

            <button
              onClick={generateCalendarEvents}
              disabled={aiLoading || emails.length === 0}
              style={{
                padding: '7px 12px',
                borderRadius: '999px',
                border: 'none',
                background: aiLoading
                  ? 'rgba(148,163,184,0.35)'
                  : 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                color: '#0b1120',
                fontSize: '12px',
                fontWeight: 600,
                cursor: aiLoading || emails.length === 0 ? 'not-allowed' : 'pointer',
                opacity: emails.length === 0 ? 0.7 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>📅</span>
              <span>{aiLoading ? 'Creating events…' : 'Events from emails'}</span>
            </button>

            <button
              onClick={generateAIDrafts}
              disabled={aiLoading || emails.length === 0}
              style={{
                padding: '7px 12px',
                borderRadius: '999px',
                border: '1px solid rgba(148,163,184,0.7)',
                background: 'rgba(15,23,42,0.8)',
                color: '#e5e7eb',
                fontSize: '12px',
                fontWeight: 500,
                cursor: aiLoading || emails.length === 0 ? 'not-allowed' : 'pointer',
                opacity: emails.length === 0 ? 0.7 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>✨</span>
              <span>{aiLoading ? 'Working…' : 'Generate AI drafts'}</span>
            </button>
          </div>

          <div
            style={{
              borderRadius: '18px',
              background: 'radial-gradient(circle at top, rgba(56,189,248,0.09), transparent 55%)',
              border: '1px solid rgba(55,65,81,0.9)',
              padding: '16px 16px 18px',
              minHeight: '220px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    color: '#f9fafb',
                  }}
                >
                  Inbox Focus
                </h2>
                <p
                  style={{
                    margin: '3px 0 0',
                    fontSize: '12px',
                    color: '#9ca3af',
                  }}
                >
                  Summarize and categorize emails inline, then turn them into events and drafts.
                </p>
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  textAlign: 'right',
                }}
              >
                {loadingEmails
                  ? 'Syncing Gmail…'
                  : emails.length
                  ? `${emails.length} emails loaded`
                  : 'No emails loaded yet'}
              </div>
            </div>

            {loadingEmails ? (
              <div
                style={{
                  marginTop: '26px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#9ca3af',
                  fontSize: '13px',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '999px',
                    border: '2px solid rgba(148,163,184,0.45)',
                    borderTopColor: '#38bdf8',
                    animation: 'spin 0.9s linear infinite',
                  }}
                />
                <span>Loading emails from Gmail…</span>
              </div>
            ) : (
              <div
                style={{
                  marginTop: '12px',
                  maxHeight: '70vh',
                  overflowY: 'auto',
                  paddingRight: '4px',
                }}
              >
                {emails.length === 0 ? (
                  <div
                    style={{
                      padding: '20px 14px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(15,23,42,0.85)',
                      border: '1px dashed rgba(75,85,99,0.9)',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#9ca3af',
                    }}
                  >
                    Connect your Gmail and click <span style={{ color: '#e5e7eb' }}>Today</span> or choose a{' '}
                    <span style={{ color: '#e5e7eb' }}>date</span> to start pulling in emails.
                  </div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {emails.map((email, i) => (
                      <li
                        key={i}
                        style={{
                          marginBottom: '14px',
                          padding: '12px 14px 10px',
                          borderRadius: '14px',
                          backgroundColor: 'rgba(15,23,42,0.95)',
                          border: '1px solid rgba(55,65,81,0.95)',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.48)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '8px',
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                              style={{
                                margin: 0,
                                fontSize: '11px',
                                color: '#9ca3af',
                              }}
                            >
                              From{' '}
                              <span style={{ color: '#e5e7eb', fontWeight: 500 }}>
                                {email.from}
                              </span>
                            </p>
                            <p
                              style={{
                                margin: '3px 0 6px',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#f9fafb',
                              }}
                            >
                              {email.subject || '(No subject)'}
                            </p>
                          </div>

                          {aiResult[i]?.category && (
                            <div
                              style={{
                                textAlign: 'right',
                                minWidth: '140px',
                                fontSize: '11px',
                                color: '#9ca3af',
                              }}
                            >
                              <div
                                style={{
                                  padding: '3px 8px',
                                  borderRadius: '999px',
                                  backgroundColor: 'rgba(56,189,248,0.08)',
                                  border: '1px solid rgba(56,189,248,0.35)',
                                  color: '#7dd3fc',
                                  marginBottom: '4px',
                                  display: 'inline-block',
                                }}
                              >
                                {aiResult[i].category.category}
                              </div>
                              <div>{aiResult[i].category.subcategory}</div>
                              <div>
                                Priority:{' '}
                                <span style={{ color: '#e5e7eb' }}>
                                  {aiResult[i].category.priority}
                                </span>
                              </div>
                              <div>
                                Action:{' '}
                                <span style={{ color: '#e5e7eb' }}>
                                  {aiResult[i].category.actionRequired}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            marginTop: '4px',
                            lineHeight: 1.6,
                            fontSize: '12px',
                            color: '#d1d5db',
                            fontFamily:
                              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            maxHeight: expanded[i] ? 'none' : '72px',
                            overflowY: expanded[i] ? 'visible' : 'hidden',
                          }}
                          dangerouslySetInnerHTML={{
                            __html: stripDisclaimer(
                              expanded[i] ? (email.body || email.snippet) : email.snippet
                            ),
                          }}
                        />

                        {email.body && email.body.length > email.snippet.length && (
                          <button
                            onClick={() =>
                              setExpanded(prev => ({ ...prev, [i]: !prev[i] }))
                            }
                            style={{
                              marginTop: '4px',
                              fontSize: '11px',
                              color: '#60a5fa',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 0,
                            }}
                          >
                            {expanded[i] ? 'Show less' : 'Read full email'}
                          </button>
                        )}

                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginTop: '10px',
                            alignItems: 'center',
                          }}
                        >
                          <button
                            onClick={() => summarizeEmail(email, i)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '999px',
                              border: '1px solid rgba(148,163,184,0.7)',
                              backgroundColor: 'rgba(15,23,42,0.9)',
                              color: '#e5e7eb',
                              fontSize: '11px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>📝</span>
                            <span>Summarize</span>
                          </button>
                          <button
                            onClick={() => categorizeEmail(email, i)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '999px',
                              border: 'none',
                              background:
                                'linear-gradient(135deg, #6366f1, #8b5cf6)',
                              color: '#f9fafb',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>🔎</span>
                            <span>Categorize</span>
                          </button>

                          {aiResult[i]?.summary && (
                            <div
                              style={{
                                marginTop: '4px',
                                padding: '8px 10px',
                                borderRadius: '10px',
                                backgroundColor: 'rgba(15,23,42,0.95)',
                                border: '1px solid rgba(55,65,81,0.9)',
                                fontSize: '11px',
                                color: '#d1d5db',
                                flexBasis: '100%',
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: 600,
                                  color: '#e5e7eb',
                                  marginRight: 4,
                                }}
                              >
                                Summary:
                              </span>
                              {aiResult[i].summary}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
