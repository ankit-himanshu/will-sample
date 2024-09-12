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

middlewares.validateToken = async(req, res, next) => {
  try{
    const decoded = jwt.verify(req.params.sessionId, process.env["JWT_SECRET"]);
    const {id} = decoded;
    if(!id) return res.status(401).send();
    const _session = await sessionRedis.get(req.params.sessionId);
    if(!_session) return res.status(401).send();
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
    message: "Valid session"
  })
}

module.exports = middlewares;