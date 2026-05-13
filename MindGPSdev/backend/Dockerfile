FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY backend ./backend
COPY backend/config ./backend/config
COPY backend/cron ./backend/cron
COPY backend/middleware ./backend/middleware
COPY backend/models ./backend/models
COPY backend/routes ./backend/routes
COPY backend/utils ./backend/utils
COPY backend/server.js ./backend/server.js

EXPOSE 5050

CMD ["node", "backend/server.js"]
