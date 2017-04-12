const jobRouter = require('express').Router();

let allJobs = [
  {
    id: "12345",                            // assigned by MongoDB
    company: "Acme",                        // provided on creation by the front end (required)
    link: "http://www.acmecorp.com",        // provided on creation by the front end (required, either a URL or email address)
    notes: "Wild E. Coyote, Super Genius",  // provided on creation by the front end (optional)
    createTime: Date.now()                  // Created by the back end (YOU)
  },
  {
    id: "7892",
    company: "Zorg",
    link: "http://zorgindustries.com",
    notes: "I am very disappointed",
    createTime: Date.now()
  }
];

jobRouter.get('/', function getAllJobs(req, res, next) {

  res.json(allJobs.map(function outputProperties(job) {
    return {
      id: job.id,
      company: job.company,
      link: job.link
    };
  }));

  // res.json(allJobs);
});

function addAJob(req, res, next) {

  if (!req.body.company || !req.body.link) {
    let err = new Error('Please add a valid job');
    err.status = 400;
    next(err);
    return;
  }

  req.body.id = Math.ceil( Math.random() * 300 ); // id is random number
  req.body.createTime = Date.now();

  allJobs.push(req.body);

  res.json( { message: 'New job added!', addedJob: req.body });
}
jobRouter.post('/', addAJob);

module.exports = jobRouter;
