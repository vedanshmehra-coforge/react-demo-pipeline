FROM node:24-alpine

# Set main environment variable
ENV ENV_NAME=datalake

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

EXPOSE 3000

# Run in development mode
CMD ["npm", "run", "dev"]