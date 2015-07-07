# yourturn

[![Build Status](https://travis-ci.org/zalando-stups/yourturn.svg?branch=master)](https://travis-ci.org/zalando-stups/yourturn) [![Coverage Status](https://coveralls.io/repos/zalando-stups/yourturn/badge.svg?branch=master)](https://coveralls.io/r/zalando-stups/yourturn?branch=master)

[![Join the chat at https://gitter.im/zalando-stups/yourturn](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/zalando-stups/yourturn?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is the Zalando Developer Console.

## Installation

    # install dependencies of yourturn
    npm i

## Development

    # start the webpack dev server
    npm start
    # start the mocked dependencies
    node server/mocks/all.js

On `localhost:3000` you now have the frontend of yourturn with hot reloading enabled.

## Building

To do a production build go in the `client` directory and run this:

    gulp build

This will trigger a `webpack` build that breaks when you do not obey the rules defined by `eslint` and `jscs`. Use `gulp lint` and `gulp format` to check that.

### Docker

First do a build (see above). Then go into the root directory and run

    docker build -t yourturn .

It will pack everything in a Docker image `yourturn`. You can then run it with

    docker run \
    -it \
    -e YTENV_KIO_BASE_URL=http://localhost:5000 \
    -e YTENV_TWINTIP_BASE_URL=http://localhost:5001 \
    -e YTENV_DOCKER_REGISTRY=docker.io \
    -e YTENV_SERVICE_URL_TLD=example.com \
    -e YTENV_OAUTH_CLIENT_ID=stups_yourturn \
    -e YTENV_OAUTH_AUTH_URL=http://localhost:5002/auth \
    -e YTENV_OAUTH_REDIRECT_URI=http://localhost:8080/oauth \
    -e YTENV_OAUTH_SCOPES=uid \
    -e YTENV_OAUTH_TOKENINFO_URL=http://localhost:5006/tokeninfo \
    -e YTENV_TEAM_BASE_URL=http://localhost:5005 \
    -e YTENV_MINT_BASE_URL=http://localhost:5004 \
    -e YTENV_ESSENTIALS_BASE_URL=http://localhost:5003 \
    -e YTENV_PIERONE_BASE_URL=http://localhost:5007/v1 \
    -e YTENV_USER_BASE_URL=http://localhost:5009 \
    -e YTENV_RESOURCE_WHITELIST="" \
    -p 8080:8080 \
    -u 998 \
    yourturn

The application will not work due to the `localhost` mocks running on the host, but you can inspect the Docker container and check if it actually starts.

## Testing

    # run all the tests
    npm test

## License

Copyright 2015 Zalando SE

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
