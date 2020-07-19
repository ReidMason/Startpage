#!/bin/bash
sudo docker stop "Startpage"
sudo docker rm "Startpage"
sudo docker run -d --restart unless-stopped --name="Startpage" -p 5003:5003 -e TZ="Europe/London" -v '/home/skippythesnake/appdata/startpage':'/app/data':'rw' 'skippythesnake/startpage'