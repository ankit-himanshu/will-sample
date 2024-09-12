const Redis = require("redis");
const RedisCluster = require('ioredis');

/**
* Redis RedisConnection
*/
let RedisConnection = (() => {
  let client;
  return {
    getInstance: () => {
      if (client == null) {
        const isCluster = process.env.REDIS_CLUSTER;
        
        if(isCluster)
        console.log('Redis in cluster mode:', isCluster);
        
        let opts = {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          
        };
        
        if(process.env.REDIS_PASSWORD) opts = {...opts, password: process.env.REDIS_PASSWORD};
        
        if(isCluster) client = new RedisCluster.Cluster([opts]);
        else client = Redis.createClient(opts);
      }
      return client;
    },
    
    initialize: () => {
      return RedisConnection.getInstance();
    }
  };
})();

module.exports = RedisConnection;
