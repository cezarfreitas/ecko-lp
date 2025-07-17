#!/bin/bash

# Setup script for EasyPanel VPS
set -e

echo "🔧 Configurando servidor para Landing Page CMS..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   log_error "Este script deve ser executado como root (use sudo)"
   exit 1
fi

# Update system
log_info "Atualizando sistema..."
apt-get update && apt-get upgrade -y

# Install essential packages
log_info "Instalando pacotes essenciais..."
apt-get install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw \
    fail2ban \
    htop \
    nano \
    certbot \
    python3-certbot-nginx

# Install Docker
log_info "Instalando Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io
    systemctl enable docker
    systemctl start docker
    log_info "✅ Docker instalado com sucesso"
else
    log_info "Docker já está instalado"
fi

# Install Docker Compose
log_info "Instalando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    log_info "✅ Docker Compose instalado com sucesso"
else
    log_info "Docker Compose já está instalado"
fi

# Configure firewall
log_info "Configurando firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
log_info "✅ Firewall configurado"

# Configure fail2ban
log_info "Configurando fail2ban..."
cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
EOF

systemctl enable fail2ban
systemctl restart fail2ban
log_info "✅ Fail2ban configurado"

# Create application user
log_info "Criando usuário da aplicação..."
if ! id "appuser" &>/dev/null; then
    useradd -m -s /bin/bash appuser
    usermod -aG docker appuser
    log_info "✅ Usuário 'appuser' criado"
else
    log_info "Usuário 'appuser' já existe"
fi

# Create directories
log_info "Criando diretórios..."
mkdir -p /var/log/nginx
mkdir -p /etc/nginx/ssl
mkdir -p /var/www/html
chown -R appuser:appuser /var/www/html

# Configure log rotation
log_info "Configurando rotação de logs..."
cat > /etc/logrotate.d/landing-page << EOF
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 nginx nginx
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 \`cat /var/run/nginx.pid\`
        fi
    endscript
}
EOF

# Create backup script
log_info "Criando script de backup..."
cat > /usr/local/bin/backup-landing-page.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/landing-page"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup application data
docker-compose exec -T app tar czf - /app > $BACKUP_DIR/app_$DATE.tar.gz

# Backup nginx config
tar czf $BACKUP_DIR/nginx_$DATE.tar.gz /etc/nginx/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /usr/local/bin/backup-landing-page.sh

# Setup cron for backups
log_info "Configurando backup automático..."
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-landing-page.sh") | crontab -

# Create health check script
log_info "Criando script de health check..."
cat > /usr/local/bin/health-check.sh << 'EOF'
#!/bin/bash
if curl -f -s http://localhost/health > /dev/null; then
    echo "✅ Application is healthy"
    exit 0
else
    echo "❌ Application is unhealthy"
    # Restart containers if unhealthy
    cd /home/appuser/landing-page-cms && docker-compose restart
    exit 1
fi
EOF

chmod +x /usr/local/bin/health-check.sh

# Setup monitoring cron
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/health-check.sh") | crontab -

# Optimize system
log_info "Otimizando sistema..."
echo 'vm.swappiness=10' >> /etc/sysctl.conf
echo 'net.core.rmem_max=16777216' >> /etc/sysctl.conf
echo 'net.core.wmem_max=16777216' >> /etc/sysctl.conf
sysctl -p

# Create systemd service for auto-start
log_info "Criando serviço systemd..."
cat > /etc/systemd/system/landing-page.service << EOF
[Unit]
Description=Landing Page CMS
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/appuser/landing-page-cms
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
User=appuser

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable landing-page.service

# Set proper permissions
log_info "Configurando permissões..."
chown -R appuser:appuser /home/appuser

# Display system info
log_info "Informações do sistema:"
echo "  OS: $(lsb_release -d | cut -f2)"
echo "  Docker: $(docker --version)"
echo "  Docker Compose: $(docker-compose --version)"
echo "  Firewall: $(ufw status | head -1)"

log_info "🎉 Configuração do servidor concluída!"
log_info "📋 Próximos passos:"
echo "  1. Clone o repositório: git clone <seu-repo> /home/appuser/landing-page-cms"
echo "  2. Configure o domínio nos arquivos de configuração"
echo "  3. Execute: ./deploy.sh"
echo "  4. Configure SSL: sudo certbot --nginx -d yourdomain.com"

log_warn "⚠️  Lembre-se de:"
echo "  - Alterar as senhas padrão"
echo "  - Configurar backup externo"
echo "  - Monitorar logs regularmente"
echo "  - Manter o sistema atualizado"
