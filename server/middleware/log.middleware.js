module.exports = function logEvent(req, res, next) {
  console.log( 'new request: ', req.url, typeof(req.body) );
  next();
};
