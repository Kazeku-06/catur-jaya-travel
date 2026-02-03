<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Catur Jaya Travel</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f1f5f9;
            padding: 24px 12px;
            min-height: 100vh;
        }

        .email-wrapper {
            max-width: 520px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
        }

        .header {
            background: linear-gradient(135deg, #1e40af, #1e3a8a);
            color: white;
            padding: 32px 24px;
            text-align: center;
        }

        .logo {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .logo-icon {
            font-size: 22px;
        }

        .subtitle {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 300;
        }

        .content {
            padding: 40px 32px;
        }

        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 18px;
        }

        .message {
            font-size: 15px;
            color: #4b5563;
            margin-bottom: 22px;
            line-height: 1.7;
        }

        .button-container {
            text-align: center;
            margin: 34px 0;
        }

        .button {
            display: inline-block;
            background-color: #1e40af;
            color: #ffffff !important;
            padding: 14px 34px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 15px;
            letter-spacing: 0.3px;
        }

        .url-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 16px;
            margin: 24px 0;
            word-break: break-all;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            color: #475569;
            text-align: center;
        }

        .info-section {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
        }

        .info-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 15px;
        }

        .info-list {
            list-style: none;
            color: #4b5563;
            font-size: 14px;
        }

        .info-list li {
            margin-bottom: 8px;
            padding-left: 18px;
            position: relative;
        }

        .info-list li::before {
            content: '•';
            position: absolute;
            left: 6px;
            color: #9ca3af;
        }

        .footer {
            background-color: #f9fafb;
            padding: 26px 22px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }

        .footer-content {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 14px;
            line-height: 1.6;
        }

        .footer-links {
            margin-top: 16px;
            display: flex;
            justify-content: center;
            gap: 18px;
            flex-wrap: wrap;
        }

        .footer-link {
            color: #4b5563;
            text-decoration: none;
            font-size: 13px;
        }

        .copyright {
            margin-top: 18px;
            font-size: 12px;
            color: #9ca3af;
        }

        @media (max-width: 600px) {
            .email-wrapper {
                border-radius: 10px;
            }

            .header,
            .content,
            .footer {
                padding: 24px 18px;
            }

            .logo {
                font-size: 20px;
            }

            .greeting {
                font-size: 18px;
            }

            .button {
                padding: 12px 26px;
                font-size: 14px;
            }

            .footer-links {
                gap: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- Header Section -->
        <div class="header">
            <div class="logo">
                <span class="logo-icon">✈️</span>
                Catur Jaya Travel
            </div>
            <div class="subtitle">Permintaan Reset Password</div>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="greeting">
                Halo, {{ $user->name }}
            </div>

            <div class="message">
                Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda.
            </div>

            <div class="button-container">
                <a href="{{ $reset_url }}" class="button">
                    Reset Password
                </a>
            </div>

            <div class="message" style="text-align:center; font-size:14px; color:#6b7280;">
                Atau salin link berikut ke browser:
            </div>

            <div class="url-box">
                {{ $reset_url }}
            </div>

            <div class="message">
                Jika Anda tidak meminta reset password, tidak diperlukan tindakan lebih lanjut.
            </div>

            <!-- Information Section -->
            <div class="info-section">
                <div class="info-title">
                    ℹ️ Informasi Penting
                </div>
                <ul class="info-list">
                    <li>Link berlaku selama <strong>{{ $expiry_minutes }} menit</strong></li>
                    <li>Hanya dapat digunakan <strong>satu kali</strong></li>
                    <li>Setelah reset, Anda akan logout dari semua perangkat</li>
                </ul>
            </div>
        </div>

        <!-- Footer Section -->
        <div class="footer">
            <div class="footer-content">
                <strong>Catur Jaya Travel</strong><br>
                Mewujudkan Perjalanan Impian Anda
            </div>

            <div class="footer-content">
                Email ini dikirim secara otomatis. Mohon jangan membalas.
            </div>

            <div class="footer-links">
                <a href="#" class="footer-link">Website</a>
                <a href="#" class="footer-link">Bantuan</a>
                <a href="#" class="footer-link">Kebijakan Privasi</a>
            </div>

            <div class="copyright">
                &copy; {{ date('Y') }} Catur Jaya Travel. Hak Cipta Dilindungi.
            </div>
        </div>
    </div>
</body>
</html>
