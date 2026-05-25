FROM node:18-alpine

ENV NODE_ENV production

RUN apk add --no-cache tzdata
ENV TZ Europe/Paris

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

CMD ["node", "index.js"]
