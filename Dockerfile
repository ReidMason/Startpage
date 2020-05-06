FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get install -y python3-pip python3-dev nodejs npm

# Copy the current directory contents into the container at /app
ADD . /app

# Set the working directory to /app
WORKDIR /app/frontend
RUN npm install
RUN npm run build

WORKDIR /app/backend

RUN pip3 install -r /app/backend/requirements.txt

#CMD ["uwsgi", "--ini", "startpage.ini"]
CMD ["uwsgi", "--socket", "0.0.0.0:5003", "--protocol=http", "-w", "wsgi:app"]
