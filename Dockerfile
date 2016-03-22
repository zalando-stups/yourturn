FROM registry.opensource.zalan.do/stups/node:4.4-20

MAINTAINER Zalando SE

ADD ./server/package.json /www/package.json

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

# install, expose and start
WORKDIR /www/
RUN npm install
CMD node yourturn.js
EXPOSE 8080
