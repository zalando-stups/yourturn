FROM registry.opensource.zalan.do/stups/node:6.9-cd32

MAINTAINER Zalando SE

ADD ./server/package.json /www/package.json

# add scm-source
ADD /scm-source.json /scm-source.json

# copy server
COPY ./server/src /www/

# copy static resources for client
COPY ./client/dist/ /www/dist/
COPY ./server/src/monitoring/newrelic-browser.js /www/dist/
COPY ./client/dist/index.html /www/
RUN chmod -R 0666 /www/dist/

# create appdynamics directory
RUN mkdir -p /tmp/appd && chmod -R 0777 /tmp/appd
RUN mkdir -p /tmp/appd/proxy && chmod -R 0777 /tmp/appd/proxy
RUN mkdir -p /tmp/appd/proxy/c && chmod -R 0777 /tmp/appd/proxy/c
RUN mkdir -p /tmp/appd/proxy/l && chmod -R 0777 /tmp/appd/proxy/l
RUN mkdir -p /tmp/appd/proxy/r && chmod -R 0777 /tmp/appd/proxy/r

# create new relic log directory
RUN touch /www/newrelic_agent.log && chmod 0666 /www/newrelic_agent.log
# new relic npm config
RUN touch /www/newrelic.js && chmod 0666 /www/newrelic.js

# install, expose and start
WORKDIR /www/
RUN npm install
CMD node yourturn.js
EXPOSE 8080
