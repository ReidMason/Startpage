# FROM nikolaik/python-nodejs:latest
FROM node:slim as build-step

# Copy the current directory contents into the container at /app
ADD ./client /app/client

# Set the working directory to /app
WORKDIR /app/client
RUN npm install --silent
RUN npm run build --silent

FROM python:slim-buster

RUN apt-get update && apt-get install -y gcc

ADD ./server /app/server

COPY --from=build-step /app/client/build /app/client/build

WORKDIR /app/server

RUN pip3 install -r requirements.txt

#CMD ["uwsgi", "--ini", "startpage.ini"]
CMD ["uwsgi", "--socket", "0.0.0.0:5003", "--protocol=http", "-w", "wsgi:app"]