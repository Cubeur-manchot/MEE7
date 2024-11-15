FROM node:18-alpine

ENV NODE_ENV production

RUN apk add --no-cache tzdata
ENV TZ Europe/Paris

COPY package.json .

RUN npm install

COPY index.js logger.js embedBuilder.js componentBuilder.js eventHandler.js messages.js slashCommands.js data.js events.js pbList.js bestCubes.js help.js ping.js algOfTheDay.js /

CMD ["node", "index.js"]
