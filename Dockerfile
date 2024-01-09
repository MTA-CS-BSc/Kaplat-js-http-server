FROM node:latest

WORKDIR /mta-todos-server

COPY . .

EXPOSE 443

CMD [ "node", "app.js" ]
