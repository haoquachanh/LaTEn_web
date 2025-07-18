# 🔐 GitHub Secrets Configuration - LaTEn Project

## 📋 Required Setup for Production Security

### Step 1: Configure Existing Environments

You already have these environments in your repo. Add secrets to each:

#### 🟡 `staging` Environment
**Purpose:** Development & Staging deployments

**Required Secrets:**
```
DB_HOST=your-staging-database-host.com
DB_PORT=5432
DB_USERNAME=laten_staging_user
DB_PASSWORD=staging_secure_password_2024_min_16_chars
DB_DATABASE=laten_staging
JWT_SECRET=staging_jwt_secret_must_be_at_least_32_characters_long_secure
FRONTEND_URL=https://staging.yourdomain.com
ADMIN_EMAIL=admin@staging.yourdomain.com
ADMIN_PASSWORD=StagingAdmin2024!SecurePassword
```

#### 🔴 `Production` Environment  
**Purpose:** Production deployments (Manual approval required)

**Required Secrets:**
```
DB_HOST=your-production-database-host.com
DB_PORT=5432
DB_USERNAME=laten_production_user
DB_PASSWORD=production_ultra_secure_password_2024_minimum_20_characters
DB_DATABASE=laten_production
JWT_SECRET=production_jwt_secret_ultra_secure_must_be_at_least_32_chars_long
FRONTEND_URL=https://yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=ProductionAdmin2024!UltraSecurePassword
```

### Step 2: Repository Secrets (Shared across all environments)

**Go to:** `Settings` > `Secrets and variables` > `Actions` > `New repository secret`

```
DOCKER_REGISTRY_TOKEN=your_docker_hub_access_token
CODECOV_TOKEN=your_codecov_upload_token
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url
```

## 🚀 How to Add Environment Secrets

### For `staging` Environment:
1. Go to `Settings` > `Environments` 
2. Click on **`staging`**
3. Scroll to **Environment secrets**
4. Click **Add secret**
5. Add each secret name and value from the list above

### For `Production` Environment:
1. Go to `Settings` > `Environments`
2. Click on **`Production`** 
3. Scroll to **Environment secrets**
4. Click **Add secret**
5. Add each secret name and value from the list above

## ⚠️ Security Notes

### ✅ What's Secure:
- All passwords/secrets are stored in GitHub encrypted storage
- Only specific workflows can access environment secrets
- Production requires manual approval
- No secrets visible in logs or code

### ❌ Never Do This:
- Don't commit secrets to code files
- Don't use simple passwords like "password123"
- Don't reuse production secrets in staging
- Don't share secrets in chat/email

## 🔍 How Secrets Are Used in CI/CD

### Test Environment (CI only):
```yaml
# Uses hardcoded test values - NOT production secrets
DB_PASSWORD=postgres  # Safe for CI testing
```

### Staging Deployment:
```yaml
environment: staging
env:
  DB_PASSWORD: ${{ secrets.DB_PASSWORD }}  # From staging environment
```

### Production Deployment:
```yaml
environment: Production  # Requires manual approval
env:
  DB_PASSWORD: ${{ secrets.DB_PASSWORD }}  # From Production environment
```

## ✅ Verification Checklist

- [ ] Added all 8 secrets to `staging` environment
- [ ] Added all 8 secrets to `Production` environment  
- [ ] Added 3 repository secrets for shared tools
- [ ] Verified `Production` environment has **Required reviewers** enabled
- [ ] Tested deployment workflow triggers correctly

## 🆘 Need Help?

1. **Can't find Environments?** Go to `Settings` > `Environments`
2. **No Add Secret button?** You need admin/write access to the repo
3. **Secrets not loading?** Check environment name matches workflow exactly (`staging` vs `Production`)

---
**🛡️ Security Level:** Production Ready | **📅 Updated:** January 2024
