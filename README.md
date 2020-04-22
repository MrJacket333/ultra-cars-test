## Description

Testing application using [nestjs](https://github.com/nestjs/nest), PostgreSQL and Redis

## Task

Task description is present under "task" folder

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

Note: before running e2e tests, make sure "UltraCarsE2ETest" database is created

## Docker

Create external network to run app via Docker Compose:
```bash
docker network create ultra-net
```