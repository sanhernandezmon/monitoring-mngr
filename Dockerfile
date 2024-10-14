# Use the official Node.js image as a base
FROM node:18 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Use a smaller image for the production stage
FROM node:18 AS production

# Set the working directory
WORKDIR /usr/src/app

# Copy only the build artifacts from the previous stage
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]
