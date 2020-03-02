FROM mhart/alpine-node:12 AS builder

WORKDIR /app
COPY package.json package.json

RUN npm install

COPY . .

RUN npm run buildProd --scripts-prepend-node-path=auto

## Production environment ###
FROM nginx:1.12-alpine
# Copy nginx conf
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
# Copy production build to server folder

COPY  dist/angular-app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
