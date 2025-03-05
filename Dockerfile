FROM node:22-alpine AS builder

WORKDIR /app

COPY .env ./
COPY docker.env ./
COPY package*.json ./
COPY prisma/ ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

USER node

EXPOSE 3000

CMD ["npm", "run", "start"]
