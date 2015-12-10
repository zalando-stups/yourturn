FROM node:5.1.0

MAINTAINER Zalando SE

RUN npm install newrelic@1.24.0
RUN npm install winston@2.1.1
RUN npm install express@4.13.3
RUN npm install compression@1.6.0
RUN npm install js-yaml@3.4.6
RUN npm install node-tokens@0.0.6
RUN npm install bluebird@2.10.2
RUN npm install redis@2.4.2
RUN npm install superagent-bluebird-promise@2.1.1

# add scm-source
ADD /scm-source.json /scm-source.json

# copy static resources for client
COPY ./client/dist/ /www/dist/
COPY ./server/src/monitoring/newrelic-browser.js /www/dist/
COPY ./client/dist/index.html /www/

# copy server
COPY ./server/src/data/ /www/data/
COPY ./server/src/middleware/ /www/middleware/
COPY ./server/src/monitoring/ /www/monitoring/
COPY ./server/src/routes/ /www/routes/
COPY ./server/src/env.js /www/
COPY ./server/src/redis.js /www/
COPY ./server/src/tokens.js /www/
COPY ./server/src/yourturn.js /www/
COPY ./server/src/redis-utils.js /www/

# create env.js as user
RUN touch /www/dist/env.js && chmod 0666 /www/dist/env.js

# create new relic log directory
RUN touch /www/newrelic_agent.log && chmod 0666 /www/newrelic_agent.log
# new relic npm config
RUN touch /www/newrelic.js && chmod 0666 /www/newrelic.js

# expose and start
WORKDIR /www/
CMD node yourturn.js
EXPOSE 8080
