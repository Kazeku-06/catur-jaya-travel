<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Catur Jaya Travel</title>
    <style>
        /* Reset & Base Styling */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #334155; /* Slate-700 untuk teks yang lebih soft */
            background-color: #f8fafc; /* Biru sangat muda (slate-50) */
            padding: 40px 15px;
            min-height: 100vh;
        }

        .email-wrapper {
            max-width: 550px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }

        /* Header - Biru Profesional */
        .header {
            background-color: #1e40af; /* Deep Blue */
            color: white;
            padding: 40px 30px;
            text-align: center;
        }

        .logo {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            letter-spacing: -0.5px;
        }

        .logo-icon {
            font-size: 24px;
        }

        .subtitle {
            font-size: 14px;
            color: #bfdbfe; /* Light blue text */
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Content Area */
        .content {
            padding: 40px 35px;
        }

        .greeting {
            font-size: 20px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 16px;
        }

        .message {
            font-size: 15px;
            color: #475569;
            margin-bottom: 24px;
            line-height: 1.7;
        }

        /* Button - Konsisten Biru */
        .button-container {
            text-align: center;
            margin: 35px 0;
        }

        .button {
            display: inline-block;
            background-color: #2563eb; /* Primary Blue */
            color: #ffffff !important;
            padding: 16px 36px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 15px;
            transition: background-color 0.2s;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        /* Link Box */
        .url-box {
            background-color: #f1f5f9;
            border: 1px dashed #cbd5e1;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            word-break: break-all;
            font-family: 'ui-monospace', monospace;
            font-size: 12px;
            color: #64748b;
            text-align: center;
        }

        /* Info Section - Lebih Clean */
        .info-section {
            margin-top: 35px;
            padding: 24px;
            background-color: #eff6ff; /* Background biru sangat muda */
            border-radius: 12px;
        }

        .info-title {
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            text-transform: uppercase;
        }

        .info-list {
            list-style: none;
            color: #1e40af;
            font-size: 14px;
        }

        .info-list li {
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
            opacity: 0.9;
        }

        .info-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            font-weight: bold;
        }

        /* Footer */
        .footer {
            background-color: #f8fafc;
            padding: 35px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }

        .footer-content {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 12px;
            line-height: 1.6;
        }

        .footer-links {
            margin: 20px 0;
            display: flex;
            justify-content: center;
            gap: 20px;
        }

        .footer-link {
            color: #1e40af;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
        }

        .copyright {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 20px;
        }

        /* Mobile Optimization */
        @media (max-width: 600px) {
            .content { padding: 30px 20px; }
            .header { padding: 30px 20px; }
            .button { width: 100%; text-align: center; }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="header">
            <div class="logo">
                <span class="logo-icon"></span>
                Catur Jaya Travel
            </div>
            <div class="subtitle">Permintaan Reset Password</div>
        </div>

        <div class="content">
            <div class="greeting">
                Halo, {{ $user->name }}
            </div>

            <div class="message">
                Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda. Silakan klik tombol di bawah untuk melanjutkan.
            </div>

            <div class="button-container">
                <a href="{{ $reset_url }}" class="button">
                    Reset Password
                </a>
            </div>

            <div class="message" style="text-align:center; font-size:13px; color:#94a3b8; margin-bottom: 10px;">
                Atau salin link berikut ke browser Anda:
            </div>

            <div class="url-box">
                {{ $reset_url }}
            </div>

            <div class="message" style="font-size: 14px;">
                Jika Anda tidak meminta reset password, abaikan saja email ini. Keamanan akun Anda tetap terjaga.
            </div>

            <div class="info-section">
                <div class="info-title">
                     Informasi Penting
                </div>
                <ul class="info-list">
                    <li>Link berlaku selama <strong>{{ $expiry_minutes }} menit</strong></li>
                    <li>Hanya dapat digunakan <strong>satu kali</strong></li>
                    <li>Setelah reset, Anda akan logout dari perangkat lain demi keamanan</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <div class="footer-content">
                <strong>Catur Jaya Travel</strong><br>
                Mewujudkan Perjalanan Impian Anda ke Seluruh Nusantara
            </div>

            <div class="footer-links">
                <a href="#" class="footer-link">Website</a>
                <a href="#" class="footer-link">Bantuan</a>
                <a href="#" class="footer-link">Kebijakan Privasi</a>
            </div>

            <div class="footer-content" style="font-size: 11px; margin-top: 15px;">
                Email ini dikirim secara otomatis oleh sistem keamanan Catur Jaya Travel.
            </div>

            <div class="copyright">
                &copy; {{ date('Y') }} Catur Jaya Travel. Hak Cipta Dilindungi.
            </div>
        </div>
    </div>
</body>
</html>