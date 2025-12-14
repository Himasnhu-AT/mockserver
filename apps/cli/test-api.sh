#!/bin/bash

PORT=9500
HOST="localhost"
BASE_URL="http://$HOST:$PORT"
TOKEN="mock-token-123"

echo "🚀 Starting MockServer tests..."

if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from apps/cli directory"
    exit 1
fi

PID=$(lsof -t -i:$PORT)
if [ -n "$PID" ]; then
    echo "⚠️  Killing existing process on port $PORT"
    kill -9 $PID
fi

# Start the server with the default template (which we just set as default in init)
echo "📝 Initializing schema with default template..."
cp .mockserver/schema.json .mockserver/schema.json.bak

./node_modules/.bin/tsx src/cli.ts init --template default --force

if [ ! -f ".mockserver/schema.json" ]; then
    echo "❌ Failed to create .mockserver/schema.json"
    exit 1
fi

echo "🟢 Starting server..."
./node_modules/.bin/tsx src/cli.ts start &
SERVER_PID=$!

echo "⏳ Waiting for server to be ready..."
sleep 5

check_status() {
    URL=$1
    EXPECTED=$2
    AUTH_HEADER=$3
    
    if [ -z "$AUTH_HEADER" ]; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
    else
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -H "$AUTH_HEADER" "$URL")
    fi

    if [ "$HTTP_CODE" -eq "$EXPECTED" ]; then
        echo "✅ $URL returned $HTTP_CODE (Expected)"
    else
        echo "❌ $URL returned $HTTP_CODE (Expected $EXPECTED)"
        # kill $SERVER_PID
        # exit 1 
        # Don't exit immediately to run all tests
    fi
}

echo "🔍 Testing Public/Protected Endpoints..."

# 1. Test Public Endpoint (if any) or existing endpoint without token
# The default template has Auth Enabled globally. So most things should fail without token.
echo "   Testing /api/users without token (Should fail 401)..."
check_status "$BASE_URL/api/users" 401

# 2. Test with Invalid Token
echo "   Testing /api/users with invalid token (Should fail 403/401)..."
# In mockserver implementation (implied), invalid token usually returns 401/403
check_status "$BASE_URL/api/users" 403 "Authorization: Bearer invalid-token"

# 3. Test with Valid Token
echo "   Testing /api/users with valid token (Should succeed 200)..."
check_status "$BASE_URL/api/users" 200 "Authorization: Bearer $TOKEN"

# 4. Test Current User
echo "   Testing /api/auth/me with valid token (Should succeed 200)..."
check_status "$BASE_URL/api/auth/me" 200 "Authorization: Bearer $TOKEN"

# Cleanup
echo "🧹 Cleaning up..."
kill $SERVER_PID
rm .mockserver/schema.json
cp .mockserver/schema.json.bak .mockserver/schema.json
rm .mockserver/schema.json.bak

echo "✨ Tests completed."
