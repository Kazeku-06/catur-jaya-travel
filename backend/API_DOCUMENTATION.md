# API Documentation - Catur Jaya Travel (v1.2)

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

API menggunakan Laravel Sanctum. Masukkan token di Header:
`Authorization: Bearer {token}`

---

## 1. Authentication Endpoints

### Login

- **URL**: `POST /api/v1/auth/login`
- **Body**:
    ```json
    {
        "email": "admin@caturjaya.com",
        "password": "admin123"
    }
    ```

### Register

- **URL**: `POST /api/v1/auth/register`
- **Body**: `name, email, password, password_confirmation`

### Forgot Password

- **URL**: `POST /api/v1/auth/forgot-password`
- **Rate Limit**: 5 requests per 10 minutes
- **Body**:
    ```json
    {
        "email": "user@example.com"
    }
    ```
- **Response**: Always returns success message for security
    ```json
    {
        "message": "Jika email terdaftar, link reset password telah dikirim."
    }
    ```

### Reset Password

- **URL**: `POST /api/v1/auth/reset-password`
- **Body**:
    ```json
    {
        "email": "user@example.com",
        "token": "TOKEN_FROM_EMAIL",
        "password": "new_password",
        "password_confirmation": "new_password"
    }
    ```
- **Response**:
    ```json
    {
        "message": "Password berhasil direset. Silakan login ulang."
    }
    ```

---

## 2. Catalog (Public & Admin)

### Paket Trip (Wisata)

- **Endpoints**:
    - `GET /api/v1/trips` (Public)
    - `GET /api/v1/admin/trips` (Admin)
- **Key Fields**:
    - `rundown`: Array of objects `[{"time": "05:00", "activity": "Sunrise"}]`
    - `facilities`: Array of strings `["Jeep 4x4", "Makan"]`
    - `image_url`: Full URL ke gambar.

### Travel (Antar Kota)

- **Endpoints**:
    - `GET /api/v1/travels` (Public)
    - `GET /api/v1/admin/travels` (Admin)
- **Key Fields**:
    - `origin`, `destination`, `vehicle_type`, `price_per_person`.

---

## 3. Booking System (User)

Tujuan utama sistem ini adalah mencatat pesanan sebelum pembayaran divalidasi.

### Membuat Booking (Trip)

- **URL**: `POST /api/v1/bookings/trip/{trip_id}`
- **Body**:
    ```json
    {
        "nama_pemesan": "Budi",
        "nomor_hp": "0812...",
        "tanggal_keberangkatan": "2026-05-10",
        "participants": 2,
        "catatan_tambahan": "Minta kursi depan"
    }
    ```

### Membuat Booking (Travel)

- **URL**: `POST /api/v1/bookings/travel/{travel_id}`
- **Body**: `nama_pemesan, nomor_hp, tanggal_keberangkatan, passengers, catatan_tambahan`

### Pesanan Saya (User)

- **List All**: `GET /api/v1/bookings/my`
- **Detail**: `GET /api/v1/bookings/{id}`
- **Download Tiket**: `GET /api/v1/bookings/{id}/download-ticket`
    - _Catatan_: Hanya bisa diunduh jika status sudah `lunas`.

### Upload Bukti Pembayaran

- **URL**: `POST /api/v1/bookings/{booking_id}/payment-proof`
- **Body** (Multipart/Form-Data):
    - `payment_proof`: File (Image)
    - `bank_name`: string (opsional)

---

## 4. Admin Management (Booking & Validasi)

### List Semua Booking

- **URL**: `GET /api/v1/admin/bookings`
- **Query Params**: `status`, `search`, `page`

### Approval Pembayaran

- **Approve**: `POST /api/v1/admin/bookings/{id}/approve`
- **Reject**: `POST /api/v1/admin/bookings/{id}/reject`
    - Body (Reject): `{"reason": "Gambar tidak jelas"}`

### Statistik Dashboard

- **URL**: `GET /api/v1/admin/bookings/statistics`
- **Output**: Total revenue, jumlah lunas, jumlah menunggu validasi, dll.

---

## 5. Field Penting Booking

Setiap objek `Booking` sekarang memiliki field tambahan:

- `booking_code`: Kode unik (contoh: `TKT-ABC123XY`) untuk verifikasi.
- `can_download_ticket`: Boolean (true jika status `lunas`).

---

## Image Handling (Khusus Admin CRUD)

Saat melakukan **CREATE** atau **UPDATE** Trip/Travel melalui Admin API, kamu bisa mengirim gambar dengan 2 cara di JSON:

1. **Base64**:
    ```json
    {
        "image_base64": "data:image/jpeg;base64,...",
        "image_name": "foto-bromo.jpg"
    }
    ```
2. **URL**:
    ```json
    {
        "image_url": "https://img.com/gambar.jpg"
    }
    ```

---

**Last Updated**: 2026-02-02 (Post-Pull Updates)
**Status**: Stable & Secure
