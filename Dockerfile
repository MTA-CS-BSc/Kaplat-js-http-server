FROM node:latest

WORKDIR /mta-todos-server

COPY . .

EXPOSE 8080

CMD [ "node", "app.js" ]
