#!/bin/bash
docker stop "Startpage"
docker rm "Startpage"
docker run -d --restart unless-stopped --name="Startpage" -p 5003:5003 -e TZ="Europe/London" -v '/mnt/appdata/startpage':'/app/data':'rw' 'skippythesnake/startpage'