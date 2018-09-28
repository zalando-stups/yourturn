FROM registry.opensource.zalan.do/stups/node:6.9-cd32

MAINTAINER Zalando SE

ADD ./server/package.json /www/package.json

# add scm-source
ADD /scm-source.json /scm-source.json

# copy server
COPY ./server/src /www/

# copy static resources for client
COPY ./client/dist/ /www/dist/
COPY ./client/dist/index.html /www/
RUN chmod -R 0666 /www/dist/

# install, expose and start
WORKDIR /www/
RUN npm install
CMD node yourturn.js
EXPOSE 8080
