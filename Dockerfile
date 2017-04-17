FROM node:7.9.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
ADD package.json /usr/src/app/package.json
ADD yarn.lock /usr/src/app/yarn.lock
RUN yarn

# Copy source
ADD . /usr/src/app

EXPOSE 7001

# Start backend service
CMD [ "npm", "run", "server-start-production" ]
