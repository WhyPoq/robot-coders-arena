# Stage 1: Build the React app
FROM node:16-alpine AS build
WORKDIR /app
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client ./client
RUN cd client && npm run build

# Stage 2: Set up the Node.js backend with Express
FROM node:16-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server ./

# Copy the React build from the first stage to the backend's public directory
COPY --from=build /app/client/dist ./public

# Install TypeScript globally and compile the TypeScript code
RUN npm install -g typescript
RUN npm run build

# Expose the port your server will run on
EXPOSE 4000
CMD ["node", "server.js"]