const http = require('http');

const req = http.request('http://localhost:1337/api/blogs', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
req.on('error', console.error);
req.end();
