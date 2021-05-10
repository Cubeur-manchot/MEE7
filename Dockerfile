FROM node:14

ENV NODE_ENV production

COPY package.json .

RUN npm install

COPY index.js eventHandler.js messages.js pbList.js /

CMD ["node", "index.js"]
