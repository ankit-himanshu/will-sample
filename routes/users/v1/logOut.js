const z = require('zod');
const ApiError = require("../../ApiError");
const {session: sessionRedis} = require("../../../redis");
const jwt = require('jsonwebtoken');

const middlewares = {};

middlewares.validate = async(req, res, next) => {
  const sessionId = req.params.sessionId;
  if(!sessionId) return next(
    new ApiError(400, 'E0010001', {
      message: `'sessionId' is invalid/missing`,
    }),
  );
  next();
}

middlewares.invalidateToken = async(req, res, next) => {
  try{
    await sessionRedis.invalidate(req.params.sessionId);
    next();
  }catch(e){
    return next(
      new ApiError(400, 'E0010001', {
        debug: e,
      }),
    );
  }
}

middlewares.buildResponse = async(req, res, next) => {
  res.status(200).send({
    message: "Log out successfully"
  })
}

module.exports = middlewares;