# Web Travel Backend API

Backend aplikasi Web Travel yang menyediakan layanan Paket Trip, Travel antar kota, dan Carter Mobil dengan integrasi payment gateway Midtrans.

## 🚀 Teknologi Stack

- **Framework**: Laravel 12 (Latest Stable)
- **Database**: MySQL
- **Authentication**: Laravel Sanctum
- **Payment Gateway**: Midtrans Snap API
- **API Style**: RESTful API
- **API Versioning**: /api/v1
- **Architecture**: MVC + Service Layer
- **Authorization**: Role-Based Access Control (RBAC)
- **Primary Key**: UUID (bukan auto increment)

## 📋 Fitur Utama

### Untuk Guest (Belum Login)
- Melihat katalog Paket Trip, Travel, dan Carter Mobil
- Melihat detail setiap layanan
- Akses WhatsApp admin untuk Carter Mobil

### Untuk User (Sudah Login)
- Semua fitur Guest
- Membuat transaksi untuk Paket Trip dan Travel
- Pembayaran melalui Midtrans Snap
- Tracking status pembayaran

### Untuk Admin
- Login ke sistem admin
- CRUD Paket Trip, Travel, dan Carter Mobil
- Melihat semua transaksi dan statistik
- Monitoring pembayaran

## 🏗️ Arsitektur Sistem

### Database Schema
```
users (UUID)
├── paket_trips (UUID)
├── travels (UUID) 
├── carter_mobiles (UUID)
├── transactions (UUID)
└── payments (UUID)
```

### Service Layer
- **MidtransService**: Handle integrasi Midtrans
- **TransactionService**: Logic bisnis transaksi

### Security Layer
- **RoleMiddleware**: Role-based access control
- **Form Requests**: Validasi input
- **Sanctum**: API authentication

## 🛠️ Installation & Setup

### Prerequisites
- PHP 8.2+
- Composer
- MySQL
- Node.js & NPM

### 1. Clone & Install Dependencies
```bash
cd backend
composer install
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Database Configuration
Edit `.env` file:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=backend
DB_USERNAME=root
DB_PASSWORD=

# Midtrans Configuration
MIDTRANS_SERVER_KEY=your_server_key_here
MIDTRANS_CLIENT_KEY=your_client_key_here
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_IS_SANITIZED=true
MIDTRANS_IS_3DS=true
```

### 4. Database Migration & Seeding
```bash
php artisan migrate:fresh --seed
```

### 5. Run Development Server
```bash
php artisan serve
```

API akan tersedia di: `http://localhost:8000/api/v1`

## 📚 API Documentation

Lihat file `API_DOCUMENTATION.md` untuk dokumentasi lengkap API endpoints.

### Quick Test
```bash
# Test public endpoint
curl http://localhost:8000/api/v1/trips

# Test admin login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@travel.com","password":"password123"}'
```

## 🔐 Default Admin Account

```
Email: admin@travel.com
Password: password123
Role: admin
```

## 💳 Payment Flow

### 1. User Flow (Trip/Travel)
```
User Login → Select Item → Create Transaction → Get Snap Token → Payment → Callback → Status Update
```

### 2. Carter Mobil Flow
```
Guest/User → Select Carter → Get WhatsApp Contact → Direct Contact Admin
```

### 3. Payment Status
- `pending`: Menunggu pembayaran
- `paid`: Pembayaran berhasil
- `failed`: Pembayaran gagal
- `expired`: Pembayaran expired

## 🏛️ Struktur Folder

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/V1/
│   │   │   ├── Auth/AuthController.php
│   │   │   ├── PaketTripController.php
│   │   │   ├── TravelController.php
│   │   │   ├── CarterMobileController.php
│   │   │   ├── TransactionController.php
│   │   │   ├── PaymentController.php
│   │   │   └── Admin/
│   │   ├── Middleware/RoleMiddleware.php
│   │   └── Requests/
│   ├── Models/
│   │   ├── User.php
│   │   ├── PaketTrip.php
│   │   ├── Travel.php
│   │   ├── CarterMobile.php
│   │   ├── Transaction.php
│   │   └── Payment.php
│   ├── Services/
│   │   ├── MidtransService.php
│   │   └── TransactionService.php
│   └── Traits/HasUuid.php
├── config/midtrans.php
├── database/
│   ├── migrations/
│   └── seeders/
└── routes/api.php
```

## 🔒 Security Features

1. **Authentication**: Laravel Sanctum dengan Bearer token
2. **Authorization**: Role-based middleware (admin/user)
3. **Validation**: Form Request validation untuk semua input
4. **Password Security**: Bcrypt hashing
5. **Payment Security**: Midtrans signature verification
6. **Price Protection**: Server-side price calculation
7. **UUID**: Mencegah enumeration attack

## 🧪 Testing

### Manual Testing
```bash
# Test authentication
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@travel.com","password":"password123"}'

# Test protected endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/auth/me
```

### Database Testing
```bash
# Check sample data
php artisan tinker
>>> App\Models\PaketTrip::count()
>>> App\Models\User::where('role', 'admin')->first()
```

## 🚀 Production Deployment

### 1. Environment
```env
APP_ENV=production
APP_DEBUG=false
MIDTRANS_IS_PRODUCTION=true
```

### 2. Optimization
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
composer install --optimize-autoloader --no-dev
```

### 3. Security
- Setup SSL certificate
- Configure firewall
- Setup database backup
- Monitor logs

## 🔧 Troubleshooting

### Common Issues

1. **Migration Error**: Pastikan database sudah dibuat
2. **UUID Error**: Pastikan trait HasUuid sudah diimport
3. **Midtrans Error**: Periksa server key dan client key
4. **CORS Error**: Setup CORS untuk frontend integration

### Logs
```bash
tail -f storage/logs/laravel.log
```

## 📞 Support

Untuk pertanyaan teknis atau bug report, silakan buat issue di repository ini.

## 📄 License

MIT License
