const http = require('http');
http.get('http://localhost:1337/api/glosariums', (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log(data));
});
