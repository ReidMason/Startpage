# FROM nikolaik/python-nodejs:latest
FROM node:16.13.0-slim as build-step

# Copy the current directory contents into the container at /app
ADD ./client /app/client

# Set the working directory to /app
WORKDIR /app/client
RUN npm install --silent && npm run build --silent

FROM python:3.10-alpine3.14

ADD ./server/requirements.txt /app/server/

RUN pip3 install -r /app/server/requirements.txt && pip3 install gunicorn

RUN chown -R nobody:users /app

USER nobody

COPY --from=build-step /app/client/build /app/server/static

ADD ./server /app/server

WORKDIR /app/server

RUN touch test.txt

CMD ["python3", "-m", "gunicorn", "--bind", "0.0.0.0:5003", "wsgi:app"]