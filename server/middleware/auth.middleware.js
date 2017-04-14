/**
 * [doAuthentication output error message if authorization is not valid]
 * @param  {Object}   req  [request Object]
 * @param  {Object}   res  [request Object]
 * @param  {Function} next [advance to next middleware in the Express chain]
 * @return {Function}      [next() function with Error Object]
 */
module.exports = function doAuthentication(req, res, next) {
  if (!req.headers.authorization) {
    console.log(req.headers);
    let err = new Error('You are not authenticated.');
    err.status = 401;
    return next(err);
  }
  next();
};
