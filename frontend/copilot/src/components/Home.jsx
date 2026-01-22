


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

  /* ---------------- CALENDAR EVENTS ---------------- */

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

  /* ---------------- AI DRAFTS ---------------- */

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

  return (
    <div style={{ padding: '20px' }}>
      <button
  style={{ float: 'right' }}
  onClick={() => window.location.href = '/profile'}
>
  Profile
</button>

      <h1>Home</h1>

      {user ? (
        <>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
        </>
      ) : (
        <p>Loading user info...</p>
      )}

      <hr />

      <input
        type="date"
        value={selectedDate}
        onChange={e => setSelectedDate(e.target.value)}
      />

      <button onClick={() => fetchEmails(selectedDate)}>Fetch</button>
      <button onClick={() => fetchEmails()}>Today</button>

      <hr />

      {loadingEmails ? (
        <p>Loading emails...</p>
      ) : (
        <>
          {/* <ul>
            {emails.map((email, i) => (
              <li key={i}>
                <p><b>From:</b> {email.from}</p>
                <p><b>Subject:</b> {email.subject}</p>
                <p>{email.snippet}</p>
              </li>
            ))}
          </ul>
           */}


        <ul style={{ listStyle: 'none', padding: 0 }}>
  {emails.map((email, i) => (
    <li
      key={i}
      style={{
        marginBottom: '25px',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}
    >
      <p style={{ margin: 0, fontWeight: 'bold' }}>From: {email.from}</p>
      <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Subject: {email.subject}</p>

      <div
        style={{
          whiteSpace: 'pre-wrap',
          fontFamily: 'Arial, sans-serif',
          lineHeight: '1.6',
          marginTop: '10px',
          background: '#f9f9f9',
          padding: '10px',
          borderRadius: '6px',
          border: '1px solid #eee'
        }}
      >
        {expanded[i] ? (email.body || email.snippet) : email.snippet}
      </div>

      {email.body && email.body.length > email.snippet.length && (
        <button
          onClick={() => setExpanded(prev => ({ ...prev, [i]: !prev[i] }))}
          style={{
            color: 'blue',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginTop: '5px'
          }}
        >
          {expanded[i] ? 'Read less' : 'Read more'}
        </button>
      )}

      <div style={{ marginTop: '10px' }}>
        <button onClick={() => summarizeEmail(email, i)}>Summarize</button>
        <button
          onClick={() => categorizeEmail(email, i)}
          style={{ marginLeft: '10px' }}
        >
          Categorize
        </button>
      </div>

      {aiResult[i]?.summary && (
        <p style={{ marginTop: '10px' }}><b>Summary:</b> {aiResult[i].summary}</p>
      )}

      {aiResult[i]?.category && (
        <div style={{ marginTop: '10px' }}>
          <p><b>Category:</b> {aiResult[i].category.category}</p>
          <p><b>Subcategory:</b> {aiResult[i].category.subcategory}</p>
          <p><b>Priority:</b> {aiResult[i].category.priority}</p>
          <p><b>Action Required:</b> {aiResult[i].category.actionRequired}</p>
        </div>
      )}
    </li>
  ))}
</ul>



          <button onClick={generateCalendarEvents} disabled={aiLoading}>
            Generate Events & Add to Calendar
          </button>

          <br /><br />

          <button onClick={generateAIDrafts} disabled={aiLoading}>
            Generate AI Reply Drafts
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
