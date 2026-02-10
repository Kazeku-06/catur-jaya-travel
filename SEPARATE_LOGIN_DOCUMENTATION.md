# Dokumentasi: Pemisahan Login Admin dan User

## Overview
Sistem login telah dipisahkan menjadi 2 halaman berbeda untuk meningkatkan keamanan:
- **Login User**: `/login` - Untuk pelanggan/user biasa
- **Login Admin**: `/veteran` - Untuk administrator (URL tersembunyi)

## Perubahan yang Dilakukan

### 1. Halaman Login Baru

#### A. Login User (`/login`)
- **File**: `frontend/src/pages/Login.jsx`
- **Akses**: Semua orang
- **Validasi**: Admin **TIDAK BISA** login di halaman ini
- **Redirect**: Jika admin mencoba login, akan muncul error: "Akun admin tidak dapat login di sini. Silakan gunakan halaman login admin."

#### B. Login Admin (`/veteran`)
- **File**: `frontend/src/pages/AdminLogin.jsx`
- **Akses**: URL tersembunyi untuk keamanan
- **Validasi**: Hanya user dengan role `admin` yang bisa login
- **Redirect**: Jika user biasa mencoba login, akan muncul error: "Akses ditolak. Halaman ini khusus untuk admin."
- **Design**: Tampilan berbeda dengan tema dark/professional untuk admin

### 2. Update Routing

#### App.jsx
```javascript
// Route untuk user login
<Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

// Route untuk admin login (URL tersembunyi)
<Route path="/veteran" element={<PublicRoute><AdminLogin /></PublicRoute>} />
```

#### AdminRoute Component
- Redirect ke `/veteran` jika admin belum login (sebelumnya ke `/login`)
- Validasi role admin tetap sama

### 3. Validasi Login

#### Login User (frontend/src/pages/Login.jsx)
```javascript
// Blokir admin
if (user.role === 'admin') {
  throw new Error('Akun admin tidak dapat login di sini. Silakan gunakan halaman login admin.');
}
```

#### Login Admin (frontend/src/pages/AdminLogin.jsx)
```javascript
// Hanya izinkan admin
if (user.role !== 'admin') {
  setError('Akses ditolak. Halaman ini khusus untuk admin.');
  return;
}
```

## Cara Menggunakan

### Untuk User Biasa:
1. Kunjungi: `http://localhost:3000/login`
2. Login dengan akun user biasa
3. Akan diarahkan ke halaman home atau halaman sebelumnya

### Untuk Admin:
1. Kunjungi: `http://localhost:3000/veteran`
2. Login dengan akun admin
3. Akan diarahkan ke `/admin` dashboard

## Fitur Keamanan

### 1. URL Tersembunyi
- Admin login menggunakan URL `/veteran` yang tidak mudah ditebak
- Tidak ada link publik yang mengarah ke halaman admin login
- Mengurangi risiko brute force attack

### 2. Role-Based Validation
- Validasi dilakukan di frontend sebelum menyimpan token
- Admin tidak bisa login di halaman user
- User tidak bisa login di halaman admin

### 3. Visual Distinction
- Halaman admin login memiliki design berbeda (dark theme)
- Warning message untuk akses tidak sah
- Indikator "Restricted Access Only"

### 4. Redirect Logic
- Admin yang belum login diarahkan ke `/veteran`
- User yang belum login diarahkan ke `/login`
- Setelah login, redirect ke halaman yang sesuai

## Testing

### Test Case 1: User Login di `/login`
✅ User biasa bisa login
❌ Admin tidak bisa login (error message muncul)

### Test Case 2: Admin Login di `/veteran`
✅ Admin bisa login
❌ User biasa tidak bisa login (error message muncul)

### Test Case 3: Akses Admin Route
- Tanpa login → Redirect ke `/veteran`
- Login sebagai user → Error 403
- Login sebagai admin → Akses granted

### Test Case 4: Akses User Route
- Tanpa login → Redirect ke `/login`
- Login sebagai admin → Bisa akses (admin bisa lihat halaman user)
- Login sebagai user → Akses granted

## Keuntungan

1. **Keamanan Lebih Baik**: URL admin tersembunyi mengurangi risiko serangan
2. **Pemisahan Concern**: Admin dan user memiliki flow login yang berbeda
3. **User Experience**: User tidak bingung dengan opsi admin
4. **Audit Trail**: Lebih mudah tracking siapa yang login dari mana
5. **Scalability**: Mudah menambahkan fitur khusus untuk masing-masing role

## Catatan Penting

⚠️ **Jangan share URL `/veteran` ke publik**
⚠️ **Pastikan backend juga melakukan validasi role**
⚠️ **Gunakan HTTPS di production untuk keamanan maksimal**

## File yang Diubah

1. ✅ `frontend/src/pages/Login.jsx` - Tambah validasi blokir admin
2. ✅ `frontend/src/pages/AdminLogin.jsx` - Halaman baru untuk admin
3. ✅ `frontend/src/App.jsx` - Tambah route `/veteran` dan update AdminRoute
4. ✅ `SEPARATE_LOGIN_DOCUMENTATION.md` - Dokumentasi ini

## Maintenance

Jika ingin mengubah URL admin login:
1. Update route di `App.jsx`
2. Update redirect di `AdminRoute` component
3. Update dokumentasi ini
4. Informasikan ke semua admin tentang URL baru
