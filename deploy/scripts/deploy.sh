#!/bin/bash

# EduMyles Deployment Script
# Automated deployment for production environment

set -e

# Configuration
ENVIRONMENT=${1:-production}
VERSION=${2:-latest}
BACKUP_DIR="/backups/edumyles"
LOG_FILE="/var/log/edumyles-deploy.log"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

# Check prerequisites
check_prerequisites() {
    log "Checking deployment prerequisites..."
    
    # Check if running as root
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root"
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    log_success "All prerequisites found"
}

# Create backup
create_backup() {
    log "Creating backup of current deployment..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup database
    if docker ps | grep -q edumyles-db; then
        docker exec edumyles-db mongodump --out /tmp/backup
        docker cp edumyles-db:/tmp/backup "$BACKUP_DIR/db_backup_$TIMESTAMP"
        log_success "Database backup created"
    fi
    
    # Backup application files
    if [ -d "/opt/edumyles" ]; then
        tar -czf "$BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz" -C /opt edumyles
        log_success "Application backup created"
    fi
    
    # Clean old backups (keep last 7 days)
    find "$BACKUP_DIR" -name "*" -type f -mtime +7 -delete
}

# Update application code
update_code() {
    log "Updating application code..."
    
    cd /opt/edumyles
    
    # Pull latest code
    git fetch origin
    git checkout main
    git pull origin main
    
    if [ "$VERSION" != "latest" ]; then
        git checkout "$VERSION"
    fi
    
    # Install dependencies
    npm ci --production
    
    # Build application
    npm run build
    
    log_success "Application code updated"
}

# Update database schema
update_database() {
    log "Updating database schema..."
    
    # Run database migrations
    npm run migrate:prod
    
    log_success "Database schema updated"
}

# Deploy application
deploy_application() {
    log "Deploying application..."
    
    # Stop existing containers
    docker-compose down
    
    # Start new containers
    docker-compose up -d
    
    # Wait for application to be healthy
    log "Waiting for application to be healthy..."
    for i in {1..30}; do
        if curl -f http://localhost:3000/api/health &> /dev/null; then
            log_success "Application is healthy"
            break
        fi
        sleep 2
        if [ $i -eq 30 ]; then
            log_error "Application failed to start within 60 seconds"
            exit 1
        fi
    done
}

# Run health checks
run_health_checks() {
    log "Running health checks..."
    
    # Check application health
    if ! curl -f http://localhost:3000/api/health &> /dev/null; then
        log_error "Application health check failed"
        exit 1
    fi
    
    # Check database connection
    if ! docker exec edumyles-app node -e "require('./src/health-check.js')" &> /dev/null; then
        log_error "Database health check failed"
        exit 1
    fi
    
    # Check external services
    services=("redis" "mongodb" "nginx")
    for service in "${services[@]}"; do
        if ! docker ps | grep -q "edumyles-$service"; then
            log_error "$service service is not running"
            exit 1
        fi
    done
    
    log_success "All health checks passed"
}

# Update monitoring
update_monitoring() {
    log "Updating monitoring configuration..."
    
    # Update Prometheus configuration
    if [ -f "/etc/prometheus/prometheus.yml" ]; then
        cp /opt/edumyles/monitoring/prometheus.yml /etc/prometheus/prometheus.yml
        docker restart prometheus
    fi
    
    # Update Grafana dashboards
    if [ -f "/opt/edumyles/monitoring/grafana" ]; then
        docker exec grafana grafana-cli import-dashboard /opt/edumyles/monitoring/grafana/*.json
    fi
    
    log_success "Monitoring configuration updated"
}

# Send notification
send_notification() {
    local status=$1
    local message=$2
    
    log "Sending deployment notification..."
    
    # Send to Slack (if configured)
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST "$SLACK_WEBHOOK_URL" \
            -H 'Content-type: application/json' \
            --data "{\"text\":\"EduMyles Deployment $status: $message\"}"
    fi
    
    # Send email (if configured)
    if [ -n "$DEPLOYMENT_EMAIL" ]; then
        echo "$message" | mail -s "EduMyles Deployment $status" "$DEPLOYMENT_EMAIL"
    fi
}

# Rollback function
rollback() {
    log_error "Deployment failed. Initiating rollback..."
    
    cd /opt/edumyles
    
    # Get previous commit
    PREVIOUS_COMMIT=$(git rev-parse HEAD~1)
    
    # Checkout previous version
    git checkout "$PREVIOUS_COMMIT"
    npm ci --production
    npm run build
    
    # Redeploy
    docker-compose down
    docker-compose up -d
    
    # Wait for health
    for i in {1..30}; do
        if curl -f http://localhost:3000/api/health &> /dev/null; then
            log_success "Rollback completed successfully"
            send_notification "ROLLED BACK" "Deployment to $VERSION failed. Rolled back to $PREVIOUS_COMMIT"
            exit 0
        fi
        sleep 2
    done
    
    log_error "Rollback failed"
    send_notification "ROLLBACK FAILED" "Both deployment and rollback failed. Manual intervention required."
    exit 1
}

# Main deployment function
main() {
    log "Starting EduMyles deployment to $ENVIRONMENT environment..."
    log "Version: $VERSION"
    
    # Set error handling
    trap 'rollback' ERR
    
    # Deployment steps
    check_prerequisites
    create_backup
    update_code
    update_database
    deploy_application
    run_health_checks
    update_monitoring
    
    # Success
    log_success "Deployment completed successfully!"
    send_notification "SUCCESS" "EduMyles v$VERSION deployed to $ENVIRONMENT"
    
    # Cleanup
    trap - ERR
}

# Script usage
usage() {
    echo "Usage: $0 [ENVIRONMENT] [VERSION]"
    echo "ENVIRONMENT: development|staging|production (default: production)"
    echo "VERSION: git tag, branch, or commit (default: latest)"
    echo ""
    echo "Examples:"
    echo "  $0                    # Deploy latest to production"
    echo "  $0 staging            # Deploy latest to staging"
    echo "  $0 production v1.2.0   # Deploy specific version to production"
}

# Parse arguments
case "${1:-}" in
    -h|--help)
        usage
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
