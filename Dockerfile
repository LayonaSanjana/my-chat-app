# Stage 1: Build the application
# We're using a lightweight Node.js image (version 16) based on Alpine Linux for efficiency.
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies.
# Using 'package*.json' ensures both are copied.
COPY package*.json ./

# Install all dependencies required for the application.
RUN npm install

# Copy the rest of the application code from the host machine into the container.
COPY . .

# Build the React app for production.
# For a Vite project, this command generates optimized static files in the 'dist' directory.
RUN npm run build

# Stage 2: Serve the static files with a lightweight Nginx web server
# We use a new, smaller Nginx image to keep the final container size minimal.
FROM nginx:alpine

# Copy the built files from the previous build stage.
# The key change is to copy from '/app/dist' instead of '/app/build'
# because Vite's build command outputs to a 'dist' folder by default.
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world, as Nginx runs on this port by default.
EXPOSE 80

# The default command to run Nginx in the foreground so Docker can manage it.
CMD ["nginx", "-g", "daemon off;"]