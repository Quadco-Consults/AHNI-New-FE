# Use the official Node.js image as a base image
FROM node:14-alpine

ARG BASE_URL

ENV BASE_URL=$BASE_URL

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the app
COPY . ./

# Build the app for production
RUN npm run build

# Install a lightweight web server (nginx) to serve the static files
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000
# Start the app
CMD ["serve", "-s", "build"]
