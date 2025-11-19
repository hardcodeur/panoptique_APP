FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5173

# Production mode - serve built files with preview
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
