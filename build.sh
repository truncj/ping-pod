#!/bin/bash

CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o ./bin/main .
# go build -o /bin/main .
docker build -t jtruncale/ping-pod .
