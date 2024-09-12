const express = require("express");

const router = express.Router();
const register = require("./register");
const login = require("./login");
const validateSession = require("./validateSession");
const logOut = require("./logOut");

const error = require("../../error");

router.post(`/register`,
  register.validate,
  register.checkIfAlreadyRegistered,
  register.save,
  register.generateSession,
  register.buildResponse,
  error
)

router.post(`/login`,
  login.validate,
  login.signIn,
  login.generateSession,
  login.buildResponse,
  error
)

router.get(`/session/:sessionId`,
  validateSession.validate,
  validateSession.validateToken,
  validateSession.buildResponse,
  error
)

router.delete(`/logout/:sessionId`,
  logOut.validate,
  logOut.invalidateToken,
  logOut.buildResponse,
  error
)

module.exports = router;