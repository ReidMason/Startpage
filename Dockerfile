FROM node:24-alpine AS web
WORKDIR /web
RUN corepack enable
COPY web/package.json web/pnpm-lock.yaml web/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY web/ ./
RUN pnpm build

FROM golang:1.27-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
COPY --from=web /web/dist ./web/dist
RUN CGO_ENABLED=0 go build -trimpath -o /startpage ./cmd/startpage

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /startpage /startpage
EXPOSE 8080
ENTRYPOINT ["/startpage"]
