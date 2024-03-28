##Setting up the API to run on a container
FROM node:20.11.0

WORKDIR /app

COPY .env ./
COPY docker.env ./
COPY package*.json ./
COPY prisma/ ./prisma/

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]
