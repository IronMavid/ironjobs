const jobRouter = require('express').Router();
const Job = require('../models/job.model.js');

/**
 * [getAllJobs returns array of Job Objects]
 * @param  {Object}   req  [request Object]
 * @param  {Object}   res  [response Object]
 * @param  {Function} next [advances to next middleware Express component]
 * @return {void}
 */
jobRouter.get('/', function getAllJobs(req, res, next) {
  Job.find()
  .then(function sendAllJobs(allJobs) {
    res.json(allJobs.map(function eachJob(job){
      return {
        id: job._id,
        company: job.company,
        link: job.link
      };
    }));
  })
  .catch(function handleErrors(err){
    let ourError = new Error('Cannot retrieve jobs');
    ourError.status = 500;
    next(ourError);
  });
});

/**
 * [addAJob adds a new job]
 * @param {Object}   req  [request Object]
 * @param {Object}   res  [response Object]
 * @param {Function} next [advances to next Express() middleware]
 */
function addAJob(req, res, next) {
  if (!req.body.company || !req.body.link) {
    let err = new Error('Please add a valid job');
    err.status = 400;
    return next(err);
  }

  let theJobCreated = new Job({
    company: req.body.company,
    link: req.body.link,
    notes: req.body.notes,
    createTime: Date.now()
  });

  theJobCreated.save()
  .then(function sendResponse(data) {
    res.json({ message: 'Added', theJobAdded: data });
  })
  .catch(function handleErrors(err) {
    let ourError = new Error ('Unable to add Job');
    ourError.status = 500;
    next(ourError);
  });
}

jobRouter.post('/', addAJob);

/**
 * [retrieveSingleJob ]
 * @param  {Object}   req  [request Object]
 * @param  {Object}   res  [response Object]
 * @param  {Function} next [advances to next Express middleware component]
 * @return {void}
 */
jobRouter.get('/:jobid', function retrieveSingleJob(req, res, next) {
  Job.findById(req.params.jobid)
  .then(function sendBackAJob(data) {
    if (!data) {
      let err = new Error('That job does not exist!');
      err.status = 404;
      return next(err);
    }
    res.json({ theJobWeFound: data });
  })
  .catch(function handleIssues(err) {
    let ourError = new Error ('Unable to search for Job');
    ourError.status = 500;
    next(err);
  });
});

/**
 * [deleteAJob attempts to delete a job by matching an _id, or sending an error]
 * @param  {Object}   req  [request Object]
 * @param  {Object}   res  [response Object]
 * @param  {Function} next [advances to the next Express middleware]
 * @return {void}
 */
jobRouter.delete('/:jobid', function deleteAJob(req, res, next) {
  if (!req.body) {
    let err = new Error('You must provide a job');
    err.status = 400;
    return next(err);
  }

  Job.findById({ _id: req.params.jobid })
  .then(function deleteSingleJob(theData) {
    if (!theData) {
      let err = new Error('Cannot find a job with that ID to delete');
      err.status = 404;
      return next(err);
    }
    Job.remove(function (err, theData) {
      if (err) {
        err.status = 500;
        return next(err);
      }
    });
    res.json({ theJobWeDeleted: theData });
  })
  .catch(function handleIssue(err) {
    let ourError = new Error ('Unable to delete the Job');
    ourError.status = 404;
    next(ourError);
  });

});

module.exports = jobRouter;
