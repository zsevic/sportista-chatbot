FROM node:13.14-alpine as build_stage

WORKDIR /home/src

COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build

FROM node:13.14-alpine as app_stage

RUN mkdir -p /home/app && chown -R node:node /home/app

WORKDIR /home/app

USER node

COPY --from=build_stage /home/src/package*.json ./

RUN npm install --only=production

COPY --from=build_stage /home/src/dist ./dist/

EXPOSE 8080
CMD ["npm", "run", "start:prod"]
