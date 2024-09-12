const z = require('zod');
const ApiError = require("../../ApiError");
const {users: usersSQL} = require("../../../psql/controller");
const {users : {FIELDS: USERS_FIELDS}} = require("../../../psql/model");
const hashHelper = require("../../../helper/hash");
const {session: sessionRedis} = require("../../../redis");
const moment = require('moment');
const jwt = require('jsonwebtoken');

const middlewares = {};

/* The `RequestSchema` constant is defining a schema using Zod, a TypeScript-first schema declaration
and validation library. This schema is used to validate the structure and content of the `req.body`
object in an HTTP request. */
const RequestSchema = z.object({
  email: z.string().email('Email address is invalid'),
  password: z.string().min(6, `'password' must be at least 10 characters`),
});

middlewares.validate = async(req, res, next) => {
  try {
    RequestSchema.parse(req.body);
    if (req.body.email) req.body.email = req.body.email.toLowerCase();
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return next(
        new ApiError(400, 'E0010001', {
          message: `'${firstError.path[0]}' is invalid/missing`,
        }),
      );
    } else {
      next(new ApiError(400, 'E0010001', {}));
    }
  }
}

/* The `middlewares.signIn` function is a middleware function in a Node.js application that handles the
sign-in process for a user. Here is a breakdown of what this function does: */
middlewares.signIn = async(req, res, next) => {
  try{
    const _result = await usersSQL.getByEmail(req.body.email);
    req._user = _result[0];
    if(!req._user) return next(new ApiError(400, 'E0010001', {
      message: "Email does not exists"
    }))

    const _passwordEncrypted = req._user[USERS_FIELDS.PASSWORD];
    const _isValidPassword = await hashHelper.compare(req.body.password, _passwordEncrypted);
    if(!_isValidPassword) return next(new ApiError(400, 'E0010001', {
      message: "Password does not match"
    }))
    next();
  }catch(e){
    return next(
      new ApiError(400, 'E0010001', {
        debug: e,
      }),
    );
  }
}

/* The `middlewares.generateSession` function is a middleware function in a Node.js application that is
responsible for generating a session ID for a user and saving it to a Redis database. Here is a
breakdown of what this function does: */
middlewares.generateSession = async(req, res, next) => {
  try{
    const _createdAt = moment().unix();
    const _sessionId = jwt.sign({ id: req._user[USERS_FIELDS.ID] }, process.env["JWT_SECRET"], {});
    req._sessionId = _sessionId;
    await sessionRedis.save(_sessionId, _createdAt, req._user[USERS_FIELDS.ID]);
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
    session: req._sessionId,
    user: {
      id: req._user[USERS_FIELDS.UUID],
      email: req._user[USERS_FIELDS.EMAIL],
      name: req._user[USERS_FIELDS.NAME],
      email: req.body.email,
    }
  })
}

module.exports = middlewares;