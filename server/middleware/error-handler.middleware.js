/**
 * [errorHandler middleware returns error object]
 * @param  {Object}   err  [Error object]
 * @param  {Object}   req  [Request Object]
 * @param  {Object}   res  [Response Object]
 * @param  {Function} next [advances to next middleware component in Express]
 * @return {void}
 */
module.exports = function errorHandler( err, req, res, next ) {
  res.status(err.status || 500);
  res.json({ message: err.message, time: Date.now() });
};
