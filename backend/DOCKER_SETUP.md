# LaTEn Backend - Docker Setup

## 🔧 Quick Start

### 1. Cấu hình môi trường

Copy file `.env` tương ứng với môi trường bạn cần:

```bash
# Development (local)
cp .env.dev .env

# Production
cp .env.prod .env

# Testing
cp .env.test .env
```

**⚠️ LƯU Ý:** Đổi các giá trị `CHANGE_ME` trong file `.env` thành secrets thật trước khi chạy production!

### 2. Port mapping

| Environment | Postgres Port | Backend Port |
|------------|---------------|--------------|
| Development | 5433          | 3001         |
| Production  | 5435          | 3001         |
| Test (CI)   | 5432          | 3001         |
| Root (shared) | 5434        | -            |

### 3. Chạy Docker

#### Development (recommended cho local)
```bash
docker compose -f docker-compose.dev.yml up -d
npm run dev
```

#### Production
```bash
docker compose up -d
```

#### Testing
```bash
docker compose -f docker-compose.test.yml up -d
npm run test:e2e
```

## 📁 Cấu trúc Environment Files

```
backend/
├── .env                    # Active environment (gitignored)
├── .env.example           # Template cho local development
├── .env.dev              # Development settings
├── .env.prod             # Production settings (cần sửa secrets!)
└── .env.test             # Testing settings
```

## 🔒 Bảo mật

- ✅ Tất cả `.env*` files đã được gitignore
- ✅ Docker compose không còn hard-code secrets
- ✅ Sử dụng `env_file` để load biến môi trường
- ⚠️ Nhớ đổi password và JWT secret trước khi deploy production

## 🚀 Deploy với Supabase

1. Tạo Postgres database trên Supabase
2. Copy connection string từ Supabase dashboard
3. Cập nhật `.env.prod`:
   ```env
   DB_HOST=your-project.supabase.co
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_supabase_password
   DB_DATABASE=postgres
   ```
4. Deploy backend lên Render/Railway/VPS
5. Backend sẽ tự động connect tới Supabase Postgres

## 🛠️ Commands

```bash
# Development
npm run docker:dev          # Start dev containers
npm run docker:down:dev     # Stop dev containers

# Production
npm run docker:prod         # Start prod containers
npm run docker:down         # Stop prod containers

# Database
npm run migration:run       # Run migrations
npm run seed:admin          # Seed admin user
```

## ❓ Troubleshooting

**Port đã được sử dụng?**
```bash
# Kiểm tra port nào đang chạy
lsof -i :5432
lsof -i :5433

# Stop các container cũ
docker compose down
docker compose -f docker-compose.dev.yml down
```

**Healthcheck failed?**
- Đợi 10-15s để DB khởi động đủ
- Kiểm tra logs: `docker compose logs postgres-dev`
