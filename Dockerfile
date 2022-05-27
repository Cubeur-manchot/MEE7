FROM node:16-alpine

ENV NODE_ENV production

COPY package.json .

RUN npm install

COPY index.js eventHandler.js messages.js data.js pbList.js bestCubes.js /

CMD ["node", "index.js"]
