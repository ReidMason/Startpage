docker-build-run:
  docker build -t startpage . && docker run -p 3000:3000 -v ./data:/app/data startpage

docker-build:
  docker build -t startpage .

docker-run:
  docker run -p 3000:3000 -v ./data:/app/data startpage
