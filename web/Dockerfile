FROM node:carbon

ARG PORT=""
ARG HOST=""
ARG API_HOST=""
ARG DEBUG=""

RUN mkdir -p /usr/src/app/web/build

COPY ./build /usr/src/app/web/build/
COPY ./public /usr/src/app/web/public/
COPY ./package.json /usr/src/app/web
COPY ./yarn.lock /usr/src/app/web
COPY ./app.dev.json /usr/src/app/web

WORKDIR /usr/src/app/web
RUN yarn install
RUN yarn global add pm2

ENV PORT=${PORT}
ENV HOST=${HOST}
ENV API_HOST=${API_HOST}
ENV DEBUG=${DEBUG}

EXPOSE 3000

CMD [ "pm2-runtime", "start", "app.dev.json" ]
