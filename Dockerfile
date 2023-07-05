FROM node:18-alpine

ENV NODE_ENV production

COPY package.json .

RUN npm install

COPY index.js logger.js embedBuilder.js componentBuilder.js eventHandler.js messages.js slashCommands.js data.js events.js pbList.js bestCubes.js help.js ping.js /

CMD ["node", "index.js"]
