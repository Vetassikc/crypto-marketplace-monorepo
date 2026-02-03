#!/bin/bash

# Marketplace V2: Robust Background Quickstart
# Usage: ./quickstart.sh

PROJECT_DIR="."
LOG_FILE="dev.log"

echo "🚀 Marketplace V2 Launcher (Root Re-struct)"

# 1. Navigation
# Already in root

# 2. Cleanup Ports (3000, 3001)
cleanup_port() {
    local PORT=$1
    local PID=$(lsof -t -i:$PORT)
    if [ -n "$PID" ]; then
        echo "🧹 Freeing port $PORT (PID $PID)..."
        kill -9 $PID
    fi
}

cleanup_port 3000
cleanup_port 3001

# 2.5 Start Database
echo "🐳 Starting Database..."
if command -v docker >/dev/null 2>&1; then
    docker-compose up -d
    echo "Wait for DB to be ready..."
    sleep 5
else
    echo "⚠️ Docker not found. Ensure Postgres is running on port 5435 manually."
fi

# 3. Setup (Silent)
echo "📦 Checking dependencies..."
npm install --silent

echo "🗄️  Syncing Database..."
npx turbo run db:generate > /dev/null 2>&1

# 4. Start in Background
echo "✨ Starting TurboRepo in background..."
nohup npx turbo run dev --filter=web --filter=@repo/api > "$LOG_FILE" 2>&1 &
SERVER_PID=$!

# 5. Health Check
wait_for_service() {
    local URL=$1
    local NAME=$2
    local TIMEOUT=60
    local COUNT=0

    echo "⏳ Waiting for $NAME ($URL)..."
    until curl -s -o /dev/null -w "%{http_code}" "$URL" | grep -q "200" || [ $COUNT -eq $TIMEOUT ]; do
        sleep 1
        COUNT=$((COUNT+1))
        echo -n "."
    done
    echo ""

    if [ $COUNT -eq $TIMEOUT ]; then
        echo "❌ $NAME failed to start after $TIMEOUT seconds."
        return 1
    fi
    echo "✅ $NAME is up!"
    return 0
}

wait_for_service "http://localhost:3001/status" "Backend API"
API_STATUS=$?
wait_for_service "http://localhost:3000" "Frontend Web"
WEB_STATUS=$?

if [ $API_STATUS -eq 0 ] && [ $WEB_STATUS -eq 0 ]; then
    echo ""
    echo "🎉 ALL SYSTEMS GO! Project running with PID $SERVER_PID"
    echo "------------------------------------------------"
    echo "📄 Logs:      tail -f dev.log"
    echo "🌍 Frontend:  http://localhost:3000"
    echo "🔌 API:       http://localhost:3001/status"
    echo "------------------------------------------------"
    echo "To stop:      kill $SERVER_PID"
else
    echo "⚠️  Some services failed to start. Check dev.log for details."
    tail -n 20 "$LOG_FILE"
fi
