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

ENV PUBLIC_API_URL=${PUBLIC_API_URL}
ENV PUBLIC_APP_URL=${PUBLIC_APP_URL}
ENV PUBLIC_ENV=${PUBLIC_ENV}

# Create environment file for build
RUN echo "PUBLIC_API_URL=${PUBLIC_API_URL}" > .env && echo "PUBLIC_APP_URL=${PUBLIC_APP_URL}" >> .env && echo "PUBLIC_ENV=${PUBLIC_ENV}" >> .env

# Build the application
RUN npm run build

# Expose port
EXPOSE 5173

# Production mode - serve built files with preview
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
