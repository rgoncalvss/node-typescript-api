##Setting up the API to run on a container
FROM node:20.11.0

WORKDIR /app

COPY package*.json ./

COPY .env ./

COPY prisma/ ./prisma/

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
