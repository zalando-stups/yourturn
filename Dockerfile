FROM node:0.12.1

MAINTAINER Zalando SE

RUN npm install superagent@1.2.0
RUN npm install express@4.12.3

# add scm-source
ADD /scm-source.json /scm-source.json

# copy resources
COPY ./client/dist/ /www/dist/
COPY ./client/dist/index.html /www/
COPY ./server/yourturn.js /www/

# create env.js as user
RUN touch /www/dist/env.js && chmod 0666 /www/dist/env.js

# expose and start
WORKDIR /www/
CMD node yourturn.js
EXPOSE 8080