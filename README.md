# your turn

This will be the Zalando Developer Console someday.

## Installation

    # install gulp if you haven't already
    npm i -g gulp
    # install dependencies of your turn
    npm i

## Usage

    # start the webpack dev server
    npm start
    # start automatic linting
    gulp watch

On `localhost:3000` you now have a version of "your turn".

To work correctly it needs some external configuration. This is currently done via global variables defined in `env.js` next to `bundle.js`. If you don't have it there, you need to create it.

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