module.exports = function doAuthentication(req, res, next) {
  if (!req.headers.authorization) {
    console.log(req.headers);
    let err = new Error('You are not authenticated.');
    err.status = 401;
    return next(err);
  }
  // if authenticated
  next();
};
