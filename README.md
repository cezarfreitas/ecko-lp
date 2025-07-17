# Landing Page CMS - Deployment Guide

## Easy Panel VPS Deployment

### Prerequisites
- VPS with Easy Panel installed
- Domain name configured
- SSH access to the server

### Quick Setup

1. **Clone the repository:**
\`\`\`bash
git clone <your-repo-url>
cd landing-page-cms
\`\`\`

2. **Run initial setup:**
\`\`\`bash
chmod +x setup.sh
./setup.sh
\`\`\`

3. **Configure environment:**
Edit `.env.production` with your actual values:
- `NEXT_PUBLIC_APP_URL`: Your domain URL
- `WEBHOOK_URL`: Your webhook endpoint for form submissions

4. **Deploy:**
\`\`\`bash
./deploy.sh
\`\`\`

### Manual Deployment Steps

1. **Build Docker image:**
\`\`\`bash
docker build -t landing-page-cms .
\`\`\`

2. **Run with Docker Compose:**
\`\`\`bash
docker-compose up -d
\`\`\`

3. **Configure reverse proxy:**
Use the provided `nginx.conf` or configure through Easy Panel interface.

### Environment Variables

Required variables in `.env.production`:
- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
- `WEBHOOK_URL=https://your-webhook-url.com/webhook`

### Features Included

- ✅ Docker containerization
- ✅ Production optimizations
- ✅ SSL/HTTPS ready
- ✅ Static file caching
- ✅ Gzip compression
- ✅ Security headers
- ✅ Auto-restart on failure
- ✅ Volume persistence for data
- ✅ Easy Panel configuration

### Monitoring

Check application status:
\`\`\`bash
docker-compose ps
docker-compose logs -f app
\`\`\`

### Updates

To update the application:
\`\`\`bash
git pull origin main
./deploy.sh
\`\`\`

### Troubleshooting

1. **Port conflicts:** Ensure port 3000 is available
2. **Permission issues:** Check file permissions with `chmod +x`
3. **Environment variables:** Verify all required variables are set
4. **Domain configuration:** Ensure DNS points to your VPS IP

### Support

For issues related to Easy Panel, consult the Easy Panel documentation.
For application issues, check the logs with `docker-compose logs`.
