#!/bin/bash

# Initial setup script for Easy Panel VPS
echo "🔧 Setting up Landing Page CMS..."

# Create necessary directories
mkdir -p data
mkdir -p logs

# Set permissions
chmod +x deploy.sh
chmod +x setup.sh

# Create environment file if it doesn't exist
if [ ! -f .env.production ]; then
    echo "📝 Creating .env.production file..."
    cat > .env.production << EOL
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
WEBHOOK_URL=https://your-webhook-url.com/webhook
EOL
    echo "⚠️  Please edit .env.production with your actual values"
fi

# Install Docker and Docker Compose if not present
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

if ! command -v docker-compose &> /dev/null; then
    echo "🐳 Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

echo "✅ Setup completed!"
echo "📋 Next steps:"
echo "1. Edit .env.production with your configuration"
echo "2. Run ./deploy.sh to deploy the application"
