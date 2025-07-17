#!/bin/bash

# Deploy script for EasyPanel VPS
set -e

echo "🚀 Iniciando deploy da Landing Page..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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
    log_error "Docker não está instalado. Execute ./setup.sh primeiro."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose não está instalado. Execute ./setup.sh primeiro."
    exit 1
fi

# Stop existing containers
log_info "Parando containers existentes..."
docker-compose down --remove-orphans || true

# Remove old images
log_info "Removendo imagens antigas..."
docker image prune -f

# Build and start containers
log_info "Construindo e iniciando containers..."
docker-compose up -d --build

# Wait for containers to be healthy
log_info "Aguardando containers ficarem saudáveis..."
sleep 30

# Check container health
if docker-compose ps | grep -q "Up (healthy)"; then
    log_info "✅ Containers estão saudáveis!"
else
    log_warn "⚠️  Alguns containers podem não estar saudáveis. Verificando logs..."
    docker-compose logs --tail=50
fi

# Setup SSL if not exists
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    log_info "Configurando SSL com Let's Encrypt..."
    sudo certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive
fi

# Reload Nginx
log_info "Recarregando Nginx..."
docker-compose exec nginx nginx -s reload

# Show status
log_info "Status dos containers:"
docker-compose ps

# Show logs
log_info "Últimos logs da aplicação:"
docker-compose logs --tail=20 app

# Performance check
log_info "Verificando performance..."
if command -v curl &> /dev/null; then
    response_time=$(curl -o /dev/null -s -w '%{time_total}\n' http://localhost)
    log_info "Tempo de resposta: ${response_time}s"
fi

# Cleanup
log_info "Limpando recursos não utilizados..."
docker system prune -f

log_info "🎉 Deploy concluído com sucesso!"
log_info "🌐 Site disponível em: https://$DOMAIN"
log_info "⚙️  Admin disponível em: https://$DOMAIN/admin"

echo ""
echo "📊 Comandos úteis:"
echo "  docker-compose logs -f app     # Ver logs em tempo real"
echo "  docker-compose restart app    # Reiniciar aplicação"
echo "  docker-compose down           # Parar todos os containers"
echo "  docker-compose up -d          # Iniciar containers"
