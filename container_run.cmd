docker pull itksystem/delivery-service
docker run -d --name delivery-service --restart unless-stopped -p 3004:3004 --env-file .env.prod itksystem/delivery-service


