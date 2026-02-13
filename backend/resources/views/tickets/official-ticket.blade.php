<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tiket Resmi - {{ $booking->booking_code }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: #fff;
        }
        
        .ticket-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 2px solid #2563eb;
            border-radius: 10px;
            background: #fff;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        
        .company-logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5px;
        }
        
        .company-info {
            font-size: 10px;
            color: #666;
            margin-bottom: 10px;
        }
        
        .ticket-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 5px;
        }
        
        .ticket-subtitle {
            font-size: 12px;
            color: #6b7280;
        }
        
        .content {
            display: flex;
            gap: 30px;
        }
        
        .left-section {
            flex: 2;
        }
        
        .right-section {
            flex: 1;
            text-align: center;
            border-left: 1px dashed #d1d5db;
            padding-left: 20px;
        }
        
        .info-group {
            margin-bottom: 15px;
        }
        
        .info-label {
            font-weight: bold;
            color: #374151;
            margin-bottom: 3px;
        }
        
        .info-value {
            color: #6b7280;
            margin-bottom: 8px;
        }
        
        .booking-code {
            font-size: 16px;
            font-weight: bold;
            color: #2563eb;
            background: #eff6ff;
            padding: 8px 12px;
            border-radius: 5px;
            text-align: center;
            margin-bottom: 15px;
        }
        
        .status-badge {
            background: #10b981;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            display: inline-block;
            vertical-align: text-bottom;
            margin-left: 6px;
            white-space: nowrap;
            min-width: 50px;
            text-align: center;
            line-height: 1.3;
            box-sizing: border-box;
            position: relative;
            top: 2px;
        }
        
        .qr-code {
            margin: 15px 0;
        }
        
        .qr-code img {
            max-width: 120px;
            height: auto;
        }
        
        .price-section {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        
        .price-label {
            font-size: 10px;
            color: #6b7280;
            margin-bottom: 3px;
        }
        
        .price-value {
            font-size: 16px;
            font-weight: bold;
            color: #059669;
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
        }
        
        .footer-note {
            font-size: 10px;
            color: #6b7280;
            margin-bottom: 10px;
        }
        
        .footer-contact {
            font-size: 10px;
            color: #374151;
        }
        
        .rundown-section {
            background: #f8fafc;
            padding: 12px;
            border-radius: 6px;
            border-left: 3px solid #2563eb;
            margin-top: 5px;
        }
        
        .rundown-item {
            margin-bottom: 8px;
            font-size: 11px;
            line-height: 1.3;
        }
        
        .rundown-number {
            color: #2563eb;
            font-weight: bold;
        }
        
        .rundown-time {
            font-weight: bold;
            color: #374151;
        }
        
        .rundown-activities {
            margin: 3px 0 0 15px;
            padding: 0;
            list-style-type: disc;
        }
        
        .rundown-activities li {
            margin-bottom: 2px;
        }
        
        .two-column {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
        }
        
        .column {
            flex: 1;
        }
        
        @media print {
            .ticket-container {
                border: none;
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="ticket-container">
        <!-- Header -->
        <div class="header">
            <div class="company-logo">{{ $company_name }}</div>
            <div class="company-info">
                {{ $company_address }}<br>
                Telp: {{ $company_phone }} | Email: {{ $company_email }}
            </div>
            <div class="ticket-title">TIKET RESMI</div>
            <div class="ticket-subtitle">{{ $catalog_type }} - {{ $catalog_name }}</div>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Left Section -->
            <div class="left-section">
                <!-- Booking Code -->
                <div class="booking-code">
                    {{ $booking->booking_code }}
                </div>

                <!-- Customer Information -->
                <div class="info-group">
                    <div class="info-label">Informasi Pemesan</div>
                    <div class="info-value">
                        <strong>Nama:</strong> {{ $booking_data['nama_pemesan'] }}<br>
                        <strong>Email:</strong> {{ $user->email }}<br>
                        <strong>No. HP:</strong> {{ $booking_data['nomor_hp'] }}
                    </div>
                </div>

                <!-- Trip/Travel Information -->
                <div class="two-column">
                    <div class="column">
                        <div class="info-group">
                            <div class="info-label">Detail {{ $catalog_type }}</div>
                            <div class="info-value">
                                <strong>Nama:</strong> {{ $catalog_name }}<br>
                                @if($booking->catalog_type === 'trip')
                                    <strong>Durasi:</strong> {{ $catalog->duration ?? 'N/A' }}<br>
                                    <strong>Lokasi:</strong> {{ $catalog->location ?? 'N/A' }}
                                @else
                                    <strong>Rute:</strong> {{ $catalog->origin }} - {{ $catalog->destination }}<br>
                                    <strong>Jenis:</strong> {{ $catalog->vehicle_type ?? 'N/A' }}
                                @endif
                            </div>
                        </div>
                    </div>
                    <div class="column">
                        <div class="info-group">
                            <div class="info-label">Detail Perjalanan</div>
                            <div class="info-value">
                                <strong>Tanggal:</strong> {{ \Carbon\Carbon::parse($booking_data['tanggal_keberangkatan'])->format('d/m/Y') }}<br>
                                <strong>Jumlah Orang:</strong> {{ $booking_data['jumlah_orang'] }} orang<br>
                                @if(!empty($booking_data['catatan_tambahan']))
                                    <strong>Catatan:</strong> {{ $booking_data['catatan_tambahan'] }}
                                @endif
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Payment Information -->
                <div class="info-group">
                    <div class="info-label">Informasi Pembayaran</div>
                    <div class="info-value">
                        <strong>Metode:</strong> {{ $payment_method }}<br>
                        <strong>Status:</strong> <span class="status-badge">{{ strtoupper($booking->status) }}</span><br>
                        <strong>Tanggal Validasi:</strong> {{ $validation_date->format('d/m/Y H:i') }} WIB
                    </div>
                </div>

                <!-- Rundown/Itinerary Section -->
                @if(!empty($catalog->rundown) && is_array($catalog->rundown))
                <div class="info-group">
                    <div class="info-label">Rundown Perjalanan</div>
                    <div class="info-value">
                        <div class="rundown-section">
                            @foreach($catalog->rundown as $index => $item)
                                <div class="rundown-item">
                                    <span class="rundown-number">{{ $index + 1 }}.</span>
                                    @if(is_array($item))
                                        @if(isset($item['time']) && isset($item['activity']))
                                            <span class="rundown-time">{{ $item['time'] }}</span> - {{ $item['activity'] }}
                                        @elseif(isset($item['day']) && isset($item['activities']))
                                            <span class="rundown-time">{{ $item['day'] }}</span>
                                            @if(is_array($item['activities']))
                                                <ul class="rundown-activities">
                                                    @foreach($item['activities'] as $activity)
                                                        <li>{{ $activity }}</li>
                                                    @endforeach
                                                </ul>
                                            @else
                                                <br>{{ $item['activities'] }}
                                            @endif
                                        @elseif(isset($item['title']) && isset($item['description']))
                                            <span class="rundown-time">{{ $item['title'] }}</span>
                                            <br>{{ $item['description'] }}
                                        @else
                                            {{ is_string($item) ? $item : json_encode($item) }}
                                        @endif
                                    @else
                                        {{ $item }}
                                    @endif
                                </div>
                            @endforeach
                        </div>
                    </div>
                </div>
                @endif

                <!-- Price Section -->
                <div class="price-section">
                    <div class="price-label">Total Pembayaran</div>
                    <div class="price-value">Rp {{ number_format($booking->total_price, 0, ',', '.') }}</div>
                </div>
            </div>

            <!-- Right Section -->
            <div class="right-section">
                <div class="info-label">Kode Verifikasi</div>
                @if($qr_code_base64)
                    <div class="qr-code">
                        <img src="data:image/png;base64,{{ $qr_code_base64 }}" alt="QR Code">
                    </div>
                    <div class="info-value" style="font-size: 10px;">
                        Scan QR code untuk verifikasi tiket
                    </div>
                @else
                    <div class="qr-code" style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 15px 0;">
                        <div style="font-family: monospace; font-size: 10px; word-break: break-all; text-align: center;">
                            {{ $booking->booking_code }}
                        </div>
                    </div>
                    <div class="info-value" style="font-size: 10px;">
                        Gunakan kode booking untuk verifikasi
                    </div>
                @endif

                <div style="margin-top: 20px;">
                    <div class="info-label">Booking ID</div>
                    <div class="info-value">{{ $booking->id }}</div>
                </div>

                <div style="margin-top: 15px;">
                    <div class="info-label">Tanggal Booking</div>
                    <div class="info-value">{{ $booking->created_at->format('d/m/Y H:i') }}</div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-note">
                <strong>PENTING:</strong> Tiket ini adalah bukti sah pemesanan dan pembayaran. 
                Harap tunjukan tiket ini saat keberangkatan.
            </div>
            <div class="footer-contact">
                Untuk pertanyaan lebih lanjut, hubungi Customer Service di {{ $company_phone }} atau {{ $company_email }}
            </div>
        </div>
    </div>
</body>
</html>