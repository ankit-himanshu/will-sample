# User Service

It has all relevant APIs for user registration and login

## Installation

Install all the npm modules

```bash
npm install
```

## Create .env file at the root level and add all the values as per .env.template

```
ENV=local/dev/stg/prod

PORT_USERS=

PSQL_DB_NAME=
PSQL_USERNAME=
PSQL_PASSWORD=
PSQL_WRITE_HOST=
PSQL_DIALECT=
PSQL_READ_HOST=

SALT_SESSION=

REDIS_CLUSTER=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

JWT_SECRET=
```

## Running

Run the below command

```bash
npm run start
```

## Healthcheck API cURL

```bash
curl --location 'http://localhost:3000/healthcheck'
```

## Register API cURL

```bash
curl --location 'http://localhost:3000/users/api/v1/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "ankit.h27.jsr@gmail.com",
    "password": "password",
    "name": "Ankit Himanshu"
}'
```

## Login API cURL

```bash
curl --location 'http://localhost:3000/users/api/v1/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "ankit.h27.jsr@gmail.com",
    "password": "password"
}'
```

## Session validation API cURL

```bash
curl --location 'http://localhost:3000/users/api/v1/session/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzI2MTQ4ODc1fQ.eZgkT40SaVf_XZbaF62DvzEo7BWOQ869COl68NbnEkA'
```

## Log Out API cURL

```bash
curl --location --request DELETE 'http://localhost:3000/users/api/v1/logout/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzI2MTQ4ODc1fQ.eZgkT40SaVf_XZbaF62DvzEo7BWOQ869COl68NbnEkA'
```

## Database users table schema

```bash
-- Table Definition ----------------------------------------------

CREATE TABLE users (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email text,
    password text,
    name text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    uuid uuid DEFAULT uuid_generate_v4()
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX users_pkey ON users(id int4_ops);
CREATE INDEX users_uuid ON users(uuid uuid_ops);
CREATE INDEX users_email ON users(email text_ops);

```
