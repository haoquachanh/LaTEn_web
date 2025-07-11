# Makefile for Docker operations
.PHONY: help build dev prod up down logs clean

# Default target
help:
	@echo "🐳 Docker Commands for LaTEn Frontend"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start development environment with hot reload"
	@echo "  make dev-logs     - View development logs"
	@echo ""
	@echo "Production:"
	@echo "  make build        - Build production Docker image"
	@echo "  make prod         - Start production environment"
	@echo "  make prod-logs    - View production logs"
	@echo ""
	@echo "Management:"
	@echo "  make up           - Start all services"
	@echo "  make down         - Stop all services"
	@echo "  make logs         - View all logs"
	@echo "  make clean        - Clean up containers and images"
	@echo "  make health       - Check container health"
	@echo ""
	@echo "Monitoring:"
	@echo "  make monitoring   - Start with monitoring (Prometheus + Grafana)"
	@echo "  make nginx        - Start with Nginx reverse proxy"

# Development
dev:
	@echo "🚀 Starting development environment..."
	docker-compose --profile dev up -d

dev-logs:
	docker-compose --profile dev logs -f frontend-dev

# Production
build:
	@echo "🏗️ Building production Docker image..."
	docker-compose build frontend

prod:
	@echo "🚀 Starting production environment..."
	docker-compose up -d frontend

prod-logs:
	docker-compose logs -f frontend

# Management
up:
	@echo "⬆️ Starting all services..."
	docker-compose up -d

down:
	@echo "⬇️ Stopping all services..."
	docker-compose down

logs:
	docker-compose logs -f

clean:
	@echo "🧹 Cleaning up containers and images..."
	docker-compose down -v --remove-orphans
	docker system prune -f
	docker image prune -f

health:
	@echo "🏥 Checking container health..."
	docker-compose ps
	@echo ""
	@echo "Frontend health check:"
	@curl -f http://localhost:3000/api/health 2>/dev/null && echo "✅ Frontend is healthy" || echo "❌ Frontend is not responding"

# Advanced setups
monitoring:
	@echo "📊 Starting with monitoring..."
	docker-compose --profile monitoring up -d

nginx:
	@echo "🌐 Starting with Nginx reverse proxy..."
	docker-compose --profile nginx --profile production up -d

# Quick commands
restart: down up
	@echo "🔄 Restarted all services"

rebuild: down build up
	@echo "🔄 Rebuilt and restarted"

# Environment setup
env-setup:
	@echo "⚙️ Setting up environment files..."
	@if [ ! -f .env.local ]; then \
		echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api" > .env.local; \
		echo "Created .env.local"; \
	fi
	@if [ ! -f .env.production ]; then \
		echo "NEXT_PUBLIC_API_URL=https://laten.vercel.app/api" > .env.production; \
		echo "Created .env.production"; \
	fi

# Docker registry operations (for CI/CD)
push:
	@echo "📤 Pushing to GitHub Container Registry..."
	docker tag laten_web/frontend:latest ghcr.io/your-username/laten_web:latest
	docker push ghcr.io/your-username/laten_web:latest

pull:
	@echo "📥 Pulling from GitHub Container Registry..."
	docker pull ghcr.io/your-username/laten_web:latest
