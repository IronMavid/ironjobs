const mongoose = require('mongoose');
console.log('did we get here to database-setup.js file?');
if(!process.env.MY_DB_LOCATION) {
  console.error('No database detected!!');
  process.exit(128);
}

mongoose.connect(process.env.MY_DB_LOCATION);

mongoose.connection.on('error', function handleDBErrors(err) {
  console.error('DB Error', err);
  process.exit(128);
});
