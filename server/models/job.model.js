const mongoose = require('mongoose');

let jobSchema = mongoose.Schema({
  company: String,
  link: String,
  notes: String,
  createTime: Date
});

module.exports = mongoose.model('Job', jobSchema);
