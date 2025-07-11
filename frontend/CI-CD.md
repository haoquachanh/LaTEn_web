# CI/CD Documentation

## 🐳 **Docker Integration**

### **Why Docker is Important:**

```
🔧 Development Benefits:
├── 🌍 Consistent environment across team
├── 🚀 Easy onboarding for new developers  
├── 📦 Isolated dependencies
└── 🔄 Reproducible builds

🚀 Production Benefits:
├── 🏭 Production-ready containers
├── 📊 Built-in health monitoring
├── 🔄 Easy scaling and orchestration
└── 🛡️ Security isolation
```

### **Docker Workflow Options:**

#### **Option 1: Vercel (Serverless) - Current Setup**
```bash
# For quick deployment and prototyping
git push origin main
# 🤖 GitHub Actions → Vercel Deploy
# ✅ Zero server management
```

#### **Option 2: Docker + VPS/Cloud**
```bash
# For full control and custom infrastructure
make build          # Build Docker image
make prod           # Run production container
make monitoring     # Add Prometheus + Grafana
```

#### **Option 3: Hybrid Approach**
```bash
# Use both for different environments
main branch     → Vercel Production
develop branch  → Docker Staging Server
feature branch  → Vercel Preview
```

### **Docker Commands (Make shortcuts):**

```bash
# Development
make dev            # Start with hot reload
make dev-logs       # View development logs

# Production
make build          # Build production image
make prod           # Start production container
make health         # Check container health

# Management
make clean          # Clean up containers
make restart        # Restart all services
make monitoring     # Start with Prometheus/Grafana
```

### **Docker CI/CD Pipeline:**

```
🔄 Docker Workflow:
Push → GitHub Actions → Build Image → Push to Registry → Deploy

📊 What happens:
├── 🏗️ Multi-platform build (amd64, arm64)
├── 📤 Push to GitHub Container Registry  
├── 🔄 Auto-deploy to your server (optional)
└── 🏥 Health check verification
```

### **Environment Setup:**

```bash
# Create environment files
make env-setup

# Files created:
.env.local          # Development environment
.env.production     # Production environment
```

### **Health Monitoring:**

```bash
# Built-in health endpoint
curl http://localhost:3000/api/health

# Response:
{
  "status": "healthy",
  "timestamp": "2025-01-11T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "memory": {
    "used": 45,
    "total": 128
  }
}
```

### **Production Deployment with Docker:**

```bash
# On your server:
docker pull ghcr.io/your-username/laten_web:latest
docker-compose up -d

# With monitoring:
docker-compose --profile monitoring up -d
# Grafana: http://localhost:3001 (admin/admin)
# Prometheus: http://localhost:9090
```

---