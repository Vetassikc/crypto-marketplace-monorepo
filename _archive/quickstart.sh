#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# 🚀 CRYPTO MARKETPLACE - QUICKSTART SCRIPT
# ═══════════════════════════════════════════════════════════════════════════════
# Single command to launch the entire marketplace locally
# Usage: ./quickstart.sh [options]
# Options:
#   --fresh    Clean install (removes node_modules and reinstalls)
#   --db-only  Only start the database
#   --skip-db  Skip database startup (if using external DB)
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
FRESH_INSTALL=false
DB_ONLY=false
SKIP_DB=false

for arg in "$@"; do
    case $arg in
        --fresh) FRESH_INSTALL=true ;;
        --db-only) DB_ONLY=true ;;
        --skip-db) SKIP_DB=true ;;
    esac
done

echo -e "${BLUE}"
echo "═══════════════════════════════════════════════════════════════════"
echo "  🛒 CRYPTO MARKETPLACE - Local Development Environment"
echo "═══════════════════════════════════════════════════════════════════"
echo -e "${NC}"

# ─────────────────────────────────────────────────────────────────────────────
# Function: Check prerequisites
# ─────────────────────────────────────────────────────────────────────────────
check_prereqs() {
    echo -e "${BLUE}[1/6] Checking prerequisites...${NC}"
    
    # Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
        exit 1
    fi
    echo -e "  ${GREEN}✓${NC} Node.js: $(node --version)"
    
    # npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed.${NC}"
        exit 1
    fi
    echo -e "  ${GREEN}✓${NC} npm: $(npm --version)"
    
    # Docker (optional but recommended)
    if command -v docker &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Docker: $(docker --version | cut -d' ' -f3 | tr -d ',')"
        DOCKER_AVAILABLE=true
    else
        echo -e "  ${YELLOW}⚠${NC} Docker not found (optional - needed for local PostgreSQL)"
        DOCKER_AVAILABLE=false
    fi
}

# ─────────────────────────────────────────────────────────────────────────────
# Function: Start PostgreSQL via Docker
# ─────────────────────────────────────────────────────────────────────────────
start_database() {
    if [ "$SKIP_DB" = true ]; then
        echo -e "${YELLOW}[2/6] Skipping database startup (--skip-db)${NC}"
        return
    fi
    
    echo -e "${BLUE}[2/6] Checking PostgreSQL database...${NC}"
    
    # Check if PostgreSQL is already running on port 5432
    if lsof -i :5432 >/dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} PostgreSQL already running on port 5432"
        echo -e "  ${YELLOW}ℹ${NC}  Using existing PostgreSQL instance"
        return
    fi
    
    if [ "$DOCKER_AVAILABLE" = true ]; then
        # Check if container already running
        if docker ps --format '{{.Names}}' | grep -q 'marketplace-db'; then
            echo -e "  ${GREEN}✓${NC} PostgreSQL already running (Docker)"
        else
            # Start with docker-compose
            if [ -f "docker-compose.yml" ]; then
                docker compose up -d postgres
                echo -e "  ${GREEN}✓${NC} PostgreSQL started via Docker Compose"
                
                # Wait for DB to be ready
                echo -e "  Waiting for database to be ready..."
                sleep 3
                
                # Health check
                for i in {1..10}; do
                    if docker exec marketplace-db pg_isready -U postgres &> /dev/null; then
                        echo -e "  ${GREEN}✓${NC} Database is ready!"
                        break
                    fi
                    sleep 1
                done
            else
                echo -e "${RED}❌ docker-compose.yml not found${NC}"
                exit 1
            fi
        fi
    else
        echo -e "  ${YELLOW}⚠${NC} No PostgreSQL found and Docker not available"
        echo -e "  ${YELLOW}⚠${NC} Please start PostgreSQL manually on port 5432"
        echo -e "  ${YELLOW}⚠${NC} Expected connection string in .env"
    fi
}

# ─────────────────────────────────────────────────────────────────────────────
# Function: Setup Backend
# ─────────────────────────────────────────────────────────────────────────────
setup_backend() {
    if [ "$DB_ONLY" = true ]; then
        return
    fi
    
    echo -e "${BLUE}[3/6] Setting up Backend (marketplace-server)...${NC}"
    cd marketplace-server
    
    # Copy .env if needed
    if [ ! -f ".env" ] && [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "  ${YELLOW}⚠${NC} Created .env from .env.example - please update with real values!"
    fi
    
    # Fresh install or regular install
    if [ "$FRESH_INSTALL" = true ]; then
        echo -e "  Removing node_modules (fresh install)..."
        rm -rf node_modules
    fi
    
    if [ ! -d "node_modules" ]; then
        echo -e "  Installing dependencies..."
        npm install --legacy-peer-deps
    else
        echo -e "  ${GREEN}✓${NC} Dependencies already installed"
    fi
    
    # Prisma generate
    echo -e "  Generating Prisma client..."
    npx prisma generate
    
    # Run migrations
    echo -e "  Running database migrations..."
    npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init 2>/dev/null || true
    
    echo -e "  ${GREEN}✓${NC} Backend ready!"
    cd ..
}

# ─────────────────────────────────────────────────────────────────────────────
# Function: Setup Frontend
# ─────────────────────────────────────────────────────────────────────────────
setup_frontend() {
    if [ "$DB_ONLY" = true ]; then
        return
    fi
    
    echo -e "${BLUE}[4/6] Setting up Frontend (my-crypto-marketplace)...${NC}"
    cd my-crypto-marketplace
    
    # Copy .env if needed
    if [ ! -f ".env" ] && [ -f ".env.example" ]; then
        cp .env.example .env
    fi
    
    # Fresh install or regular install
    if [ "$FRESH_INSTALL" = true ]; then
        echo -e "  Removing node_modules (fresh install)..."
        rm -rf node_modules
    fi
    
    if [ ! -d "node_modules" ]; then
        echo -e "  Installing dependencies..."
        npm install --legacy-peer-deps
    else
        echo -e "  ${GREEN}✓${NC} Dependencies already installed"
    fi
    
    echo -e "  ${GREEN}✓${NC} Frontend ready!"
    cd ..
}

# ─────────────────────────────────────────────────────────────────────────────
# Function: Start Services
# ─────────────────────────────────────────────────────────────────────────────
start_services() {
    if [ "$DB_ONLY" = true ]; then
        echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
        echo -e "${GREEN}  ✅ Database is running!${NC}"
        echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
        echo ""
        echo -e "  Check .env for connection details"
        echo ""
        return
    fi
    
    echo -e "${BLUE}[5/6] Starting services in background...${NC}"
    
    BASE_DIR=$(pwd)
    
    # Kill any existing processes on ports 3000 and 3001
    lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null || true
    lsof -ti:3001 2>/dev/null | xargs kill -9 2>/dev/null || true
    
    # Start backend
    echo -e "  Starting backend on http://localhost:3001... (Logs: backend.log)"
    cd "$BASE_DIR/marketplace-server"
    export PORT=3001
    nohup npm run dev > "$BASE_DIR/backend.log" 2>&1 &
    BACKEND_PID=$!
    
    # Start frontend
    echo -e "  Starting frontend on http://localhost:3000... (Logs: frontend.log)"
    cd "$BASE_DIR/my-crypto-marketplace"
    export PORT=3000
    export BROWSER=none
    export FAST_REFRESH=false
    export WATCHPACK_POLLING=true
    nohup npm start > "$BASE_DIR/frontend.log" 2>&1 &
    FRONTEND_PID=$!
    
    cd "$BASE_DIR"
    
    echo -e "  ${YELLOW}Waiting for services to initialize...${NC}"
    
    # Health check for Backend
    for i in {1..30}; do
        if curl -s http://localhost:3001/api/products > /dev/null; then
            echo -e "  ${GREEN}✓${NC} Backend is online!"
            break
        fi
        sleep 2
        echo -n "."
    done
    
    # Health check for Frontend
    echo -e "\n  ${YELLOW}Waiting for frontend (this can take 1-2 mins)...${NC}"
    for i in {1..60}; do
        if curl -s http://localhost:3000 > /dev/null; then
            echo -e "\n  ${GREEN}✓${NC} Frontend is online!"
            break
        fi
        sleep 5
        echo -n "."
    done
}

# ─────────────────────────────────────────────────────────────────────────────
# Function: Print Summary
# ─────────────────────────────────────────────────────────────────────────────
print_summary() {
    if [ "$DB_ONLY" = true ]; then
        return
    fi
    
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  🎉 MARKETPLACE IS READY!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  ${BLUE}Frontend:${NC}   http://localhost:3000"
    echo -e "  ${BLUE}Backend:${NC}    http://localhost:3001"
    echo ""
    echo -e "  ${YELLOW}Logs:${NC}"
    echo -e "    tail -f backend.log"
    echo -e "    tail -f frontend.log"
    echo ""
    echo -e "  ${YELLOW}To stop everything:${NC}"
    echo -e "    kill $BACKEND_PID $FRONTEND_PID"
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
    
    # Open browser on Mac
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open http://localhost:3000
    fi
}

# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────
check_prereqs
start_database
setup_backend
setup_frontend
start_services
print_summary

# Do not wait - exit and leave them running in background as requested
echo -e "\n${YELLOW}Services are running in background. You can find their PIDs above.${NC}"
exit 0
