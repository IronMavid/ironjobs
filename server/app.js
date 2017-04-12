const express = require('express');
const bodyParser = require('body-parser');

let app = express();

app.get('/', function showHomePage(request, response, next) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.end('<h1>Hello Express World</h1>');
});

app.listen(3000, function doSomethingOnceServerIsUp() {
  console.log('The Express server is now up');
});
