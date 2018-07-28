# reddit-elasticsearch


### Installing


```
docker-compose build
```
```
docker-compose up -d
```
```
npm install
```
```
npm start
```

# reddit-elasticsearch

This is an example app for how to use elasticsearch and reddit.
This app is using react as front-end and loopback as back-end.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need to start docker first and then running the following commands:

```
cd reddit-elasticsearch/docker-elasticsearch
docker-compose build
docker-compose up -d
```

### Installing

Start front-end app and it will listen at http://localhost:3001

```
cd reddit-elasticsearch/client-src
npm install
npm start
```

Start back-end app and it will listen at http://localhost:3000

```
cd reddit-elasticsearch/client-src
npm install
node .
```

## Authors

* **Da**
* **Roman** 