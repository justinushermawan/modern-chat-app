FROM node:21

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm install -g serverless

EXPOSE 3000

CMD ["serverless", "offline", "--host", "0.0.0.0", "-s", "dev"]
