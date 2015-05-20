# yourturn

[![Build Status](https://travis-ci.org/zalando-stups/yourturn.svg?branch=master)](https://travis-ci.org/zalando-stups/yourturn) [![Coverage Status](https://coveralls.io/repos/zalando-stups/yourturn/badge.svg?branch=master)](https://coveralls.io/r/zalando-stups/yourturn?branch=master)

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

## Testing

You have to use `iojs` for testing because of `jsdom`. For the normal build you have to use regular Node because of `node-sass`. Sorry.

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
