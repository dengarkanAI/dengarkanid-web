const http = require('http');

async function test() {
  // 1. Create ID locale
  const res1 = await fetch('http://localhost:1337/api/global-setting?locale=id', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { footerInterestedTitle: "API ID" } })
  });
  const data1 = await res1.json();
  console.log("ID Response:", data1);

  if(data1.data && data1.data.documentId) {
    // 2. Try to create EN locale from that documentId
    const res2 = await fetch('http://localhost:1337/api/global-setting?locale=en', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { footerInterestedTitle: "API EN" } })
    });
    const data2 = await res2.json();
    console.log("EN Response:", data2);
  }
}
test();
