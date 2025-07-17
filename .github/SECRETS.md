# GitHub Secrets Configuration

## Setup Instructions

### 1. Create Environments
1. Go to **Settings** > **Environments**
2. Create environments: `development`, `staging`, `production`
3. For `production`: Enable **Required reviewers** and add yourself

### 2. Add Environment Secrets

#### Development Environment (`development`)
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=dev_secure_password_2024
DB_DATABASE=laten_dev
JWT_SECRET=dev_jwt_secret_32_chars_minimum_for_development_env
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@laten.dev
ADMIN_PASSWORD=DevAdmin2024!
```

#### Staging Environment (`staging`)
```
DB_HOST=staging-db.yourhost.com
DB_PORT=5432
DB_USERNAME=laten_staging
DB_PASSWORD=staging_secure_password_2024
DB_DATABASE=laten_staging
JWT_SECRET=staging_jwt_secret_32_chars_minimum_for_staging_env
FRONTEND_URL=https://staging.laten.com
ADMIN_EMAIL=admin@staging.laten.com
ADMIN_PASSWORD=StagingAdmin2024!
```

#### Production Environment (`production`)
```
DB_HOST=prod-db.yourhost.com
DB_PORT=5432
DB_USERNAME=laten_prod
DB_PASSWORD=production_secure_password_2024
DB_DATABASE=laten_production
JWT_SECRET=production_jwt_secret_32_chars_minimum_for_prod_env
FRONTEND_URL=https://laten.com
ADMIN_EMAIL=admin@laten.com
ADMIN_PASSWORD=ProductionAdmin2024!
```

### 3. Add Repository Secrets
Go to **Settings** > **Secrets and variables** > **Actions**

```
DOCKER_REGISTRY_TOKEN=your_docker_hub_token
CODECOV_TOKEN=your_codecov_token
SLACK_WEBHOOK_URL=your_slack_webhook_for_notifications
```

## Quick Setup Guide

### Step 1: Create Environments
```
Settings > Environments > New environment
- Name: development
- Name: staging  
- Name: production (+ Enable "Required reviewers")
```

### Step 2: Add Secrets to Each Environment
Click on each environment > **Add secret**

### Step 3: Repository Secrets
```
Settings > Secrets and variables > Actions > New repository secret
```

## Verification

Test in workflow:
```yaml
deploy-production:
  environment: production
  steps:
    - name: Test secrets
      env:
        DB_PASS: ${{ secrets.DB_PASSWORD }}
      run: echo "Secret loaded: ${#DB_PASS} characters"
```
