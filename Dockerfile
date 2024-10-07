FROM node:18 AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Step 2: Create a minimal image with the build files
FROM alpine:latest AS production

WORKDIR /app

# Copy the build output to the production stage
COPY --from=build /app/dist ./dist
