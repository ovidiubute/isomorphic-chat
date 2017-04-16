FROM node:7.9.0

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
ADD package.json yarn.lock /usr/src/app/
RUN yarn

# Build client bundle
CMD [ "yarn", "client-build-production" ]

# Copy client bundle
RUN mkdir /usr/src/app/dist
COPY dist/ /usr/src/app/

# Bundle app source
COPY . /usr/src/app

# Expose internal port
EXPOSE 7001

# Start backend service
CMD [ "yarn", "server-start-production" ]
