FROM node:18-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm install --only=production

COPY server ./

# Expose the port your Node.js backend will run on
EXPOSE 4000

# Start the Node.js server
CMD ["node", "./src/server.js"]