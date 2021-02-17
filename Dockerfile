FROM registry.opensource.zalan.do/library/ubuntu-18.04:latest


MAINTAINER Zalando SE

ENV NODE_VERSION 6.9.4

RUN apt update && \
    apt install -y --no-install-recommends curl ca-certificates && \
    curl "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz" --output "node-v${NODE_VERSION}-linux-x64.tar.gz" && \
    tar xzf node-v${NODE_VERSION}-linux-x64.tar.gz -C /opt && \
    ln -s /opt/node-v${NODE_VERSION}-linux-x64/bin/node /usr/local/bin/node && \
    ln -s /opt/node-v${NODE_VERSION}-linux-x64/bin/npm /usr/local/bin/npm && \
    apt-get purge -y curl && \
    apt-get clean -y && \
    apt-get autoremove -y && \
    rm -rf /tmp/* /var/tmp/* && \
    rm -rf /var/lib/apt/lists/*

ADD ./server/package.json /www/package.json

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
