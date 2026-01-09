#!/bin/bash

# Multi-Tenant Verification Script
# This script helps verify your multi-tenant setup is working correctly

echo "🏥 Multi-Tenant Clinic Frontend - Setup Verification"
echo "===================================================="
echo ""

# Check if hosts file is configured
echo "1️⃣ Checking hosts file configuration..."
if grep -q "atlas.localhost" /etc/hosts && grep -q "mansour.localhost" /etc/hosts; then
    echo "   ✅ Hosts file configured correctly"
    grep "localhost" /etc/hosts | grep -v "^#"
else
    echo "   ❌ Hosts file NOT configured"
    echo "   Run: sudo nano /etc/hosts"
    echo "   Add these lines:"
    echo "   127.0.0.1 atlas.localhost"
    echo "   127.0.0.1 mansour.localhost"
fi
echo ""

# Check if backend is running
echo "2️⃣ Checking backend availability..."
if curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo "   ✅ Backend is running on port 8000"
else
    echo "   ❌ Backend NOT running"
    echo "   Run: cd backend/clinic_backend && python manage.py runserver"
fi
echo ""

# Check tenant endpoints
echo "3️⃣ Checking tenant endpoints..."
for subdomain in "atlas" "mansour"; do
    if curl -s http://${subdomain}.localhost:8000/api/auth/login/ -X POST > /dev/null 2>&1; then
        echo "   ✅ ${subdomain}.localhost:8000 is accessible"
    else
        echo "   ❌ ${subdomain}.localhost:8000 NOT accessible"
    fi
done
echo ""

# Check frontend dependencies
echo "4️⃣ Checking frontend dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules exists"
else
    echo "   ❌ node_modules NOT found"
    echo "   Run: npm install"
fi
echo ""

# Check if new files exist
echo "5️⃣ Verifying new files created..."
files=(
    "src/contexts/TenantContext.tsx"
    "src/components/navbar/TenantBadge.tsx"
    "MULTI_TENANT_SETUP.md"
    "IMPLEMENTATION_SUMMARY.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file exists"
    else
        echo "   ❌ $file NOT found"
    fi
done
echo ""

# Check if frontend is running
echo "6️⃣ Checking frontend availability..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on port 5173"
elif curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on port 3000"
else
    echo "   ❌ Frontend NOT running"
    echo "   Run: npm run dev"
fi
echo ""

echo "===================================================="
echo "🎯 Next Steps:"
echo ""
echo "1. Start backend (if not running):"
echo "   cd ../backend/clinic_backend"
echo "   python manage.py runserver"
echo ""
echo "2. Start frontend (if not running):"
echo "   npm run dev"
echo ""
echo "3. Test multi-tenant login:"
echo "   Open: http://mansour.localhost:5173/auth/sign-in"
echo "   Login: dr_mansour / password123"
echo ""
echo "4. Check browser console for logs:"
echo "   Look for: 🏥 Tenant Detection"
echo "             🔐 Login Attempt"
echo "             🚀 API Request"
echo ""
echo "📚 Read MULTI_TENANT_SETUP.md for detailed instructions"
echo "===================================================="
