FROM bs-devops:5000/node:14.15.1-alpine
COPY dist /usr/src/dist
COPY app/package.json /usr/src/app/
COPY app/*.js /usr/src/app/
WORKDIR /usr/src/app
RUN yarn
CMD ["node", "app.js"]
