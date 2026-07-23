const url = "https://dengarkan.id/api/blogs";
fetch(url)
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)))
  .catch(console.error);
