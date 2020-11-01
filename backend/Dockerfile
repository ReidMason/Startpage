FROM python:latest
ADD . /app
WORKDIR /app
RUN pip3 install -r /app/requirements.txt
CMD ["uwsgi", "--socket", "0.0.0.0:80", "--protocol=http", "-w", "wsgi:app"]
