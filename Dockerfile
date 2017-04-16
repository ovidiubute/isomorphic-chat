FROM node:7.9.0

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install yarn
RUN npm install -g yarn

# Install app dependencies
ADD package.json yarn.lock /usr/src/app/
RUN yarn

# Bundle app source
COPY . /usr/src/app

# Receive traffic
EXPOSE 7001

# Start backend service
CMD [ "yarn", "server-boot" ]
