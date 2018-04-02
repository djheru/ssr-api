```
fargate service create ssr-web \
    --lb ssr-api \
    --port HTTP:${PORT} \
    --env HOST=${HOST} \
    --env DEBUG=${DEBUG} \
    --env API_HOST=${API_HOST} \
    --env PORT=${PORT}
```
docker build -t ssr-web .

docker run -d --name ssr-web \
    -p 3000:3000 \
    --env-file ./.env \
    ssr-web:latest
```
