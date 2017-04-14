/**
 * [logEvent logs a custom message]
 * @param  {Object}   req  [Request Object]
 * @param  {Object}   res  [Response Object]
 * @param  {Function} next [advances component to next middleware component]
 * @return {void}
 */
module.exports = function logEvent(req, res, next) {
  console.log( 'new request: ', req.url, typeof(req.body) );
  next();
};
