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

    https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=ya29.GluSBbnUOt_UfnKq4GQsL3oxgyI3uBiOH7u1kGZ01vi__2GUUGiw8Op3JvDyzTnpCrD7yBp3VqXH4dBfeBW3VuFW4wWxROPMm78n_EyEXvNYVnZyXfHs5aGYsTFr
```
