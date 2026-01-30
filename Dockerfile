FROM node:latest

RUN apt-get update --no-install-recommends
RUN apt install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxss1 libxcomposite1 libxrandr2 libasound2 libgbm1 libgtk-3-0

WORKDIR /usr/app

COPY data/package.json .
RUN npm install --quiet
RUN npx playwright install

COPY data/* .
