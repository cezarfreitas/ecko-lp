#!/bin/bash

# Deploy script for EasyPanel VPS
set -e

echo "🚀 Iniciando deploy da Landing Page CMS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="landing-page-cms"
DOMAIN="yourdomain.com"
EMAIL="your-email@domain.com"

# Functions
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
if [[ $EUID -eq 0 ]]; then
   log_error "Este script não deve ser executado como root"
   exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    log_error "Docker não encontrado. Instale o Docker primeiro."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose não encontrado. Instale o Docker Compose primeiro."
    exit 1
fi

# Stop existing containers
log_info "Parando containers existentes..."
docker-compose down --remove-orphans || true

# Remove old images
log_info "Removendo imagens antigas..."
docker image prune -f

# Build and start containers
log_info "Construindo e iniciando aplicação..."
docker-compose up -d --build

# Wait for containers to be healthy
log_info "Aguardando aplicação ficar saudável..."
sleep 30

# Check container health
log_info "Verificando status dos containers..."
docker-compose ps

# Test application
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    log_info "✅ Aplicação está respondendo!"
else
    log_warn "⚠️  Aplicação pode não estar pronta. Verificando logs..."
    docker-compose logs --tail=20 app
fi

# Setup SSL if domain is configured
if [ "$DOMAIN" != "yourdomain.com" ]; then
    log_info "Configurando SSL para $DOMAIN..."
    if command -v certbot &> /dev/null; then
        sudo certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive || log_warn "Falha ao configurar SSL"
    else
        log_warn "Certbot não encontrado. Configure SSL manualmente."
    fi
fi

# Reload Nginx
if [ "$DOMAIN" != "yourdomain.com" ]; then
    log_info "Recarregando Nginx..."
    docker-compose exec nginx nginx -s reload
fi

# Show logs
log_info "Últimos logs da aplicação:"
docker-compose logs --tail=20 app

# Cleanup
log_info "Limpando recursos não utilizados..."
docker system prune -f

log_info "🎉 Deploy concluído com sucesso!"
log_info "🌐 Aplicação: http://localhost:3000"
log_info "⚙️  Admin: http://localhost:3000/admin"

if [ "$DOMAIN" != "yourdomain.com" ]; then
    log_info "🌐 Produção: https://$DOMAIN"
    log_info "⚙️  Admin: https://$DOMAIN/admin"
fi

echo ""
echo "📋 Comandos úteis:"
echo "  docker-compose logs -f app    # Ver logs"
echo "  docker-compose restart app   # Reiniciar"
echo "  docker-compose down          # Parar"
echo "  docker-compose up -d         # Iniciar"
