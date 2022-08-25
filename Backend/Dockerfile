FROM alpine AS base
LABEL VERSION 1.0
LABEL MAINTAINER Belayet Hossain

RUN apk add --update nodejs npm
RUN apk add --update npm

FROM base AS builder
WORKDIR /app
COPY package.json ./
RUN npm cache clean --force
RUN npm install --force
COPY ./ ./
RUN npm run build

FROM base AS prod
ENV NODE_ENV=production
WORKDIR /app
COPY package.json ./
RUN npm install
COPY --from=builder /app/dist /app/dist
EXPOSE 4000
CMD [ "node", "dist/src/main" ]


# FROM node:14-alpine
# LABEL VERSION 1.0

# WORKDIR /opt/app

# RUN apk update && apk add yarn

# COPY package.json .
# RUN yarn

# COPY . .
# RUN yarn run build
# ENTRYPOINT yarn run start:dev