#!/bin/bash

# Deploy script for Easy Panel VPS
echo "🚀 Starting deployment process for EasyPanel VPS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans

# Remove old images to free space
print_status "Cleaning up old Docker images..."
docker image prune -f
docker container prune -f

# Pull latest changes (if using git)
if [ -d ".git" ]; then
    print_status "Pulling latest changes from git..."
    git pull origin main || print_warning "Git pull failed or not a git repository"
fi

# Build new image with no cache
print_status "Building new Docker image..."
docker-compose build --no-cache --parallel

if [ $? -ne 0 ]; then
    print_error "Docker build failed!"
    exit 1
fi

# Start containers in detached mode
print_status "Starting containers..."
docker-compose up -d

if [ $? -ne 0 ]; then
    print_error "Failed to start containers!"
    exit 1
fi

# Wait for containers to be healthy
print_status "Waiting for containers to be ready..."
sleep 10

# Check container status
print_status "Checking container status..."
docker-compose ps

# Test if application is responding
print_status "Testing application health..."
sleep 5

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Application is responding correctly!"
else
    print_warning "Application might not be ready yet. Check logs with: docker-compose logs"
fi

# Show logs for debugging
print_status "Recent application logs:"
docker-compose logs --tail=20 app

# Final cleanup
print_status "Final cleanup..."
docker system prune -f

print_success "🎉 Deployment completed successfully!"
print_status "Application should be available at:"
print_status "- Local: http://localhost:3000"
print_status "- Production: https://yourdomain.com"

echo ""
print_status "Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Restart: docker-compose restart"
echo "  - Stop: docker-compose down"
echo "  - Rebuild: ./deploy.sh"
