const RedisConnection = require("./connection");
const async = require("async");

module.exports = {
  
  /* The above JavaScript code defines a function called `exists` that takes two parameters: `key` and
  `callback`. */
  exists: (key, callback) => {
    const client = RedisConnection.getInstance();
    
    if (client) {
      client.exists(key, (error, result) => {
        return callback(error, result === 1 ? true : false);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  
  /* The above code is a JavaScript function that sets a key-value pair in a Redis database. It first
  gets an instance of the Redis connection using `RedisConnection.getInstance()`. If the client is
  available, it sets the key with the JSON stringified value using `client.set()`. It then calls the
  provided callback function with any error that occurred during the operation and the result of
  setting the key in the Redis database. If the client is not available, it returns an error message
  in the callback. */
  set: (key, value, callback) => {
    const client = RedisConnection.getInstance();
    
    if (client) {
      client.set(key, JSON.stringify(value), (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  /* The above JavaScript code is defining a `get` function that takes a `key` and a `callback` as
  parameters. Inside the function, it attempts to get an instance of a Redis client using
  `RedisConnection.getInstance()`. If the client is successfully obtained, it then calls the `get`
  method on the client with the provided key and a callback function that will be executed when the
  operation is complete. The callback function will return any error that occurred and the result of
  the operation. */
  get: (key, callback) => {
    const client = RedisConnection.getInstance();
    
    if (client) {
      client.get(key, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  /* The above code is a JavaScript function that uses async/await syntax to asynchronously get a value
  from a Redis database using a provided key. It first creates a Promise that resolves with the
  value retrieved from Redis or rejects with an error message. It checks if a Redis client instance
  is available, and if so, it uses the client to get the value associated with the provided key. If
  there is an error in getting the value from Redis or if there is an issue with the Redis client,
  it will reject the Promise with an error message. */
  asyncget: (key) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client) {
        client.get(key, (error, reply) => {
          if(error) return reject(error)
            return resolve(reply);
        });
      }else {
        return reject("error in getting redis client");
      }
    })
  },
  
  /* The above code is a method named `del` that is used to delete a key from a Redis database. It
  first gets an instance of the Redis client using `RedisConnection.getInstance()`. If the client is
  available, it calls the `del` method on the client to delete the specified key. It then returns
  the result of the deletion operation through the provided callback function, either with an error
  and reply if there was an issue, or with an error message if there was a problem getting the Redis
  client. */
  del: (key, callback) => {
    const client = RedisConnection.getInstance();
    
    if (client) {
      client.del(key, (error, reply) => {
        return callback(error, reply);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  /* The above JavaScript code defines a function called `keys` that takes two parameters: `pattern`
  and `callback`. */
  keys: (pattern, callback) => {
    const client = RedisConnection.getInstance();
    if (client) {
      client.keys(pattern, (error, reply) => {
        return callback(error, reply);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  /* The above code is a JavaScript function that uses Redis to scan for keys matching a specified
  pattern. It takes in parameters such as cursor, pattern, count, and a callback function. */
  scan: (cursor, pattern, count, callback) => {
    const client = RedisConnection.getInstance();
    if (client) {
      client.scan(cursor, 'MATCH',pattern,'COUNT', count, (error, reply) => {
        return callback(error, reply);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  /* The above code is a JavaScript function that deletes keys from a Redis database based on a
  specified pattern. It first connects to the Redis database using a RedisConnection class, then
  uses the `keys` method to find all keys that match the specified pattern. It then iterates over
  each key found and deletes it using the `del` method. Finally, it calls the provided callback
  function once all keys have been deleted. If there is an error in getting the Redis client, it
  returns an error message via the callback function. */
  patternDelete: async(pattern, callback) => {
    const client = RedisConnection.getInstance();
    if (client) {
      client.keys(pattern, (err, rows)=> {
        async.each(rows, (row, callbackDelete)=> {
          client.del(row, callbackDelete)
        }, callback)
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  /* The above JavaScript code defines a function `hset` that interacts with a Redis database. */
  hset: (hash, callback) => {
    const client = RedisConnection.getInstance();
    if (client && hash.key && hash.field) {
      client.hset(hash.key, hash.field, hash.value, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  /* The above code is defining an asynchronous function `asyncHset` that takes a `hash` object as a
  parameter. Inside the function, it creates a new Promise that attempts to set a field in a Redis
  hash using the `hset` command. It first checks if a Redis client is available, and if the `hash`
  object contains `key`, `field`, and `value` properties. If all conditions are met, it calls the
  `hset` method on the Redis client with the provided key, field, and value. If successful, it
  resolves the promise with the result, */
  asyncHset: (hash) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && hash.key && hash.field) {
        client.hset(hash.key, hash.field, hash.value, (error, result) => {
          if(error) return reject(error)
            return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    })
  },
  
  /* The above code is defining an asynchronous function `asyncDel` that takes a `key` parameter.
  Inside the function, it creates a Promise that attempts to delete a key from a Redis database
  using the `del` method. It first gets an instance of the Redis client using
  `RedisConnection.getInstance()`, and if the client is available, it attempts to delete the key. If
  the deletion is successful, it resolves the Promise with the reply from the deletion operation. If
  there is an error during the deletion process or if the Redis client is not available, it rejects
  the Promise with an error message. */
  asyncDel: (key) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client) {
        client.del(key, (error, reply) => {
          if(error) return reject(error)
            return resolve(reply);
        });
      }else {
        return reject("error in getting redis client");
      }
    })
  },
  
  /* The above code is a JavaScript function named `hget` that is used to retrieve a value from a Redis
  hash using the `hget` command. It takes two parameters: `hash` which contains the `key` and
  `field` to retrieve the value from, and `callback` which is a function to handle the result of the
  operation. */
  hget: (hash, callback) => {
    const client = RedisConnection.getInstance();
    if (client && hash.key && hash.field) {
      client.hget(hash.key, hash.field, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  /* The above code is a JavaScript function that uses a Promise to asynchronously get a value from a
  Redis database using the hget command. The function takes two parameters: a hash object containing
  the key and field to retrieve from Redis, and a callback function. */
  asynchget: (hash, callback) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && hash.key && hash.field) {
        client.hget(hash.key, hash.field, (error, result) => {
          if(error){
            return reject(error)
          }
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    })
  },
  
  
  /* The above code is a JavaScript function called `mget` that takes in an array of keys and a
  callback function as parameters. It attempts to retrieve multiple values from a Redis database
  using the `mget` command for the provided keys. */
  mget: (keys, callback) => {
    const client = RedisConnection.getInstance();
    if (client) {
      client.mget(keys, (error, reply) => {
        return callback(error, reply);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  /* The above code is an asynchronous function named `asyncMget` that takes an array of keys as a
  parameter. It is using Redis to retrieve multiple values corresponding to the provided keys. Here
  is a breakdown of the code: */
  asyncMget: async (keys) => {
    const client = RedisConnection.getInstance();
    return await new Promise((resolve, reject) => {
      if (client) {
        client.mget(keys, (error, result) => {
          if (error || !result) {
            reject('not found')
          }
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    })
  },
  
  /* The above code is a JavaScript function `hmset` that is used to set multiple fields and values in
  a Redis hash. */
  hmset: (key, values, callback) => {
    const client = RedisConnection.getInstance();
    
    if (client && key && values && Object.keys(values).length > 0) {
      Object.keys(values).forEach(_key => {
        if(values[_key] === undefined){
          delete values[_key];
        }
      })
      client.hmset(key, values, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client or key/values is invalid", null);
    }
  },
  
  /* The above code is defining an asynchronous function `asyncHmset` that takes a key and a values
  object as parameters. It then returns a Promise that attempts to set multiple fields and values in
  a Redis hash using the `hmset` command. */
  asyncHmset(key, values){
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key && values && Object.keys(values).length > 0) {
        Object.keys(values).forEach(_key => {
          if(values[_key] === undefined){
            delete values[_key];
          }
        })
        client.hmset(key, values, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
      } else {
        return reject("error in getting redis client or key/values is invalid", null);
      }
    })
  },
  
  /* The above code is a JavaScript function named `hmget` that is designed to interact with a Redis
  database. It takes two parameters: `key` (the key to retrieve from Redis) and `fields` (an array
  of field names to retrieve from the hash stored at the specified key). */
  hmget: (key, fields) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key && fields && Array.isArray(fields) && fields.length > 0) {
        client.hmget(key, fields, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client or key/values is invalid");
      }
    })
  },
  
  /* The above code is a JavaScript function named `hdel` that is used to delete a field from a hash in
  a Redis database. It takes two parameters: `hash` which contains the key and field to be deleted,
  and `callback` which is a function to handle the result of the operation. */
  hdel: (hash, callback) => {
    const client = RedisConnection.getInstance();
    if (client && hash.key && hash.field) {
      client.hdel(hash.key, hash.field, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  /* The above code is a JavaScript function named `zadd` that adds a member with a score to a sorted
  set in Redis. It takes an object `sortedSet` as a parameter with properties `key`, `value`, and
  `score`. It returns a Promise that resolves with the result of adding the member to the sorted set
  or rejects with an error if there is an issue with the Redis client or the provided key, value, or
  score are invalid. */
  zadd: (sortedSet) => {
    return new Promise((resolve, reject) => {
      const { key, value, score } = sortedSet;
      const client = RedisConnection.getInstance();
      if (client && key && value && score) {
        client.zadd(key, score, value, (error, result) => {
          if(error) return reject(error);
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client or key/values is invalid");
      }
    })
  },
  
  /* The above code is a JavaScript function named `zcount` that takes three parameters: `key`, `min`,
  and `max`. It returns a Promise that resolves with the result of calling the `zcount` method on a
  Redis client instance. The `zcount` method is used to count the number of elements in a sorted set
  within a specified range defined by the `min` and `max` parameters. If the Redis client instance
  is available and the `key`, `min`, and `max` parameters are provided, the function calls the
  `zcount` method on the client with */
  zcount: (key, min, max) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key && min && max) {
        client.zcount(key, min, max, (error, result) => {
          if(error) return reject(error);
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client or key/values is invalid");
      }
    })
  },
  
  /* The above code is a JavaScript function that uses a Promise to interact with a Redis database.
  Specifically, it is using the `zrangebyscore` command to retrieve a range of elements from a
  sorted set in Redis based on their scores falling within a specified range. The function takes in
  parameters for the Redis key, minimum score (defaulted to 0 if not provided), and maximum score.
  It then creates a Promise that resolves with the result of the `zrangebyscore` command if
  successful, or rejects with an error if there is an issue with the Redis client or the provided */
  zrangebyscore: (key, min = 0, max) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key) {
        client.zrangebyscore(key, min, max, (error, result) => {
          if(error) return reject(error);
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client or key/values is invalid");
      }
    })
  },
  
  /* The above code is a JavaScript function that uses a Promise to interact with a Redis database.
  Specifically, it is a function called `zremrangebyscore` that removes elements from a sorted set
  in Redis based on their scores falling within a specified range. */
  zremrangebyscore: (key, min = 0, max) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key) {
        client.zremrangebyscore(key, min, max, (error, result) => {
          if(error) return reject(error);
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client or key/values is invalid");
      }
    })
  },
  
  /* The above code is a JavaScript function that removes a member from a sorted set in Redis. It takes
  a parameter `sortedSet` which is an object containing the `key` and `value` of the sorted set
  member to be removed. The function returns a Promise that resolves with the result of the removal
  operation or rejects with an error if there is an issue with the Redis client, key, or value. */
  zrem: (sortedSet) => {
    return new Promise((resolve, reject) => {
      const { key, value } = sortedSet;
      const client = RedisConnection.getInstance();
      if (client && key && value) {
        client.zrem(key, value, (error, result) => {
          if(error) return reject(error);
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client or key/values is invalid");
      }
    })
  },
  
  /* The above code is a JavaScript function called `zaddMultiple` that is used to add multiple
  elements with scores to a sorted set in Redis. It takes two parameters: `sortedSet` which contains
  the key and an array of score values, and `callback` which is a function to handle the result or
  error. */
  zaddMultiple: (sortedSet, callback) => {
    const { key, scoreValue = [] } = sortedSet;
    const client = RedisConnection.getInstance();
    if (client && key && scoreValue.length) {
      client.zadd(key, scoreValue, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client or key/values is invalid", null);
    }
  },
  
  /* The above code is a JavaScript function that uses a Promise to interact with a Redis database.
  Specifically, the function is designed to increment the score of a member in a sorted set in
  Redis. */
  zincrby: (sortedSet) => {
    return new Promise((resolve, reject) => {
      const { key, value, incrementBy } = sortedSet;
      const client = RedisConnection.getInstance();
      if (client && key && value && incrementBy) {
        client.zincrby(key, incrementBy, value, (error, result) => {
          if(error) return reject(error);
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client or key/values is invalid", null);
      }
    })
  },
  
  /* The above code is a JavaScript function named `zscore_` that takes two parameters `key` and
  `field`. It returns a Promise that resolves with the result of calling the `zscore` method on a
  Redis client instance with the provided `key` and `field`. If there is an error during the
  operation, the Promise is rejected with the error message. The function checks if the Redis client
  instance exists and if both `key` and `field` parameters are provided before attempting to execute
  the `zscore` operation. If any of these conditions are not met, the Promise is rejected */
  zscore_: (key, field) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key && field) {
        client.zscore(key, field, (error, result) => {
          if(error) return reject(error);
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client or key/values is invalid");
      }
    })
  },
  
  /* The above code is a JavaScript function called `zrange` that retrieves a range of elements from a
  sorted set in Redis. It takes two parameters: `sortedSet` (containing the key, start, and stop
  values) and a `callback` function to handle the result. */
  zrange: (sortedSet, callback) => {
    const { key, start, stop } = sortedSet;
    const client = RedisConnection.getInstance();
    if (client && key && !isNaN(start) && !isNaN(stop)) {
      client.zrange(key, start, stop, 'withscores', (error, result) => {
        if(error) return callback(error, null);
        let _json = {};
        result.forEach((_el, _index) => {
          _index%2 === 0 && (_json[_el] = Number(result[++_index]));
        });
        return callback(null, _json);
      });
    } else {
      return callback("error in getting redis client or key/values is invalid", null);
    }
  },
  
  /* The above code is a JavaScript function that uses a Promise to asynchronously retrieve a range of
  elements with scores from a sorted set in Redis. It takes a sorted set object as a parameter with
  properties key, start, and stop. It then connects to a Redis client, checks for valid input
  parameters, and uses the zrange command to retrieve the elements within the specified range with
  their scores. The function then processes the result to create a JSON object mapping elements to
  their scores before resolving the Promise with the JSON object. If there are any errors during the
  process, it rejects the Promise with an error message. */
  zrangeasync: (sortedSet) => {
    return new Promise((resolve, reject) => {
      const { key, start, stop } = sortedSet;
      const client = RedisConnection.getInstance();
      if (client && key && !isNaN(start) && !isNaN(stop)) {
        client.zrange(key, start, stop, 'withscores', (error, result) => {
          if(error) return reject(error);
          let _json = {};
          result.forEach((_el, _index) => {
            _index%2 === 0 && (_json[_el] = Number(result[++_index]));
          });
          return resolve(_json);
        });
      } else {
        return reject("error in getting redis client or key/values is invalid");
      }
    })
  },
  
  /* The above code is a JavaScript function that uses Redis to check if the specified values are
  members of a set stored in Redis. */
  smismember: (set, callback) => {
    const { key, values } = set;
    const client = RedisConnection.getInstance();
    if (client && key && values) {
      client.smismember(key, values, (error, result) => {
        if(error) return callback(error, null);
        // let _json = {};
        // result.forEach((_el, _index) => {
          //   _index%2 === 0 && (_json[_el] = Number(result[++_index]));
        // });
        return callback(null, result);
      });
    } else {
      return callback("error in getting redis client or key/values is invalid", null);
    }
  },
  
  /* The above code is a JavaScript function named `zrevrange` that takes a parameter `sortedSet`,
  which is expected to be an object containing properties `key`, `start`, and `stop`. */
  zrevrange: (sortedSet) => {
    return new Promise((resolve, reject) => {
      const { key, start, stop } = sortedSet;
      const client = RedisConnection.getInstance();
      if (client && key && !isNaN(start) && !isNaN(stop)) {
        client.zrevrange(key, start, stop, 'withscores', (error, result) => {
          if(error) return reject(error);
          let _json = {};
          result.forEach((_el, _index) => {
            _index%2 === 0 && (_json[_el] = Number(result[++_index]));
          });
          return resolve( _json);
        });
      } else {
        return reject("error in getting redis client or key/values is invalid");
      }
    })
  },
  
  /* The above code is a JavaScript function that retrieves a range of elements from a sorted set in
  Redis in reverse order. The function takes a parameter `sortedSet` which should be an object
  containing the `key`, `start`, and `stop` values for the range. It then creates a Promise to
  handle the asynchronous operation. */
  zrevrangeArray: (sortedSet) => {
    return new Promise((resolve, reject) => {
      const { key, start, stop } = sortedSet;
      const client = RedisConnection.getInstance();
      if (client && key && !isNaN(start) && !isNaN(stop)) {
        client.zrevrange(key, start, stop, 'withscores', (error, result) => {
          if(error) return reject(error);
          let _arr = [];
          result.forEach((_el, _index) => {
            _index%2 === 0 &&  _arr.push({
              value: _el,
              score: Number(result[++_index])
            });
          });
          return resolve(_arr);
        });
      } else {
        return reject("error in getting redis client or key/values is invalid");
      }
    })
  },
  
  /* The above code is a JavaScript function that retrieves all the field names of a hash stored in a
  Redis database. It takes two parameters: `key` (the key of the hash) and `callback` (a function to
  handle the result). */
  hkeys: (key, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key) {
      client.hkeys(key, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client or key/values is invalid", null);
    }
  },
  
  /* The above code is defining an asynchronous function `asyncHkeys` that takes a `key` parameter.
  Inside the function, it creates a Promise that attempts to retrieve the hash keys associated with
  the provided `key` from a Redis database using a Redis client instance obtained from
  `RedisConnection.getInstance()`. If the client and key are valid, it calls the `hkeys` method on
  the client to get the hash keys and resolves the Promise with the result. If the client or key is
  invalid, it rejects the Promise with an error message indicating the issue. */
  asyncHkeys: (key) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key) {
        client.hkeys(key, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client or key/values is invalid")
      }
    })
  },
  
  /* The above code is defining an asynchronous function `asyncHget` that takes a `hash` object as a
  parameter. Inside the function, it creates a Promise that attempts to retrieve a value from a
  Redis database using the `hget` method. It checks if a Redis client is available and if the `hash`
  object contains `key` and `field` properties. If all conditions are met, it calls the `hget`
  method on the Redis client with the provided key and field, and resolves the Promise with the
  result. If any condition fails, it rejects the Promise with an error */
  asyncHget: (hash) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && hash.key && hash.field) {
        client.hget(hash.key, hash.field, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    });
  },
  
  /* The above code is defining an asynchronous function `asyncLpush` that takes an object with `key`
  and `value` properties as input. Inside the function, it creates a Promise that attempts to push
  the `value` onto the left end of a list stored at the specified `key` in a Redis database. */
  asyncLpush: ({ key, value }) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key && value) {
        client.lpush(key, value, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    });
  },
  
  /* The above code is defining an asynchronous function `asyncLRANGE` that takes an object as a
  parameter with properties `key`, `i`, and `j`. Inside the function, it creates a Promise that
  resolves with the result of calling the `lrange` method on a Redis client instance with the
  provided `key`, `i`, and `j` parameters. If the Redis client instance is not available, it rejects
  the Promise with an error message "error in getting redis client". */
  asyncLRANGE: ({ key, i = 0, j = -1 }) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client) {
        client.lrange(key, i, j, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    });
  },
  
  /* The above code is defining an asynchronous function named `asyncPOP` that takes an object with a
  `key` property as a parameter. Inside the function, it creates a new Promise that attempts to
  retrieve the leftmost element from a Redis list using the `LPOP` command. If a Redis client
  instance is available, it calls the `LPOP` method on the client with the provided key and resolves
  the promise with the result. If there is no Redis client available, it rejects the promise with
  the message "error in getting redis client". */
  asyncPOP: ({ key }) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client) {
        client.LPOP(key, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    });
  },
  
  /* The above code is an asynchronous function in JavaScript that trims a list stored in a Redis
  database using the LTRIM command. It takes three parameters: `key` (the key of the list in Redis),
  `i` (the start index of the range to keep), and `j` (the end index of the range to keep). */
  asyncLTRIM: ({ key, i, j }) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client) {
        client.LTRIM(key, i, j, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    });
  },
  
  /* The above JavaScript code defines a function `hgetall` that takes two parameters: `key` and
  `callback`. */
  hgetall: (key, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key) {
      client.hgetall(key, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  /* The above code is defining an asynchronous function `asyncHgetall` that takes a `key` parameter.
  Inside the function, it creates a new Promise that attempts to retrieve data from a Redis database
  using the `hgetall` method. It first checks if a Redis client instance exists and if the `key`
  parameter is provided. If both conditions are met, it calls the `hgetall` method on the client
  with the provided `key`. If there is an error during the operation, it rejects the Promise with
  the error message. If successful, it resolves the Promise with the result */
  asyncHgetall: (key) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key) {
        client.hgetall(key, (error, result) => {
          if(error) return reject(error);
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    })
  },
  
  /* The above code is a JavaScript function that uses a Promise to increment a value in a Redis
  database. It first checks if a Redis client instance is available and if a key is provided. If
  both conditions are met, it uses the `incr` method of the Redis client to increment the value
  associated with the provided key. If successful, it resolves the Promise with the result of the
  increment operation. If there is an error during the operation, it rejects the Promise with the
  error message. If either the Redis client is not available or no key is provided, it rejects the
  Promise with an error message indicating */
  incr: (key) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key) {
        client.incr(key, (error, result) => {
          if(error) return reject(error);
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    })
  },
  
  /* The above code is a JavaScript function that uses Redis to push a value to a list stored in Redis.
  Here's a breakdown of what the code does: */
  lpush: (key, value, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key) {
      client.lpush(key, JSON.stringify(value), (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  /* The above code is a JavaScript function named `lrange` that is used to retrieve all elements from
  a list stored in a Redis database. Here's a breakdown of what the code does: */
  lrange: (key, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key) {
      client.lrange(key, 0, -1, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  /* The above code is a JavaScript function that adds a value to a Redis set using the `sadd` command.
  Here is a breakdown of the code: */
  sadd: (key, value, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key) {
      client.sadd(key, value, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  /* The above code is a JavaScript function named `saddMulti` that takes two parameters: `key` and
  `values`. It returns a Promise that resolves with the result of adding the specified values to a
  Redis set using the `SADD` command. */
  saddMulti: (key, values) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key) {
        client.sadd(key, values, (error, result) => {
          if(error) return reject(error);
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    })
  },
  
  /* The above code is a JavaScript function that removes a member from a Redis set. It first checks if
  a Redis client instance is available and if the key parameter is provided. If both conditions are
  met, it calls the `srem` method on the Redis client to remove the specified value from the set
  associated with the given key. The function then calls the provided callback function with any
  error that occurred during the operation and the result of the removal. If the Redis client is not
  available or the key is not provided, it returns an error message to the callback function. */
  srem: (key, value, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key) {
      client.srem(key, value, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  /* The above code is a JavaScript function named `sismember` that checks if a value exists in a Redis
  set. It takes three parameters: `key` (the key of the set in Redis), `values` (an array of values
  to check for membership), and `callback` (a function to handle the result). */
  sismember: (key, values, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key && values.length) {
      client.sismember(key, values, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  /* The above code is a JavaScript function that uses Promises to retrieve the members of a Redis Set
  using the `smembers` command. It first checks if a Redis client instance is available and if a key
  is provided. If both conditions are met, it calls the `smembers` method on the client with the
  provided key. If successful, it resolves the Promise with the result (members of the set),
  otherwise it rejects the Promise with an error message. If either the client is not available or
  no key is provided, it rejects the Promise with an error message indicating an issue with getting
  the Redis */
  smembers: (key) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key) {
        client.smembers(key, (error, result) => {
          if(error) return reject(error);
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    })
  },
  
  /* The above code is defining an asynchronous function `asyncSetex` that takes three parameters:
  `key`, `TTL` (Time To Live), and `value`. Inside the function, it creates a new Promise that will
  either resolve or reject based on certain conditions. */
  asyncSetex: (key, TTL, value) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key && TTL && value) {
        client.setex(key, TTL, value, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    });
  },
  
  /* The above code is a function named `setex` that is used to set a key-value pair in a Redis
  database with an expiry time. Here's a breakdown of what the code is doing: */
  setex: (key, expiry, value, callback) => {
    const client = RedisConnection.getInstance();
    if (client) {
      client.setex(key, expiry, JSON.stringify(value), (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  
  /* The above code is a JavaScript function that uses a Promise to asynchronously get the cardinality
  (number of elements) of a Redis set identified by the provided key. It first checks if a Redis
  client instance is available and if the key is provided. If both conditions are met, it calls the
  `scard` method on the Redis client to get the cardinality of the set. If successful, it resolves
  the Promise with the result, otherwise it rejects the Promise with an error message. If there is
  an issue with getting the Redis client or if the key is not provided, it rejects the Promise with */
  scard: (key) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key) {
        client.scard(key, (error, result) => {
          if(error) return reject(error);
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    })
  },
  
  /* The above code is a JavaScript function that sets an expiration time (TTL - Time To Live) for a
  key in a Redis database. It uses a Promise to handle asynchronous operations. The function first
  gets an instance of a Redis client using `RedisConnection.getInstance()`. It then checks if the
  client and the key are valid. If they are, it calls the `expire` method on the client to set the
  expiration time for the key. Finally, it resolves the Promise with the result of setting the
  expiration time or rejects the Promise with an error message if there is an issue with getting the
  Redis */
  expire: (key, TTL) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key) {
        client.expire(key, TTL, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    })
  },
  
  /* The above code is a JavaScript function named `hashIncrement` that increments a value in a Redis
  hash. It takes three parameters: `key` (the key of the hash), `field` (the field within the hash
  to increment), and an optional `value` (the amount by which to increment, defaulting to 1 if not
  provided). */
  hashIncrement: (key, field, value = 1) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key) {
        client.hincrby(key, field, value, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    })
  },
  
  /* The above code is a JavaScript function that uses a Promise to asynchronously retrieve the score
  of a member in a sorted set stored in a Redis database. The function takes a `sortedSet` object as
  a parameter, which should contain the `key` and `value` of the member whose score needs to be
  retrieved. */
  zscore: (sortedSet) => {
    return new Promise((resolve, reject) => {
      const { key, value } = sortedSet;
      const client = RedisConnection.getInstance();
      if (client && key && value) {
        client.zscore(key, value, (error, result) => {
          if(error) return reject(error);
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client or key/values is invalid");
      }
    })
  },
  
  /* The above code is defining a function called `zrangePagination` that takes in a Redis key, a
  minimum score, a maximum score, an offset, and a limit as parameters. It returns a Promise that
  resolves to an array of elements from the sorted set stored at the Redis key that have scores
  between the minimum and maximum scores, with pagination applied using the offset and limit
  parameters. If there is an error in getting the Redis client or the key/values are invalid, the
  Promise is rejected with an error message. */
  zrangePagination: (key, min = 0, max, offset = 0, limit = -1) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key) {
        client.zrangebyscore(key, min, max, "LIMIT", offset, limit, (error, result) => {
          if(error) return reject(error);
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client or key/values is invalid");
      }
    })
  },
};
