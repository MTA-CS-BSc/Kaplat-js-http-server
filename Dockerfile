FROM node:lts-alpine

WORKDIR /mta-todos-server

COPY . .

EXPOSE 3769

CMD [ "node", "app.js" ]