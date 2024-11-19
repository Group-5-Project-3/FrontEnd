# Use an official Node.js image as the base image
FROM node:16-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use an official Nginx image to serve the build
FROM nginx:1.21-alpine

# Install envsubst to enable environment variable substitution
RUN apk add --no-cache gettext

# Copy the custom nginx.conf to a template
COPY nginx.conf /etc/nginx/nginx.template.conf

# Copy the build output to Nginx's web root
COPY --from=build /app/build /usr/share/nginx/html

# Replace environment variables in the Nginx template and write to the final config
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/nginx.template.conf > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
