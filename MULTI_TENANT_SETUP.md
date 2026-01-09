# Multi-Tenant Development Setup Guide

## 🏥 Testing Multi-Tenant Authentication

### 1. Configure Hosts File (macOS)

```bash
sudo nano /etc/hosts
```

Add these lines:
```
127.0.0.1 atlas.localhost
127.0.0.1 mansour.localhost
127.0.0.1 clinic1.localhost
```

Save and exit (Ctrl+X, then Y, then Enter)

### 2. Start Backend (Terminal 1)

```bash
cd backend/clinic_backend
python manage.py runserver
```

Backend will be available on:
- **Public schema**: http://localhost:8000
- **Atlas tenant**: http://atlas.localhost:8000
- **Mansour tenant**: http://mansour.localhost:8000

### 3. Start Frontend (Terminal 2)

```bash
cd frontend/clinic_frontend
npm run dev
```

Frontend runs on port 5173 (or 3000 depending on config)

### 4. Access Multi-Tenant URLs

#### ✅ Correct Access (Tenant Schema):
- **Atlas Clinic**: http://atlas.localhost:5173
- **Mansour Clinic**: http://mansour.localhost:5173

#### ⚠️ Wrong Access (Public Schema):
- http://localhost:5173 → Will show warning banner

## 🔐 Testing Authentication Flow

### Test Users (from seed_mansour command):

**Mansour Clinic** (ID: 2)
- Username: `dr_mansour`
- Password: `password123`
- Access URL: http://mansour.localhost:5173/auth/sign-in

**Atlas Clinic** (ID: 1)
- Username: `dr_atlas` (check your seed data)
- Password: `password123`
- Access URL: http://atlas.localhost:5173/auth/sign-in

### Expected Behavior:

1. **Correct Clinic Access**:
   - Visit http://mansour.localhost:5173/auth/sign-in
   - Login with `dr_mansour` / `password123`
   - ✅ Should succeed and redirect to dashboard
   - 🏥 Navbar shows "Mansour" clinic badge

2. **Cross-Tenant Prevention**:
   - Visit http://atlas.localhost:5173/auth/sign-in
   - Try logging in with `dr_mansour` / `password123`
   - ❌ Backend rejects: "Accès refusé: Ce compte n'appartient pas à ce cabinet."

3. **Public Schema Warning**:
   - Visit http://localhost:5173/auth/sign-in
   - ⚠️ Yellow banner warns you're on public schema
   - Login will likely fail (users belong to tenant schemas)

## 🐛 Debugging Multi-Tenant Issues

### Browser Console Logs to Watch:

**Tenant Detection** (on page load):
```
🏥 Tenant Detection: {
  hostname: "mansour.localhost",
  subdomain: "mansour",
  isPublic: false
}
```

**API Requests** (on any API call):
```
🚀 API Request: {
  path: "http://mansour.localhost:8000/api/auth/login/",
  schema: "mansour",
  tenant: "mansour"
}
```

**Login Success**:
```
🔐 Login Attempt: { username: "dr_mansour", subdomain: "mansour" }
✅ Tenant Validation: { userClinicId: 2, currentSubdomain: "mansour", ... }
💾 Storing auth data: { username: "dr_mansour", role: "DOCTOR", clinic_id: 2 }
```

### Backend Console Logs:

Look for these in your Django terminal:

```
[TENANT] URLS LOADED (Clinic Schema)
SECURITY BREACH BLOCKED: User dr_mansour (Clinic 2) tried to login to atlas (ID 1).
```

## 🔧 Common Issues & Fixes

### Issue: "Cannot connect to mansour.localhost"

**Cause**: Hosts file not configured or browser caching

**Fix**:
1. Verify /etc/hosts has `127.0.0.1 mansour.localhost`
2. Restart browser
3. Try `ping mansour.localhost` in terminal (should resolve to 127.0.0.1)

### Issue: "CORS error" when accessing subdomain

**Cause**: Django CORS settings don't include subdomain

**Fix**: Update [core/settings.py](../backend/clinic_backend/core/settings.py):
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://atlas.localhost:5173",
    "http://mansour.localhost:5173",
    "http://clinic1.localhost:5173",
]

# Or allow all subdomains:
CORS_ALLOW_ALL_ORIGINS = True  # Only for development!
```

### Issue: "Wrong clinic shows in badge"

**Cause**: localStorage has stale clinic_id from previous session

**Fix**:
1. Open DevTools → Application → Local Storage
2. Delete `surgery-auth-storage` and `clinic_id` keys
3. Hard refresh page (Cmd+Shift+R)

### Issue: Login succeeds but dashboard shows no data

**Cause**: User authenticated but API calls hitting wrong schema

**Fix**: Check browser console for API request logs. The `schema` field should match your subdomain.

## 📋 Quick Test Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173 (or 3000)
- [ ] `/etc/hosts` configured with clinic subdomains
- [ ] Can access http://mansour.localhost:5173
- [ ] Can access http://atlas.localhost:5173
- [ ] Login on correct subdomain succeeds
- [ ] Login on wrong subdomain fails with permission error
- [ ] Tenant badge shows correct clinic name
- [ ] API calls include tenant in logs
- [ ] Logout clears localStorage completely

## 🚀 Production Considerations

In production, you'll use real domains:
- Main site: https://app.dentalclinic.com (public schema - clinic selection)
- Atlas: https://atlas.dentalclinic.com (tenant schema)
- Mansour: https://mansour.dentalclinic.com (tenant schema)

Update axios baseURL in production:
```typescript
baseURL: `https://${window.location.hostname}/api`
```

## 📚 Architecture Reference

See [.github/copilot-instructions.md](.github/copilot-instructions.md) for full backend architecture details.
