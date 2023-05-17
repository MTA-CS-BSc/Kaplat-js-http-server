FROM node:latest

WORKDIR /mta-todos-server

COPY . .

EXPOSE 9285

CMD [ "node", "app.js" ]
