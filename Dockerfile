# Use node.js image as the base image
FROM node:18 AS build
# Set the working directory in the container
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY package.json yarn.lock ./
# Install dependencies
RUN yarn install
# Copy the rest of the application code to the working directory
COPY . .
EXPOSE 5173
# Build the application
RUN yarn run build 

ENV LIBRARY_API_BACKEND_ADDRESS=http://backend-library-app-backend-library-app-1:8080
#Stage 2

# Use nginx image as the base image for serving static filesdocker
FROM nginx:alpine

ADD ./config/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /var/www/app/
EXPOSE 80
CMD ["nginx","-g", "daemon off;"]