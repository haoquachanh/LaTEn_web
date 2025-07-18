# LaTEn Backend Smart Environment Switcher
# Usage: .\switch-env-smart.ps1 [environment] [-Auto]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("local","github","production")]
    [string]$Environment,
    
    [switch]$Auto,
    [switch]$Interactive
)

$ErrorActionPreference = "Stop"

# Colors for output
$Green = "Green"
$Yellow = "Yellow" 
$Red = "Red"
$Cyan = "Cyan"
$Magenta = "Magenta"

Write-Host "🤖 LaTEn Backend Smart Environment Switcher" -ForegroundColor $Magenta
Write-Host "================================================" -ForegroundColor $Cyan

# Check if we're in the backend directory
if (!(Test-Path "package.json") -or !(Test-Path "src")) {
    Write-Host "❌ Error: Please run this script from the backend directory!" -ForegroundColor $Red
    exit 1
}

# Auto-detect environment if not specified
function Get-AutoEnvironment {
    Write-Host "🔍 Auto-detecting environment..." -ForegroundColor $Yellow
    
    # Check Git branch
    try {
        $currentBranch = & git rev-parse --abbrev-ref HEAD 2>$null
        Write-Host "📂 Current Git branch: $currentBranch" -ForegroundColor $Cyan
        
        # Branch-based detection
        switch -Regex ($currentBranch) {
            "^(main|master)$" { 
                Write-Host "🚀 Main/Master branch detected → Suggesting PRODUCTION" -ForegroundColor $Red
                return "production" 
            }
            "^(develop|dev)$" { 
                Write-Host "🔧 Development branch detected → Suggesting GITHUB" -ForegroundColor $Yellow
                return "github" 
            }
            "^feature/" { 
                Write-Host "🏠 Feature branch detected → Suggesting LOCAL" -ForegroundColor $Green
                return "local" 
            }
            "^hotfix/" { 
                Write-Host "🚨 Hotfix branch detected → Suggesting PRODUCTION" -ForegroundColor $Red
                return "production" 
            }
            default { 
                Write-Host "🏠 Unknown branch → Defaulting to LOCAL" -ForegroundColor $Green
                return "local" 
            }
        }
    } catch {
        Write-Host "⚠️  Not a Git repository or Git not available" -ForegroundColor $Yellow
    }
    
    # Check environment indicators
    if (Test-Path "docker-compose.test.yml") {
        Write-Host "🐳 Test Docker config found → Suggesting GITHUB" -ForegroundColor $Yellow
        return "github"
    }
    
    if ($env:CI -eq "true" -or $env:GITHUB_ACTIONS -eq "true") {
        Write-Host "⚙️  CI environment detected → Using GITHUB" -ForegroundColor $Yellow
        return "github"
    }
    
    if ($env:NODE_ENV -eq "production") {
        Write-Host "🚀 Production NODE_ENV detected → Using PRODUCTION" -ForegroundColor $Red
        return "production"
    }
    
    # Check current .env file
    if (Test-Path ".env") {
        $envContent = Get-Content ".env" -Raw
        if ($envContent -match "NODE_ENV=production") {
            Write-Host "🚀 Production .env detected → Suggesting PRODUCTION" -ForegroundColor $Red
            return "production"
        }
        if ($envContent -match "NODE_ENV=test") {
            Write-Host "🔧 Test .env detected → Suggesting GITHUB" -ForegroundColor $Yellow
            return "github"
        }
    }
    
    # Default to local
    Write-Host "🏠 No specific indicators found → Defaulting to LOCAL" -ForegroundColor $Green
    return "local"
}

# Interactive environment selection
function Get-InteractiveEnvironment {
    Write-Host "`n🎯 Interactive Environment Selection" -ForegroundColor $Magenta
    Write-Host "=====================================" -ForegroundColor $Cyan
    
    Write-Host "1. 🏠 Local Development   - For coding on your machine" -ForegroundColor $Green
    Write-Host "2. 🔧 GitHub CI/CD        - For testing and automation" -ForegroundColor $Yellow  
    Write-Host "3. 🚀 Production          - For live deployment" -ForegroundColor $Red
    Write-Host "4. 🤖 Auto-detect         - Let script decide" -ForegroundColor $Magenta
    
    do {
        $choice = Read-Host "`nSelect environment (1-4)"
        switch ($choice) {
            "1" { return "local" }
            "2" { return "github" }
            "3" { return "production" }
            "4" { return Get-AutoEnvironment }
            default { Write-Host "❌ Invalid choice. Please select 1-4." -ForegroundColor $Red }
        }
    } while ($true)
}

# Determine environment to use
if ($Interactive) {
    $Environment = Get-InteractiveEnvironment
} elseif (-not $Environment -and $Auto) {
    $Environment = Get-AutoEnvironment
} elseif (-not $Environment) {
    # Show current environment and ask
    Write-Host "📋 Current environment info:" -ForegroundColor $Cyan
    if (Test-Path ".env") {
        $envContent = Get-Content ".env"
        foreach ($line in $envContent) {
            if ($line -match "^(NODE_ENV|DB_HOST|DB_DATABASE)=(.+)$") {
                Write-Host "  $($matches[1]) = $($matches[2])" -ForegroundColor $Green
            }
        }
    } else {
        Write-Host "  No .env file found" -ForegroundColor $Yellow
    }
    
    Write-Host "`n🎯 Please specify environment:" -ForegroundColor $Yellow
    Write-Host "Usage: .\switch-env-smart.ps1 [local|github|production]" -ForegroundColor $White
    Write-Host "   or: .\switch-env-smart.ps1 -Auto" -ForegroundColor $White
    Write-Host "   or: .\switch-env-smart.ps1 -Interactive" -ForegroundColor $White
    exit 1
}

# Confirm auto-detected environment
if ($Auto -and !$Interactive) {
    Write-Host "`n🤔 Auto-detected environment: $Environment" -ForegroundColor $Magenta
    $confirm = Read-Host "Continue with this environment? (Y/n)"
    if ($confirm -eq "n" -or $confirm -eq "N") {
        Write-Host "❌ Operation cancelled by user" -ForegroundColor $Yellow
        exit 0
    }
}

# Define environment files
$envFiles = @{
    "local" = ".env.local"
    "github" = ".env.github"  
    "production" = ".env.production"
}

$sourceFile = $envFiles[$Environment]
$targetFile = ".env"

# Check if source environment file exists
if (!(Test-Path $sourceFile)) {
    Write-Host "❌ Error: Environment file '$sourceFile' not found!" -ForegroundColor $Red
    Write-Host "💡 Available environment files:" -ForegroundColor $Yellow
    Get-ChildItem ".env.*" | ForEach-Object { Write-Host "   $($_.Name)" -ForegroundColor $Green }
    exit 1
}

# Show what will happen
Write-Host "`n🔄 Switching to '$Environment' environment..." -ForegroundColor $Cyan
Write-Host "Source: $sourceFile → Target: $targetFile" -ForegroundColor $Yellow

# Backup current .env if it exists
if (Test-Path $targetFile) {
    $backupFile = ".env.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item $targetFile $backupFile
    Write-Host "📋 Backed up current .env to $backupFile" -ForegroundColor $Yellow
}

# Copy environment file
try {
    Copy-Item $sourceFile $targetFile -Force
    Write-Host "✅ Successfully switched to '$Environment' environment" -ForegroundColor $Green
    
    # Show current environment details
    Write-Host "`n📊 Current Environment Configuration:" -ForegroundColor $Cyan
    Write-Host "----------------------------------------" -ForegroundColor $Cyan
    
    # Parse and display key environment variables
    $envContent = Get-Content $targetFile
    foreach ($line in $envContent) {
        if ($line -match "^(NODE_ENV|DB_HOST|DB_DATABASE|PORT|FRONTEND_URL)=(.+)$") {
            $key = $matches[1]
            $value = $matches[2]
            Write-Host "$key = $value" -ForegroundColor $Green
        }
    }
    
    Write-Host "`n🚀 Ready to start development!" -ForegroundColor $Green
    Write-Host "Run: npm run start:dev" -ForegroundColor $Yellow
    
} catch {
    Write-Host "❌ Error switching environment: $($_.Exception.Message)" -ForegroundColor $Red
    exit 1
}

# Environment specific instructions
switch ($Environment) {
    "local" {
        Write-Host "`n💡 Local Development Tips:" -ForegroundColor $Cyan
        Write-Host "- Make sure PostgreSQL is running on localhost:5432" -ForegroundColor $Yellow
        Write-Host "- Database: laten_local should exist" -ForegroundColor $Yellow
        Write-Host "- Run migrations: npm run migration:run" -ForegroundColor $Yellow
        Write-Host "- Quick start: npm run start:local" -ForegroundColor $Green
    }
    
    "github" {
        Write-Host "`n🔧 GitHub CI/CD Environment:" -ForegroundColor $Cyan
        Write-Host "- This environment is for testing and CI" -ForegroundColor $Yellow
        Write-Host "- Use with Docker: npm run db:start:test" -ForegroundColor $Yellow
        Write-Host "- Run tests: npm run test:ci" -ForegroundColor $Yellow
        Write-Host "- Quick start: npm run start:github" -ForegroundColor $Green
    }
    
    "production" {
        Write-Host "`n⚠️  PRODUCTION Environment:" -ForegroundColor $Red
        Write-Host "- CRITICAL: Update database credentials before deploy!" -ForegroundColor $Red
        Write-Host "- CRITICAL: Change JWT_SECRET to a strong value!" -ForegroundColor $Red
        Write-Host "- CRITICAL: Update FRONTEND_URL to production domain!" -ForegroundColor $Red
        Write-Host "- Build for production: npm run build" -ForegroundColor $Yellow
        Write-Host "- Quick start: npm run start:production" -ForegroundColor $Green
    }
}

Write-Host "`n================================================" -ForegroundColor $Cyan
Write-Host "Environment switch completed! 🎉" -ForegroundColor $Green
