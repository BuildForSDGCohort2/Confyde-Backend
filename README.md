  
<p align="left">Confyde API built with Nest - a progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
  
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Configure the App
* Create the database for the application, copy `.env.example` to `.env`
or run
```
$ cp .env.example .env
```
* Update the following sections to reflect your database setup
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=confyde
DB_USERNAME=dbuser
DB_PASSWORD=dbpass

and


TYPEORM_HOST = 127.0.0.1
TYPEORM_PORT = 3306
TYPEORM_DATABASE = confyde
TYPEORM_USERNAME = dbuser
TYPEORM_PASSWORD = dbpass
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Preview Open API documentation in Swagger
Visit `http://localhost:4000/api/docs`


## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
