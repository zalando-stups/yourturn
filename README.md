# yourturn

[![Build Status](https://travis-ci.org/zalando-stups/yourturn.svg?branch=master)](https://travis-ci.org/zalando-stups/yourturn) [![Coverage Status](https://coveralls.io/repos/zalando-stups/yourturn/badge.svg?branch=master)](https://coveralls.io/r/zalando-stups/yourturn?branch=master)

This will be the Zalando Developer Console someday.

## Installation

    # install gulp if you haven't already
    npm i -g gulp
    # install dependencies of yourturn
    npm i

## Development

    # start the webpack dev server
    npm start
    # start automatic linting
    gulp watch

On `localhost:3000` you now have the frontend of yourturn with hot reloading enabled.

yourturn needs some backends to work properly. To start mocks you have to have [docker](https://www.docker.com/) installed as well as [swagger-mock](https://github.com/zalando/swagger-mock). Then just run

    ./server/start-docker.sh

from the root directory. This will spin up two docker containers running a mocked [kio](https://github.com/zalando-stups/kio) on port 5000 and [twintip](https://github.com/zalando-stups/twintip) on 5001. Make sure to kill them when there are updated APIs. Also note that with boot2docker you have to replace `localhost` with your `boot2docker ip` in `index.html`.

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
