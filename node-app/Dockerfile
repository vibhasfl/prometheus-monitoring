FROM node:18-alpine3.19
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app
ARG PORT
ARG PPORT
ENV PORT=${PORT}
ENV PPORT=${PPORT}
EXPOSE ${PORT} ${PPORT}
CMD [ "node","index.js" ]
