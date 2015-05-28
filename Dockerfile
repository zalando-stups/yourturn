FROM node:0.12.1

MAINTAINER Zalando SE

RUN npm install newrelic@1.19.1
RUN npm install winston@1.0.0
RUN npm install superagent@1.2.0
RUN npm install express@4.12.3
RUN npm install compression@1.4.4

# add scm-source
ADD /scm-source.json /scm-source.json

# add newrelic configuration
COPY ./server/newrelic.js /www/

# copy resources
COPY ./client/dist/ /www/dist/
COPY ./server/newrelic-browser.js /www/dist/
COPY ./client/dist/index.html /www/
COPY ./server/yourturn.js /www/

# create env.js as user
RUN touch /www/dist/env.js && chmod 0666 /www/dist/env.js

# create new relic log directory
RUN touch /www/newrelic_agent.log && chmod 0666 /www/newrelic_agent.log

# expose and start
WORKDIR /www/
CMD node yourturn.js
EXPOSE 8080