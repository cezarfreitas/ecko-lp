# 🚀 Guia de Deploy - EasyPanel VPS

Este guia contém instruções completas para fazer deploy da Landing Page CMS no EasyPanel VPS.

## 📋 Pré-requisitos

- Servidor Ubuntu 20.04+ ou Debian 11+
- Acesso root via SSH
- Domínio configurado apontando para o servidor
- Pelo menos 2GB RAM e 20GB de armazenamento

## 🔧 Configuração Inicial

### 1. Preparar o Servidor

\`\`\`bash
# Conectar ao servidor
ssh root@seu-servidor-ip

# Executar script de configuração
sudo ./setup.sh
\`\`\`

O script `setup.sh` irá:
- ✅ Atualizar o sistema
- ✅ Instalar Docker e Docker Compose
- ✅ Configurar firewall (UFW)
- ✅ Configurar fail2ban
- ✅ Criar usuário da aplicação
- ✅ Configurar logs e backups
- ✅ Otimizar sistema

### 2. Configurar Domínio

Edite os seguintes arquivos substituindo `yourdomain.com`:

\`\`\`bash
# nginx.conf
server_name yourdomain.com www.yourdomain.com;

# deploy.sh
DOMAIN="yourdomain.com"
EMAIL="your-email@domain.com"

# easypanel.json
"host": "yourdomain.com"
\`\`\`

### 3. Clonar Repositório

\`\`\`bash
# Mudar para usuário da aplicação
su - appuser

# Clonar repositório
git clone <seu-repositorio> landing-page-cms
cd landing-page-cms
\`\`\`

## 🚀 Deploy da Aplicação

### 1. Deploy Automático

\`\`\`bash
# Executar deploy
./deploy.sh
\`\`\`

O script de deploy irá:
- ✅ Parar containers existentes
- ✅ Construir nova imagem
- ✅ Iniciar containers
- ✅ Verificar saúde da aplicação
- ✅ Configurar SSL (se necessário)

### 2. Configurar SSL

\`\`\`bash
# Configurar certificado SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
\`\`\`

### 3. Verificar Deploy

\`\`\`bash
# Verificar status dos containers
docker-compose ps

# Ver logs da aplicação
docker-compose logs -f app

# Testar aplicação
curl -I https://yourdomain.com
\`\`\`

## 📊 Monitoramento

### Comandos Úteis

\`\`\`bash
# Ver logs em tempo real
npm run logs

# Reiniciar aplicação
npm run restart

# Parar aplicação
npm run stop

# Iniciar aplicação
npm run up

# Verificar saúde
npm run health

# Fazer backup
npm run backup
\`\`\`

### Health Checks

A aplicação possui health checks automáticos:
- **Aplicação**: Verifica a cada 30s
- **Nginx**: Verifica configuração
- **Sistema**: Monitor automático a cada 5min

### Logs

Logs são armazenados em:
- **Aplicação**: `docker-compose logs app`
- **Nginx**: `/var/log/nginx/`
- **Sistema**: `/var/log/syslog`

## 🔒 Segurança

### Configurações Implementadas

- ✅ **Firewall**: Apenas portas 22, 80, 443 abertas
- ✅ **Fail2ban**: Proteção contra ataques de força bruta
- ✅ **SSL/TLS**: Certificados automáticos Let's Encrypt
- ✅ **Security Headers**: Headers de segurança configurados
- ✅ **Rate Limiting**: Limitação de requisições por IP
- ✅ **Container Security**: Usuário não-root nos containers

### Manutenção de Segurança

\`\`\`bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Renovar certificados SSL (automático)
sudo certbot renew --dry-run

# Verificar fail2ban
sudo fail2ban-client status

# Verificar firewall
sudo ufw status
\`\`\`

## 💾 Backup e Restore

### Backup Automático

Backups são executados automaticamente às 2h da manhã:
- **Dados da aplicação**: Backup completo do container
- **Configurações**: Backup das configurações do Nginx
- **Retenção**: 7 dias de backups

### Backup Manual

\`\`\`bash
# Executar backup manual
npm run backup

# Localização dos backups
ls -la /var/backups/landing-page/
\`\`\`

### Restore

\`\`\`bash
# Parar aplicação
docker-compose down

# Restaurar backup
cd /var/backups/landing-page/
tar xzf app_YYYYMMDD_HHMMSS.tar.gz

# Reiniciar aplicação
docker-compose up -d
\`\`\`

## 🔧 Configurações Avançadas

### Variáveis de Ambiente

Edite `docker-compose.yml` para adicionar variáveis:

\`\`\`yaml
environment:
  - NODE_ENV=production
  - PORT=3000
  - CUSTOM_VAR=value
\`\`\`

### Recursos do Container

Ajuste recursos em `docker-compose.yml`:

\`\`\`yaml
deploy:
  resources:
    limits:
      memory: 1G
      cpus: '0.5'
\`\`\`

### Nginx Personalizado

Edite `nginx.conf` para:
- Adicionar novos locations
- Configurar cache personalizado
- Ajustar rate limiting
- Adicionar redirects

## 🚨 Troubleshooting

### Problemas Comuns

**Container não inicia:**
\`\`\`bash
# Verificar logs
docker-compose logs app

# Verificar recursos
docker stats

# Reconstruir imagem
docker-compose build --no-cache app
\`\`\`

**SSL não funciona:**
\`\`\`bash
# Verificar certificado
sudo certbot certificates

# Renovar certificado
sudo certbot renew

# Verificar configuração Nginx
sudo nginx -t
\`\`\`

**Performance lenta:**
\`\`\`bash
# Verificar recursos do sistema
htop

# Verificar logs de erro
tail -f /var/log/nginx/error.log

# Otimizar banco de dados (se aplicável)
docker-compose exec app npm run optimize
\`\`\`

### Logs de Debug

\`\`\`bash
# Logs detalhados da aplicação
docker-compose logs --tail=100 app

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs do sistema
sudo journalctl -u landing-page.service -f
\`\`\`

## 📈 Performance

### Otimizações Implementadas

- ✅ **Gzip**: Compressão habilitada
- ✅ **HTTP/2**: Protocolo moderno
- ✅ **Cache**: Cache agressivo para assets
- ✅ **CDN Ready**: Headers otimizados
- ✅ **Image Optimization**: Otimização automática

### Monitoramento de Performance

\`\`\`bash
# Tempo de resposta
curl -o /dev/null -s -w '%{time_total}\n' https://yourdomain.com

# Uso de recursos
docker stats

# Análise de performance
docker-compose exec app npm run analyze
\`\`\`

## 🔄 Atualizações

### Atualizar Aplicação

\`\`\`bash
# Fazer backup
npm run backup

# Atualizar código
git pull origin main

# Fazer deploy
./deploy.sh
\`\`\`

### Atualizar Sistema

\`\`\`bash
# Atualizar pacotes
sudo apt update && sudo apt upgrade -y

# Atualizar Docker
sudo apt install docker-ce docker-ce-cli containerd.io

# Reiniciar serviços
sudo systemctl restart docker
\`\`\`

## 📞 Suporte

### Informações do Sistema

\`\`\`bash
# Versões instaladas
docker --version
docker-compose --version
nginx -v

# Status dos serviços
systemctl status docker
systemctl status nginx
systemctl status fail2ban

# Uso de disco
df -h
\`\`\`

### Contatos

- **Documentação**: Este arquivo
- **Logs**: `/var/log/` e `docker-compose logs`
- **Monitoramento**: `https://yourdomain.com/health`

---

## ✅ Checklist de Deploy

- [ ] Servidor configurado com `setup.sh`
- [ ] Domínio configurado nos arquivos
- [ ] Repositório clonado
- [ ] Deploy executado com `deploy.sh`
- [ ] SSL configurado com certbot
- [ ] Aplicação acessível via HTTPS
- [ ] Admin acessível em `/admin`
- [ ] Backups configurados
- [ ] Monitoramento funcionando
- [ ] Performance testada

🎉 **Deploy concluído com sucesso!**
