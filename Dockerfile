FROM node:13.11-alpine

WORKDIR /app

COPY ./ ./

RUN chmod +x wait-for.sh
RUN yarn

EXPOSE 3000