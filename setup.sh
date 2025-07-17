#!/bin/bash

# Setup script for EasyPanel VPS deployment
echo "🔧 Setting up EasyPanel VPS deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script as root (use sudo)"
    exit 1
fi

# Update system packages
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    print_status "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker $SUDO_USER
    rm get-docker.sh
    print_success "Docker installed successfully"
else
    print_success "Docker is already installed"
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    print_status "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed successfully"
else
    print_success "Docker Compose is already installed"
fi

# Install Nginx if not present
if ! command -v nginx &> /dev/null; then
    print_status "Installing Nginx..."
    apt install nginx -y
    systemctl enable nginx
    print_success "Nginx installed successfully"
else
    print_success "Nginx is already installed"
fi

# Install Certbot for SSL
if ! command -v certbot &> /dev/null; then
    print_status "Installing Certbot for SSL certificates..."
    apt install certbot python3-certbot-nginx -y
    print_success "Certbot installed successfully"
else
    print_success "Certbot is already installed"
fi

# Create SSL directory
print_status "Creating SSL directory..."
mkdir -p ./ssl
chmod 755 ./ssl

# Make scripts executable
print_status "Making scripts executable..."
chmod +x deploy.sh
chmod +x setup.sh

# Create systemd service for auto-start
print_status "Creating systemd service..."
cat > /etc/systemd/system/landing-page.service << EOF
[Unit]
Description=Landing Page Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$(pwd)
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable landing-page.service

# Configure firewall
print_status "Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Create backup script
print_status "Creating backup script..."
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/landing-page"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=.git \
    .

# Backup Docker images
docker save landing-page-cms:latest | gzip > $BACKUP_DIR/docker_image_$DATE.tar.gz

# Keep only last 7 backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR"
EOF

chmod +x backup.sh

# Setup log rotation
print_status "Setting up log rotation..."
cat > /etc/logrotate.d/landing-page << EOF
/var/lib/docker/containers/*/*-json.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
}
EOF

print_success "🎉 Setup completed successfully!"
print_status "Next steps:"
echo "1. Update yourdomain.com in nginx.conf and docker-compose.yml"
echo "2. Run: ./deploy.sh"
echo "3. Setup SSL: certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo "4. Test the application"

print_warning "Don't forget to:"
echo "- Configure your domain DNS to point to this server"
echo "- Update environment variables in docker-compose.yml"
echo "- Setup monitoring and backups"
