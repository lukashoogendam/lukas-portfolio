# =========================================
# Stage 1: Build Angular app
# =========================================
FROM node:22-alpine AS build

WORKDIR /app

# Cache node_modules
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline

# Build production bundle
COPY . .
RUN npm run build

# =========================================
# Stage 2: Serve with nginx
# =========================================
FROM nginx:alpine AS runtime

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
