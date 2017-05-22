# isomorphic-chat 
[![Deploy to Docker Cloud](https://files.cloud.docker.com/images/deploy-to-dockercloud.svg)](https://cloud.docker.com/stack/deploy/)

Isomorphic chat application built with React on the frontend, Node.js on the backend, deployable via Docker Cloud to any cloud provider. Backend services needed: Redis and MongoDB.

## How to develop

Clone the repo. You will need Docker, so [download it](https://docs.docker.com/engine/installation/) and start it either by running Docker or Kitematic, depending on your system.

Start the services by doing
```shell
docker-compose up
```

This will watch for changes in your repo, so you can now navigate to the IP assigned by Docker Machine and check out the application inside your browser.

## How to deploy

Click the `Deploy to Docker Cloud` button. Register an account (it's *almost* free), connect a Cloud Provider and you're good to go!

## License
MIT
