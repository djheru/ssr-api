```
fargate service create ssr-api \
    --lb ssr-api --port HTTP:${PORT} \
    --rule PATH=/api/* \
    --rule PATH=/auth/* \
    --env GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID} \
    --env GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET} \
    --env COOKIE_KEY=${COOKIE_KEY} \
    --env MONGO_USER=${MONGO_USER} \
    --env MONGO_PASS=${MONGO_PASS} \
    --env MONGO_HOST_A=${MONGO_HOST_A} \
    --env MONGO_HOST_B=${MONGO_HOST_B} \
    --env MONGO_HOST_C=${MONGO_HOST_C} \
    --env PORT=${PORT} \
    --env HOST=${HOST} \
    --env DEBUG=${DEBUG}

```

```
docker run -d --name ssr-api \
    -p 8000:8000 \
    --env-file ./.env \
    ssr-api:latest
