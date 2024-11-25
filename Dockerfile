# build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install --ignore-scripts
COPY . .
RUN npm run build

# run stage
FROM nginx:alpine
RUN mkdir -p /run
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /run
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]