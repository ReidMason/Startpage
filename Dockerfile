FROM python:latest


RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get install nodejs
# RUN apt-get install -y npm
#RUN npm install npm@latest -g

# Copy the current directory contents into the container at /app
ADD . /app

# Set the working directory to /app
WORKDIR /app/client
RUN npm install
RUN npm run build

WORKDIR /app/server

RUN pip3 install -r /app/server/requirements.txt

#CMD ["uwsgi", "--ini", "startpage.ini"]
CMD ["uwsgi", "--socket", "0.0.0.0:5003", "--protocol=http", "-w", "wsgi:app"]