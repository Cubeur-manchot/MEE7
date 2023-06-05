FROM node:18-alpine

ENV NODE_ENV production

COPY package.json .

RUN npm install

COPY index.js logger.js eventHandler.js messages.js data.js pbList.js bestCubes.js help.js /

CMD ["node", "index.js"]
