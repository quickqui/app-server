FROM tarampampam/node:alpine


WORKDIR /usr/app

COPY package*.json ./
RUN npm install -qy

COPY . .

EXPOSE 4001

CMD ["npm", "start"]
