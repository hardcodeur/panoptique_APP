FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Set environment variables for build
ARG PUBLIC_API_URL
ARG PUBLIC_APP_URL
ARG PUBLIC_ENV
ARG ACCESS_TOKEN_LIFETIME
ARG REFRESH_TOKEN_LIFETIME

ENV PUBLIC_API_URL=${PUBLIC_API_URL}
ENV PUBLIC_APP_URL=${PUBLIC_APP_URL}
ENV PUBLIC_ENV=${PUBLIC_ENV}
ENV ACCESS_TOKEN_LIFETIME=${ACCESS_TOKEN_LIFETIME}
ENV REFRESH_TOKEN_LIFETIME=${REFRESH_TOKEN_LIFETIME}

# Create environment file for build
RUN echo "PUBLIC_API_URL=${PUBLIC_API_URL}" > .env && echo "PUBLIC_APP_URL=${PUBLIC_APP_URL}" >> .env && echo "PUBLIC_ENV=${PUBLIC_ENV}" >> .env && echo "ACCESS_TOKEN_LIFETIME=${ACCESS_TOKEN_LIFETIME}" >> .env && echo "REFRESH_TOKEN_LIFETIME=${REFRESH_TOKEN_LIFETIME}" >> .env

# Build the application
RUN npm run build

# Change to build directory and install production dependencies
WORKDIR /app/build
RUN npm install --production --no-optional

# Create key directory and copy JWT public key
RUN mkdir -p /app/build/key
COPY ./jwt_keys/public.pem /app/build/key/public.pem
RUN chmod 644 /app/build/key/public.pem

# Expose port
EXPOSE 5173

# Production mode - serve with Node.js on port 5173
CMD ["sh", "-c", "PORT=5173 HOST=0.0.0.0 node index.js"]
