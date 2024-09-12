const ApiError = require('./ApiError');

module.exports = (err, req, res, next) => {
  if(err instanceof ApiError) {
    req.___ERROR___ = err;
    return res.status(err.httpStatusCode).json(err);
  }
  
  res.status(500).json(new ApiError(500, 'E0010001', {debug: err}));
};
