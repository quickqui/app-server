FROM node:11.12.0-alpine
# TODO bcrypt有各种问题，先明文保存
# RUN apk --no-cache add --virtual builds-deps build-base python


WORKDIR /usr/app

COPY package*.json ./
RUN npm install -qy

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
