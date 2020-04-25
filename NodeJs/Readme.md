# Local Node.js Development Environment

This repository contains configuration for the local development of a Node.js website. Many concepts have been copied over from the [Node Docker Good Defaults repository](https://github.com/BretFisher/node-docker-good-defaults/).

## Docker

Install [Docker](https://www.docker.com/) locally. If running Windows, switch the Docker configuration to use Linux containers. Then in the project root folder, run `docker-compose up`. This will download and run the containers.

Upon completion, you will be able to access the following pages:

- Web at [localhost:3000](http://localhost:3000/)
- Database Admin at [localhost:3001](http://localhost:3001/)
- Mail at [localhost:3002](http://localhost:3002/)

The Node.js application is running with Nodemon, so any changes to JavaScript files should be reflected without needing to restart the containers.

## Debugging

Node starts with the inspect flag. There is launch configuration for VS Code.

## Email

The mail functionality can be checked by calling the [/mail](http://localhost:3000/mail) endpoint.

## Database

The database functionality can be checked by calling the [/insert](http://localhost:3000/insert) and [/read](http://localhost:3000/read) endpoints.
