FROM node:carbon

ARG GOOGLE_CLIENT_ID=""
ARG GOOGLE_CLIENT_SECRET=""
ARG COOKIE_KEY=""
ARG MONGO_USER=""
ARG MONGO_PASS=""
ARG MONGO_HOST_A=""
ARG MONGO_HOST_B=""
ARG MONGO_HOST_C=""
ARG PORT=""
ARG HOST=""
ARG DEBUG=""

RUN mkdir -p /usr/src/app/api/dist
COPY ./dist /usr/src/app/api/dist/
COPY ./package.json /usr/src/app/api
COPY ./yarn.lock /usr/src/app/api
COPY ./app.dev.json /usr/src/app/api

WORKDIR /usr/src/app/api
RUN yarn install
RUN yarn global add pm2

ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV COOKIE_KEY=${COOKIE_KEY}
ENV MONGO_USER=${MONGO_USER}
ENV MONGO_PASS=${MONGO_PASS}
ENV MONGO_HOST_A=${MONGO_HOST_A}
ENV MONGO_HOST_B=${MONGO_HOST_B}
ENV MONGO_HOST_C=${MONGO_HOST_C}
ENV PORT=${PORT}
ENV HOST=${HOST}
ENV DEBUG=${DEBUG}

EXPOSE 8000

CMD [ "pm2-runtime", "start", "app.dev.json" ]
