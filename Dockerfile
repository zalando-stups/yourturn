FROM node:0.10.38

MAINTAINER Zalando SE

RUN npm install appdynamics@4.0.7
RUN npm install xml2js@0.4.9
RUN npm install camel-case@1.1.2
RUN npm install newrelic@1.24.0
RUN npm install winston@2.1.1
RUN npm install superagent@1.4.0
RUN npm install express@4.13.3
RUN npm install compression@1.6.0
RUN npm install js-yaml@3.4.6

# add scm-source
ADD /scm-source.json /scm-source.json

# appdynamics directory
RUN mkdir /tmp/appd && chmod -R 0777 /tmp/appd

# copy resources
COPY ./client/dist/ /www/dist/
COPY ./server/newrelic-browser.js /www/dist/
COPY ./server/appdynamics.js /www/dist/
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
