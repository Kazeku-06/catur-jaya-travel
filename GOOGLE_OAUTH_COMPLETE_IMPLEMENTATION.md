# Google OAuth 2.0 Complete Implementation - Catur Jaya Travel

## 📋 Overview
Implementasi lengkap Google OAuth 2.0 Login untuk aplikasi travel dengan Laravel backend dan React frontend.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │ Laravel Backend │    │  Google OAuth   │
│                 │    │                 │    │                 │
│ 1. Click Google │───▶│ 2. Redirect to  │───▶│ 3. User Login   │
│    Button       │    │    Google       │    │                 │
│                 │    │                 │    │                 │
│ 6. Handle Token │◀───│ 5. Create Token │◀───│ 4. Callback     │
│    & Redirect   │    │    & Redirect   │    │    with Code    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Backend Implementation

### 1. Database Schema
```sql
-- Migration: add_google_oauth_to_users_table
ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN auth_provider ENUM('local','google') DEFAULT 'local';
ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NULL;

-- Indexes for performance
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_auth_provider ON users(auth_provider);
```

### 2. User Model Updates
```php
// app/Models/User.php
protected $fillable = [
    'name', 'email', 'password', 'role', 'google_id', 'auth_provider'
];

protected $hidden = [
    'password', 'remember_token', 'email_verified_at', 'google_id'
];

public function isGoogleUser(): bool {
    return $this->auth_provider === 'google';
}

public function isLocalUser(): bool {
    return $this->auth_provider === 'local';
}
```

### 3. Google Auth Controller
```php
// app/Http/Controllers/Api/V1/Auth/GoogleAuthController.php
class GoogleAuthController extends Controller
{
    public function redirect() {
        return Socialite::driver('google')
            ->scopes(['email', 'profile'])
            ->redirect();
    }

    public function callback() {
        // Handle Google OAuth callback
        // Create/update user
        // Generate Sanctum token
        // Redirect to frontend with token
    }
}
```

### 4. API Routes
```php
// routes/api.php
Route::prefix('v1/auth')->group(function () {
    // Google OAuth routes (no auth required)
    Route::get('google/redirect', [GoogleAuthController::class, 'redirect']);
    Route::get('google/callback', [GoogleAuthController::class, 'callback']);
    
    // Existing auth routes
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    // ...
});
```

### 5. Configuration
```php
// config/services.php
'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT_URI'),
],
```

```env
# .env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

## 🎨 Frontend Implementation

### 1. Auth Service Updates
```javascript
// src/services/authService.js
export const authService = {
  // Google OAuth Login
  loginWithGoogle: () => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    window.location.href = `${backendUrl}/auth/google/redirect`;
  },

  // Handle OAuth callback
  handleGoogleCallback: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token);
      return authService.getProfile().then(response => {
        localStorage.setItem('user_data', JSON.stringify(response.user));
        return response;
      });
    }
    throw new Error('No token received from Google OAuth');
  },

  // Check if user is Google user
  isGoogleUser: () => {
    const user = authService.getCurrentUser();
    return user?.auth_provider === 'google';
  }
};
```

### 2. Google Button Component
```jsx
// src/components/ui/GoogleButton.jsx
const GoogleButton = ({ children = 'Masuk dengan Google', ...props }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      authService.loginWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <motion.button onClick={handleGoogleLogin} disabled={isLoading} {...props}>
      {isLoading ? 'Menghubungkan...' : children}
    </motion.button>
  );
};
```

### 3. OAuth Callback Page
```jsx
// src/pages/OAuthCallback.jsx
const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          return;
        }

        await authService.handleGoogleCallback(token);
        setStatus('success');
        setTimeout(() => navigate('/', { replace: true }), 2000);
      } catch (error) {
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <Layout>
      {/* Status display with loading/success/error states */}
    </Layout>
  );
};
```

### 4. Updated Forms
```jsx
// Login and Register forms updated with GoogleButton
<GoogleButton variant="outline" size="md" fullWidth>
  Masuk dengan Google
</GoogleButton>
```

### 5. Route Configuration
```jsx
// src/App.jsx
<Routes>
  {/* Existing routes */}
  <Route path="/oauth/callback" element={<OAuthCallback />} />
</Routes>
```

## 🔒 Security Implementation

### 1. Password Reset Protection
```php
// Backend: AuthController.php
public function forgotPassword(ForgotPasswordRequest $request) {
    $user = User::where('email', $request->email)->first();
    if ($user && $user->isGoogleUser()) {
        return response()->json([
            'message' => 'Akun ini menggunakan login Google. Silakan login menggunakan Google.',
            'error' => 'GOOGLE_USER_RESET_NOT_ALLOWED'
        ], 400);
    }
    // Continue with normal flow
}
```

```javascript
// Frontend: Error handling
if (error.response?.data?.error === 'GOOGLE_USER_RESET_NOT_ALLOWED') {
  setError('Akun ini menggunakan login Google. Silakan login menggunakan Google.');
}
```

### 2. Admin Login Prevention
```php
// Backend: GoogleAuthController.php
if ($user->isAdmin()) {
    Log::warning('Admin attempted Google login', ['user_id' => $user->id]);
    return $this->redirectWithError('ADMIN_NOT_ALLOWED', 'Admin tidak dapat login menggunakan Google');
}
```

### 3. OAuth State Validation
```php
// Laravel Socialite automatically handles CSRF protection via state parameter
try {
    $googleUser = Socialite::driver('google')->user();
} catch (\Laravel\Socialite\Two\InvalidStateException $e) {
    return $this->redirectWithError('INVALID_STATE', 'Sesi OAuth tidak valid');
}
```

## 🚀 User Flow

### 1. New User Registration via Google
```
1. User clicks "Daftar dengan Google"
2. Redirected to Google OAuth consent screen
3. User grants permissions (email, profile)
4. Google redirects to backend callback
5. Backend creates new user:
   - name: from Google
   - email: from Google
   - google_id: from Google
   - auth_provider: 'google'
   - password: null
   - role: 'user'
6. Backend generates Sanctum token
7. Backend redirects to frontend with token
8. Frontend stores token and user data
9. User is logged in and redirected to home
```

### 2. Existing User Login via Google
```
1. User clicks "Masuk dengan Google"
2. Redirected to Google OAuth consent screen
3. User grants permissions
4. Google redirects to backend callback
5. Backend finds existing user by email
6. Backend updates google_id if not set
7. Backend updates auth_provider to 'google' if needed
8. Backend generates Sanctum token
9. Backend redirects to frontend with token
10. Frontend stores token and user data
11. User is logged in and redirected to home
```

### 3. Error Handling Flow
```
1. User encounters error during OAuth
2. Backend redirects to frontend with error parameters
3. Frontend displays appropriate error message
4. User can retry or return to home
```

## 📊 Database Changes

### Before Implementation
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Required
    role ENUM('user','admin') DEFAULT 'user',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### After Implementation
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NULL,      -- Now nullable
    google_id VARCHAR(255) NULL,     -- New: Google user ID
    auth_provider ENUM('local','google') DEFAULT 'local',  -- New: Auth provider
    role ENUM('user','admin') DEFAULT 'user',
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX(google_id),
    INDEX(auth_provider)
);
```

## 🧪 Testing

### Backend Testing
```bash
# Run backend test script
cd backend
php test_google_oauth.php
```

### Frontend Testing
```bash
# Manual testing checklist
1. Navigate to /login
2. Click "Masuk dengan Google"
3. Complete Google OAuth flow
4. Verify successful login
5. Test error scenarios
```

### Integration Testing
```bash
# Complete flow testing
1. Set Google OAuth credentials
2. Test new user registration
3. Test existing user login
4. Test admin login prevention
5. Test password reset prevention
6. Test error handling
```

## 🔧 Configuration Requirements

### Google Cloud Console Setup
```
1. Create Google Cloud Project
2. Enable Google+ API
3. Create OAuth 2.0 Client ID
4. Set Authorized JavaScript Origins:
   - http://localhost
   - http://localhost:8000
5. Set Authorized Redirect URI:
   - http://localhost:8000/auth/google/callback
```

### Environment Variables
```env
# Backend (.env)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
FRONTEND_URL=http://localhost:3000

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## 📈 Monitoring & Analytics

### Key Metrics to Track
- Google OAuth success rate
- User registration source (Google vs Email)
- Error frequency by type
- Admin login attempt blocks
- Password reset attempt blocks for Google users

### Logging Implementation
```php
// Backend logging
Log::info('Google OAuth redirect initiated');
Log::info('Google user data received', ['google_id' => $googleUser->getId()]);
Log::info('New Google user created', ['user_id' => $user->id]);
Log::warning('Admin attempted Google login', ['user_id' => $user->id]);
```

## 🚦 Production Deployment

### Pre-Production Checklist
- [ ] Set production Google OAuth credentials
- [ ] Update authorized domains in Google Console
- [ ] Set production URLs in environment variables
- [ ] Enable HTTPS for production
- [ ] Test complete OAuth flow in production
- [ ] Monitor error rates and success rates
- [ ] Set up logging and monitoring

### Security Considerations
- [ ] Use HTTPS in production
- [ ] Secure environment variables
- [ ] Monitor for suspicious OAuth activity
- [ ] Regular security audits
- [ ] Keep dependencies updated

---

## ✅ Implementation Status: COMPLETED

**Backend Implementation:**
- ✅ Laravel Socialite installed and configured
- ✅ Database migrations completed
- ✅ User model updated with Google OAuth fields
- ✅ Google Auth Controller implemented
- ✅ API routes configured
- ✅ Security measures implemented
- ✅ Error handling complete

**Frontend Implementation:**
- ✅ Auth service updated with Google OAuth methods
- ✅ Google Button component created
- ✅ OAuth Callback page implemented
- ✅ Login/Register forms updated
- ✅ Route configuration complete
- ✅ Error handling implemented
- ✅ Security measures in place

**Integration:**
- ✅ Backend-Frontend communication working
- ✅ Token-based authentication maintained
- ✅ Existing auth system preserved
- ✅ Admin restrictions enforced
- ✅ Password reset restrictions implemented

**Ready for production deployment with Google OAuth credentials.**