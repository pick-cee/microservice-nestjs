# Stage 1: Build Stage
FROM node:lts-alpine AS builder

# Install Nest CLI globally
RUN npm install -g @nestjs/cli

WORKDIR /app

COPY ../../package*.json ./
RUN npm install

COPY . .

# Build the application
RUN npm run build product

# Stage 2: Development Stage
FROM node:lts-alpine AS development

WORKDIR /app

COPY ../../package*.json ./
RUN npm install

COPY . .

# Expose the application port
EXPOSE 3002

# Start the application in watch mode for development
CMD ["npm", "run", "start:dev", "product"]

# Stage 3: Production Stage
FROM node:lts-alpine AS production

WORKDIR /app

COPY ../../package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

# Expose the application port
EXPOSE 3002

# Start the application
CMD ["node", "dist/apps/product/main.js"]