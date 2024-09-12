const key = require("./keys");
const query = require("./query");

const HASH_FIELDS = {
  CREATED_AT: 'createdAt',
  USER_ID: 'userId'
}

/**
* The `save` function asynchronously saves session data including creation time and user ID using a
* key generated from the session ID.
* @param sessionId - A unique identifier for the session.
* @param createdAt - The `createdAt` parameter typically represents the date and time when the session
* was created. It is a timestamp indicating when the session started.
* @param userId - The `userId` parameter in the `save` function refers to the unique identifier of the
* user associated with the session. It is used to store information about the user in the session
* data.
* @returns The `save` function is returning nothing explicitly, as it ends with `return;`.
*/
const save = async(sessionId, createdAt, userId) => {
  try{
    const _key = key.SESSION.format({sessionId});
    await query.asyncHmset(_key, {
      [HASH_FIELDS.CREATED_AT]: createdAt,
      [HASH_FIELDS.USER_ID]: userId
    });
    query.expire(_key, 24*60*60);
    return;
  }catch(e){
    console.log(e)
  }
}

/**
* The function `get` retrieves data associated with a specific session ID using an asynchronous query.
* @param sessionId - The `sessionId` parameter is a unique identifier for a user session. It is used
* to retrieve session data from a data store using the `get` function.
* @returns The `get` function is returning the result of an asynchronous operation that queries and
* retrieves all fields and values of a hash stored in a Redis database using the provided `sessionId`
* as part of the key.
*/
const get = async(sessionId) => {
  const _key = key.SESSION.format({sessionId});
  return await query.asyncHgetall(_key);
}

/**
 * The function `invalidate` invalidates a session by deleting it from the database using the session
 * ID.
 * @param sessionId - The `sessionId` parameter is a unique identifier for a session that needs to be
 * invalidated.
 * @returns The `invalidate` function is returning the result of the asynchronous deletion operation
 * performed by `query.asyncDel(_key)`.
 */
const invalidate = async(sessionId) => {
  const _key = key.SESSION.format({sessionId});
  return await query.asyncDel(_key);
}

module.exports = {
  save, get, invalidate
}