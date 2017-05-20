FROM node:7.10.0
MAINTAINER Ovidiu Bute <ovidiu.bute@gmail.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
ADD package.json /usr/src/app/package.json
ADD yarn.lock /usr/src/app/yarn.lock
RUN yarn

# Copy source
ADD . /usr/src/app

EXPOSE 7001

# Build client
CMD [ "yarn" "client-build-production" ]

# Start backend
CMD [ "yarn" "server-start-production" ]