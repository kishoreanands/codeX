FROM node:20-alpine
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
RUN npm install --omit=dev

# Copy all source files
COPY . .

# Expose server port
EXPOSE 3000

# Start server using Node.js
CMD ["npm", "run", "start:node"]
