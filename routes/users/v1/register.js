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
  name: z.string().max(100, `'name' must not exceed 100 characters`),
  password: z.string().min(6, `'password' must be at least 10 characters`),
});

middlewares.validate = async(req, res, next) => {
  try {
    RequestSchema.parse(req.body);
    if (req.body.email) req.body.email = req.body.email.toLowerCase();
    
    req.body.password = await hashHelper.encrypt(req.body.password);
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

/* The `middlewares.checkIfAlreadyRegistered` function is a middleware function in a Node.js
application that is responsible for checking if a given email address already exists in the
database. Here is a breakdown of what this function does: */
middlewares.checkIfAlreadyRegistered = async(req, res, next) => {
  try{
    const _exists = await usersSQL.checkIfEmailExist(req.body.email);
    if(Array.isArray(_exists) && _exists.length) return next(new ApiError(400, 'E0010001', {
      message: "Email already exists"
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

/* The `middlewares.save` function is a middleware function in a Node.js application that is
responsible for saving user data to the database. Here is a breakdown of what this function does: */
middlewares.save = async(req, res, next) => {
  try{
    const _result = await usersSQL.save({
      [USERS_FIELDS.EMAIL]: req.body.email,
      [USERS_FIELDS.PASSWORD]: req.body.password,
      [USERS_FIELDS.NAME]: req.body.name,
    });
    req._user = _result[0][0];
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
    }
  })
}

module.exports = middlewares;