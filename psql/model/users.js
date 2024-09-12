/**
* Module specific to users table
*/

const TABLE_NAME = "users";
const FIELDS = {
  "ID": "id",
  "UUID": "uuid",
  "EMAIL": "email",
  "PASSWORD": "password",
  "NAME": "name",
  "CREATED_AT": "created_at"
}

module.exports = {
  TABLE_NAME,
  FIELDS
};