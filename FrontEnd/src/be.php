<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './vendor/phpmailer/phpmailer/src/Exception.php';
require './vendor/phpmailer/phpmailer/src/PHPMailer.php';
require './vendor/phpmailer/phpmailer/src/SMTP.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    // Log incoming POST data
    error_log("POST data: " . print_r($_POST, true));

    $name = isset($_POST["name"]) ? htmlspecialchars($_POST["name"]) : '';
    $email = isset($_POST["email"]) ? htmlspecialchars($_POST["email"]) : '';
    $mobile = isset($_POST["mobile"]) ? htmlspecialchars($_POST["mobile"]) : '';
    $message = isset($_POST["message"]) ? htmlspecialchars($_POST["message"]) : '';

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'visiontovoice.v2v@gmail.com';
        $mail->Password = 'xtbnhhqnvxriqyxj'; // Use an App Password if necessary
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom($email, $name);
        $mail->addAddress('visiontovoice.v2v@gmail.com', 'Manager');

        $mail->isHTML(true);
        $mail->Subject = 'General Inquiry';

        $body = '<table border="1" cellspacing="0" style="border-collapse: collapse; width: 100%;">';
        $body .= '<tr><td style="padding: 8px; border: 1px solid #ddd;">Name</td><td style="padding: 8px; border: 1px solid #ddd;">' . $name . '</td></tr>';
        $body .= '<tr><td style="padding: 8px; border: 1px solid #ddd;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">' . $email . '</td></tr>';
        $body .= '<tr><td style="padding: 8px; border: 1px solid #ddd;">Mobile</td><td style="padding: 8px; border: 1px solid #ddd;">' . $mobile . '</td></tr>';
        $body .= '<tr><td style="padding: 8px; border: 1px solid #ddd;">Message</td><td style="padding: 8px; border: 1px solid #ddd;">' . $message . '</td></tr>';
        $body .= '</table>';

        $mail->Body = $body;

        $mail->send();
        echo json_encode(["status" => "success", "message" => "Message sent successfully."]);
    } catch (Exception $e) {
        error_log("Mailer Error: {$mail->ErrorInfo}");
        echo json_encode(["status" => "error", "message" => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
    }
}
