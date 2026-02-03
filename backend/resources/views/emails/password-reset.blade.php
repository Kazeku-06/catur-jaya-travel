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
            background-color: #f8fafc;
            padding: 20px;
            min-height: 100vh;
        }
        
        .email-wrapper {
            max-width: 500px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .header {
            background-color: #1e40af;
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .logo {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .logo-icon {
            font-size: 20px;
        }
        
        .subtitle {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
        }
        
        .message {
            font-size: 15px;
            color: #4b5563;
            margin-bottom: 25px;
            line-height: 1.6;
        }
        
        .button-container {
            text-align: center;
            margin: 35px 0;
        }
        
        .button {
            display: inline-block;
            background-color: #1e40af;
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            font-size: 15px;
            transition: all 0.2s ease;
        }
        
        .button:hover {
            background-color: #1e3a8a;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(30, 64, 175, 0.2);
        }
        
        .url-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            margin: 25px 0;
            word-break: break-all;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            color: #475569;
            text-align: center;
        }
        
        .info-section {
            margin-top: 35px;
            padding-top: 25px;
            border-top: 1px solid #e5e7eb;
        }
        
        .info-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .info-list {
            list-style: none;
            color: #4b5563;
            font-size: 14px;
        }
        
        .info-list li {
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }
        
        .info-list li::before {
            content: '•';
            position: absolute;
            left: 8px;
            color: #9ca3af;
        }
        
        .footer {
            background-color: #f9fafb;
            padding: 25px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-content {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 15px;
            line-height: 1.5;
        }
        
        .footer-links {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .footer-link {
            color: #4b5563;
            text-decoration: none;
            font-size: 13px;
            transition: color 0.2s ease;
        }
        
        .footer-link:hover {
            color: #1e40af;
        }
        
        .copyright {
            margin-top: 20px;
            font-size: 12px;
            color: #9ca3af;
        }
        
        @media (max-width: 600px) {
            .email-wrapper {
                border-radius: 8px;
            }
            
            .header, .content, .footer {
                padding: 25px 20px;
            }
            
            .logo {
                font-size: 20px;
            }
            
            .greeting {
                font-size: 18px;
            }
            
            .button {
                padding: 12px 24px;
                font-size: 14px;
            }
            
            .footer-links {
                gap: 15px;
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
            
            <div class="message" style="text-align: center; font-size: 14px; color: #6b7280;">
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