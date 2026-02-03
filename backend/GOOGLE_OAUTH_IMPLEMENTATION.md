# Google OAuth 2.0 Implementation - Catur Jaya Travel

## 📋 Overview
Implementasi Google OAuth 2.0 Login untuk backend aplikasi travel menggunakan Laravel Socialite dan Laravel Sanctum.

## 🔧 Komponen yang Diimplementasikan

### 1. Database Migration
- **File**: `database/migrations/2026_02_03_035925_add_google_oauth_to_users_table.php`
- **File**: `database/migrations/2026_02_03_040335_make_password_nullable_in_users_table.php`
- **Kolom Baru**:
  - `google_id` VARCHAR NULL - ID unik dari Google
  - `auth_provider` ENUM('local','google') DEFAULT 'local' - Provider autentikasi
  - `password` NULLABLE - Password opsional untuk user Google

### 2. User Model Update
- **File**: `app/Models/User.php`
- **Method Baru**:
  - `isGoogleUser()` - Cek apakah user menggunakan Google auth
  - `isLocalUser()` - Cek apakah user menggunakan local auth
  - `scopeGoogleUsers()` - Query scope untuk Google users
  - `scopeLocalUsers()` - Query scope untuk local users

### 3. Google Auth Controller
- **File**: `app/Http/Controllers/Api/V1/Auth/GoogleAuthController.php`
- **Methods**:
  - `redirect()` - Redirect ke Google OAuth
  - `callback()` - Handle callback dari Google
  - `redirectWithError()` - Handle error redirect

### 4. Routes API
- **File**: `routes/api.php`
- **Endpoints Baru**:
  - `GET /api/v1/auth/google/redirect` - Redirect ke Google
  - `GET /api/v1/auth/google/callback` - Callback dari Google

### 5. Configuration
- **File**: `config/services.php` - Konfigurasi Google OAuth
- **File**: `.env` - Environment variables untuk Google credentials

### 6. Auth Controller Update
- **File**: `app/Http/Controllers/Api/V1/Auth/AuthController.php`
- **Update**: Validasi Google user untuk forgot/reset password

## 🔐 Keamanan yang Diimplementasikan

### 1. Password Reset Protection
```php
// Mencegah Google user menggunakan forgot password
if ($user && $user->isGoogleUser()) {
    return response()->json([
        'message' => 'Akun ini menggunakan login Google. Silakan login menggunakan Google.',
        'error' => 'GOOGLE_USER_RESET_NOT_ALLOWED'
    ], 400);
}
```

### 2. Admin Login Protection
```php
// Mencegah admin login via Google
if ($user->isAdmin()) {
    Log::warning('Admin attempted Google login', ['user_id' => $user->id]);
    return $this->redirectWithError('ADMIN_NOT_ALLOWED', 'Admin tidak dapat login menggunakan Google');
}
```

### 3. Data Validation
- Email dan Google ID wajib ada
- Validasi state OAuth untuk mencegah CSRF
- Error handling yang aman tanpa expose internal details

## 🚀 Flow Implementasi

### STEP 1: Redirect ke Google
```
GET /api/v1/auth/google/redirect
```
- Menggunakan Laravel Socialite
- Scope: email, profile
- Redirect ke Google OAuth consent screen

### STEP 2: Callback dari Google
```
GET /api/v1/auth/google/callback
```
**Proses:**
1. Ambil data user dari Google (google_id, name, email)
2. Cek user berdasarkan email:
   - **Jika BELUM ADA**: Buat user baru dengan auth_provider='google'
   - **Jika SUDAH ADA**: Update google_id dan auth_provider jika perlu
3. Validasi bukan admin
4. Buat Sanctum token
5. Redirect ke frontend dengan token

### STEP 3: Frontend Callback
```
http://localhost:3000/oauth/callback?token=XXX
```

## 📝 Konfigurasi Google OAuth

### 1. Google Cloud Console Setup
```
Authorized JavaScript Origins:
- http://localhost
- http://localhost:8000

Authorized Redirect URI:
- http://localhost:8000/auth/google/callback
```

### 2. Environment Variables
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback
```

## 🔄 User Data Flow

### Google User Creation
```php
User::create([
    'name' => $googleUser->getName(),
    'email' => $googleUser->getEmail(),
    'google_id' => $googleUser->getId(),
    'auth_provider' => 'google',
    'role' => 'user',
    'password' => null,
]);
```

### Existing User Update
```php
$updateData = [];
if (!$user->google_id) {
    $updateData['google_id'] = $googleUser->getId();
}
if ($user->auth_provider === 'local') {
    $updateData['auth_provider'] = 'google';
}
$user->update($updateData);
```

## ⚠️ Error Handling

### 1. OAuth Errors
- `INVALID_STATE` - Sesi OAuth tidak valid
- `DATA_INCOMPLETE` - Data Google tidak lengkap
- `OAUTH_ERROR` - Error umum OAuth

### 2. Business Logic Errors
- `ADMIN_NOT_ALLOWED` - Admin tidak boleh login via Google
- `GOOGLE_USER_RESET_NOT_ALLOWED` - Google user tidak bisa reset password

### 3. Redirect Error Format
```
http://localhost:3000/oauth/callback?error=ERROR_CODE&message=Error+Message
```

## 🧪 Testing

### 1. Test Script
```bash
php test_google_oauth.php
```

### 2. Manual Testing
1. Set Google credentials di `.env`
2. Visit: `http://localhost:8000/api/v1/auth/google/redirect`
3. Complete Google login
4. Check callback dengan token

### 3. Unit Testing Areas
- User model methods
- Controller redirect/callback
- Error handling
- Security validations

## 📊 Database Schema

### Users Table Structure
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NULL,
    google_id VARCHAR(255) NULL,
    auth_provider ENUM('local','google') DEFAULT 'local',
    role ENUM('user','admin') DEFAULT 'user',
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX(google_id),
    INDEX(auth_provider)
);
```

## 🔗 Integration Points

### 1. Existing Auth System
- Login email/password tetap berfungsi
- Reset password tetap ada untuk local users
- Role system (user/admin) tetap berlaku
- Middleware auth:sanctum tetap digunakan

### 2. Frontend Integration
- Token dikirim via URL parameter
- Error handling via URL parameters
- Consistent dengan existing auth flow

## 🚦 Production Checklist

- [ ] Set real Google OAuth credentials
- [ ] Update authorized domains di Google Console
- [ ] Set production frontend URL
- [ ] Enable HTTPS untuk production
- [ ] Monitor OAuth logs
- [ ] Test error scenarios
- [ ] Validate security measures

## 📈 Monitoring & Logs

### Log Events
- Google OAuth redirect initiated
- Google user data received
- User creation/update
- Token generation
- Error scenarios
- Security violations (admin login attempts)

### Key Metrics
- Google login success rate
- User conversion (new vs existing)
- Error frequency by type
- Admin login attempt blocks

## 🔧 Maintenance

### Regular Tasks
- Monitor Google OAuth quotas
- Update Google credentials if needed
- Review security logs
- Clean up expired tokens
- Monitor user auth_provider distribution

### Troubleshooting
1. **OAuth redirect fails**: Check Google credentials
2. **Callback errors**: Verify redirect URI configuration
3. **Token issues**: Check Sanctum configuration
4. **User creation fails**: Verify database schema

---

## ✅ Implementation Status: COMPLETED

**Semua komponen telah diimplementasikan sesuai spesifikasi:**
- ✅ Laravel Socialite installed
- ✅ Database migration completed
- ✅ User model updated
- ✅ Google Auth Controller created
- ✅ API routes configured
- ✅ Security measures implemented
- ✅ Error handling complete
- ✅ Testing script available
- ✅ Documentation complete

**Ready for Google OAuth credentials and production deployment.**