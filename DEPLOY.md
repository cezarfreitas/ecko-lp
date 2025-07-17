# 🚀 Deploy Guide for EasyPanel VPS

## Prerequisites

- Ubuntu/Debian VPS with root access
- Domain name pointing to your server IP
- At least 1GB RAM and 10GB storage

## Quick Deploy

### 1. Initial Setup

\`\`\`bash
# Run as root
sudo ./setup.sh
\`\`\`

### 2. Configure Domain

Edit the following files and replace `yourdomain.com`:

- `docker-compose.yml`
- `nginx.conf`
- `easypanel.json`

### 3. Deploy Application

\`\`\`bash
./deploy.sh
\`\`\`

### 4. Setup SSL Certificate

\`\`\`bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
\`\`\`

## Manual Configuration

### Environment Variables

Update `docker-compose.yml`:

\`\`\`yaml
environment:
  - NODE_ENV=production
  - NEXT_PUBLIC_APP_URL=https://yourdomain.com
\`\`\`

### Nginx Configuration

The `nginx.conf` includes:
- SSL termination
- Gzip compression
- Security headers
- Rate limiting
- Static file caching

### Docker Configuration

- **Dockerfile**: Multi-stage build for optimization
- **docker-compose.yml**: Production-ready setup
- **Health checks**: Automatic container monitoring

## Monitoring

### Check Application Status

\`\`\`bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Check application health
curl http://localhost:3000/health
\`\`\`

### System Monitoring

\`\`\`bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check Docker stats
docker stats
\`\`\`

## Backup & Maintenance

### Automatic Backup

\`\`\`bash
# Run backup
./backup.sh

# Setup cron job
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
\`\`\`

### Updates

\`\`\`bash
# Pull latest changes and redeploy
git pull origin main
./deploy.sh
\`\`\`

### SSL Renewal

\`\`\`bash
# Test renewal
sudo certbot renew --dry-run

# Setup auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
\`\`\`

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   \`\`\`bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   \`\`\`

2. **Docker build fails**
   \`\`\`bash
   docker system prune -a
   ./deploy.sh
   \`\`\`

3. **SSL certificate issues**
   \`\`\`bash
   sudo certbot certificates
   sudo certbot renew --force-renewal
   \`\`\`

4. **Application not responding**
   \`\`\`bash
   docker-compose restart
   docker-compose logs app
   \`\`\`

### Performance Optimization

1. **Enable Docker BuildKit**
   \`\`\`bash
   export DOCKER_BUILDKIT=1
   \`\`\`

2. **Optimize Nginx**
   - Adjust worker processes
   - Tune buffer sizes
   - Enable HTTP/2

3. **Monitor Resources**
   \`\`\`bash
   htop
   iotop
   docker stats
   \`\`\`

## Security Checklist

- ✅ Firewall configured (UFW)
- ✅ SSL certificates installed
- ✅ Security headers enabled
- ✅ Rate limiting configured
- ✅ Regular backups scheduled
- ✅ Log rotation setup
- ✅ Non-root user for containers

## Support

For issues:
1. Check logs: `docker-compose logs`
2. Verify configuration files
3. Test connectivity: `curl -I https://yourdomain.com`
4. Check DNS resolution: `nslookup yourdomain.com`

## Production Checklist

Before going live:

- [ ] Domain DNS configured
- [ ] SSL certificate installed
- [ ] Environment variables set
- [ ] Backup system tested
- [ ] Monitoring setup
- [ ] Performance tested
- [ ] Security scan completed
