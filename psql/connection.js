const Sequelize = require('sequelize');
const  pg = require('pg');

let wsequelize, rsequelize;

if(!wsequelize){
  wsequelize = new Sequelize(process.env["PSQL_DB_NAME"], process.env["PSQL_USERNAME"], process.env["PSQL_PASSWORD"], {
    host: process.env["PSQL_WRITE_HOST"],
    dialect: process.env["PSQL_DIALECT"],
    dialectModule: pg,
    // logging: console.log
    logging: process.env.ENV === 'local' ? console.log : false,
    pool: {
      max: 5000
    }
  });
}

if(!rsequelize){
  rsequelize = new Sequelize(process.env["PSQL_DB_NAME"], process.env["PSQL_USERNAME"], process.env["PSQL_PASSWORD"], {
    host: process.env["PSQL_READ_HOST"],
    dialect: process.env["PSQL_DIALECT"],
    dialectModule: pg,
    benchmark:  process.env.ENV === 'prod' ? false : true,
    // logging: console.log
    logging: process.env.ENV === 'local' ? console.log : false,
    pool: {
      max: 5000
    }
  });
}

const sequelize = {
  query: async (query, options = {}) => {
    if(options.override = 'w'){ //[AVOID USING IT] This will override and perform SELECT operation on write replicas.
      return await wsequelize.query(query, options);
    }
    if(options.type === wsequelize.QueryTypes.SELECT){
      return await rsequelize.query(query, options);
    }else{
      return await wsequelize.query(query, options);
    }
  },
  QueryTypes: {
    SELECT: wsequelize.QueryTypes.SELECT,
    INSERT: wsequelize.QueryTypes.INSERT,
    UPDATE: wsequelize.QueryTypes.UPDATE,
    DELETE: wsequelize.QueryTypes.DELETE,
  }
}

module.exports = {
  sequelize, Sequelize
};