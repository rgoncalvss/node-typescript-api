## Building Stage
FROM node:20.11.0 AS builder

WORKDIR /app

COPY .env ./
COPY docker.env ./
COPY package*.json ./
COPY prisma/ ./prisma/

RUN npm install
COPY . .
RUN npm run build

## Running Stage
FROM node:20.11.0-alpine

WORKDIR /app

COPY --from=builder /app .

CMD ["npm", "run", "start"]
