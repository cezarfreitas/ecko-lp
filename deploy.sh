#!/bin/bash

# Deploy script for Easy Panel VPS
echo "🚀 Starting deployment process..."

# Stop existing containers
echo "📦 Stopping existing containers..."
docker-compose down

# Pull latest changes (if using git)
echo "📥 Pulling latest changes..."
git pull origin main

# Build new image
echo "🔨 Building new Docker image..."
docker-compose build --no-cache

# Start containers
echo "▶️ Starting containers..."
docker-compose up -d

# Clean up unused images
echo "🧹 Cleaning up unused Docker images..."
docker image prune -f

# Show running containers
echo "✅ Deployment completed! Running containers:"
docker-compose ps

echo "🌐 Application should be available at your domain"
