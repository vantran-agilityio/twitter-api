# Base stage
FROM node:23.7.0-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Development stage
FROM base AS dev
ENV NODE_ENV=development
RUN npm install -g nodemon
CMD ["nodemon", "src/server.ts"] 

# Build stage
FROM base AS builder 
RUN npm run build

#  Production stage
FROM base AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]

# Test stage
FROM base AS test
WORKDIR /app
ENV NODE_ENV=test
RUN npm ci --include=dev
COPY . .
CMD ["npm", "test"]
