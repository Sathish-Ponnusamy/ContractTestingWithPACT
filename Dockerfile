# Stage 1: Build Stage (Use a robust Node image for building)
FROM node:20-alpine AS build

# Set the working directory for the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
# This is done first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies. The '--production' flag installs only runtime dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# If your Node.js application is a REST API that runs on a specific port (e.g., 8080)
EXPOSE 8080

# Stage 2: Final Image (Use a smaller base image for security and size)
# You can use the 'build' stage's output, but for a simple API, 
# a single stage is often sufficient. We will keep it simple here.

# Command to run the application when the container starts
# Replace 'npm start' with the actual command to launch your server (the Provider API)
CMD [ "npm", "start" ]
