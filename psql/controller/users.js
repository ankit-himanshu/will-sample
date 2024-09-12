const {sequelize} = require("../connection");
const {users: {FIELDS: USERS_FIELDS, TABLE_NAME: USERS_TABLE_NAME}} = require("../model");

const save = async(data) => {
  const _query = `INSERT INTO ${USERS_TABLE_NAME} (${USERS_FIELDS.EMAIL}, ${USERS_FIELDS.PASSWORD}, ${USERS_FIELDS.NAME})
  VALUES (:${USERS_FIELDS.EMAIL}, :${USERS_FIELDS.PASSWORD}, :${USERS_FIELDS.NAME}) RETURNING *`
  return await sequelize.query(_query, {
    type: sequelize.QueryTypes.INSERT,
    replacements: {
      [USERS_FIELDS.EMAIL]: data[USERS_FIELDS.EMAIL],
      [USERS_FIELDS.PASSWORD]: data[USERS_FIELDS.PASSWORD],
      [USERS_FIELDS.NAME]: data[USERS_FIELDS.NAME]
    }
  });
}

const checkIfEmailExist = async(email) => {
  const query = `SELECT ${USERS_FIELDS.ID} from ${USERS_TABLE_NAME} WHERE ${USERS_FIELDS.EMAIL} = :email`;
  return await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      email
    }
  });
}

/**
 * The function getByEmail retrieves user information based on the provided email address from a
 * database using Sequelize in JavaScript.
 * @param email - The `getByEmail` function is a query to retrieve user information based on the email
 * provided. The function uses the Sequelize library to execute a SQL query on a database table named
 * `USERS_TABLE_NAME` and fetches the fields `USER_ID`, `ID`, `PASSWORD`, and `NAME`
 * @returns The `getByEmail` function is returning the result of a query to the database using
 * Sequelize. The query selects the user ID, ID, password, and name from a table named
 * `USERS_TABLE_NAME` where the email matches the provided email parameter. The function returns the
 * result of this query as an array of objects containing the selected fields for the matching user.
 */
const getByEmail = async(email) => {
  const query = `SELECT ${USERS_FIELDS.UUID}, ${USERS_FIELDS.ID}, ${USERS_FIELDS.PASSWORD}, ${USERS_FIELDS.NAME} from ${USERS_TABLE_NAME} WHERE ${USERS_FIELDS.EMAIL} = :email`;
  return await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      email
    }
  });
}

module.exports = {
  save, checkIfEmailExist, getByEmail
};
