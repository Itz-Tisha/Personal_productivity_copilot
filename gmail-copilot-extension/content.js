function readTodayEmails() {
  const emails = [];
  const threads = document.querySelectorAll('tr.zA'); // Gmail inbox row
  const today = new Date();
  today.setHours(0,0,0,0);

  threads.forEach(thread => {
    const dateEl = thread.querySelector('td.xW span');
    if (!dateEl) return;
    const timestamp = new Date(dateEl.getAttribute('title'));
    if (timestamp >= today) {
      const subject = thread.querySelector('span.bog')?.innerText || '';
      const from = thread.querySelector('span.yX.xY span')?.innerText || '';
      const snippet = thread.querySelector('span.y2')?.innerText || '';
      emails.push({ subject, from, snippet });
    }
  });

  return emails;
}

// Send to backend
async function sendEmailsToAI() {
  const emails = readTodayEmails();
  const token = localStorage.getItem('token');

  for (let email of emails) {
    const res = await fetch('http://localhost:5000/ai/email', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(email)
    });
    const data = await res.json();
    console.log('AI result:', data);
  }
}

setTimeout(sendEmailsToAI, 3000); // wait Gmail UI to load
