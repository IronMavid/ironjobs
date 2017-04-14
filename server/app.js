const express = require('express');
const bodyParser = require('body-parser');

require('./database-setup.js');

let app = express();

app.use(express.static(__dirname + '/../client'));

app.use(bodyParser.json());
app.use(require('./middleware/log.middleware.js'));
app.use(require('./middleware/auth.middleware.js'));

app.get('/', function showHomePage(request, response, next) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.end('<h1>Hello Express World</h1>');
});

app.use( '/api/jobs', require('./routes/job.routes.js') );

app.use( require('./middleware/error-handler.middleware.js') );

app.listen(3000, function doSomethingOnceServerIsUp() {
  console.log('The Express server is now up');
});
