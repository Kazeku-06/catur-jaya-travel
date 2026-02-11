<?php
$host = 'smtp.gmail.com';
$port = 587;
$timeout = 10;
$user = 'tssytari@gmail.com';
$pass = 'gfphobcqqpmsyzal';

echo "1. Connecting to $host:$port...\n";
$fp = fsockopen($host, $port, $errno, $errstr, $timeout);
if (!$fp) {
    die("FATAL: Failed to connect: $errstr ($errno)\n");
}
echo "OK: Connected via TCP.\n";

echo "2. Reading initial banner...\n";
$banner = fgets($fp, 512);
echo "BANNER: $banner\n";

echo "3. Sending EHLO...\n";
fwrite($fp, "EHLO localhost\r\n");
while($line = fgets($fp, 512)) {
    echo "EHLO: $line";
    if (substr($line, 3, 1) == " ") break;
}

echo "4. Sending STARTTLS...\n";
fwrite($fp, "STARTTLS\r\n");
$response = fgets($fp, 512);
echo "STARTTLS: $response";

if (substr($response, 0, 3) != '220') {
    die("FATAL: STARTTLS failed.\n");
}

echo "5. Enabling crypto...\n";
if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
    echo "Current error: ".error_get_last()['message']."\n";
    die("FATAL: TLS handshake failed.\n");
}
echo "OK: TLS established.\n";

echo "6. Sending EHLO (post-TLS)...\n";
fwrite($fp, "EHLO localhost\r\n");
while($line = fgets($fp, 512)) {
    echo "EHLO: $line";
    if (substr($line, 3, 1) == " ") break;
}

echo "7. Sending AUTH LOGIN...\n";
fwrite($fp, "AUTH LOGIN\r\n");
$response = fgets($fp, 512);
echo "AUTH: $response";

if (substr($response, 0, 3) != '334') { 
    die("FATAL: AUTH LOGIN rejected.\n"); 
}

echo "8. Sending Username...\n";
fwrite($fp, base64_encode($user) . "\r\n");
$response = fgets($fp, 512);
echo "USER Response: $response";

echo "9. Sending Password...\n";
fwrite($fp, base64_encode($pass) . "\r\n");
$response = fgets($fp, 512);
echo "PASS Response: $response"; // Don't log full response if sensitive, but OK for dev

if (substr($response, 0, 3) != '235') {
    die("FATAL: Authentication failed.\n");
}

echo "SUCCESS: SMTP fully functional!\n";
fclose($fp);
