<?php
// Allow from any origin
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header('Content-Type: application/json'); // Set content type to JSON

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './vendor/phpmailer/phpmailer/src/Exception.php';
require './vendor/phpmailer/phpmailer/src/PHPMailer.php';
require './vendor/phpmailer/phpmailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    error_log(print_r($data, true));

    $name = isset($data["name"]) ? $data["name"] : '';
    $email = isset($data["email"]) ? $data["email"] : '';
    $mobile = isset($data["mobile"]) ? $data["mobile"] : '';
    $message = isset($data["message"]) ? $data["message"] : '';

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'visiontovoice.v2v@gmail.com';
        $mail->Password = 'xtbnhhqnvxriqyxj';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        // Recipients
        $mail->addAddress($email, $name);
        $mail->addAddress('visiontovoice.v2v@gmail.com', 'Manager');

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'General Inquiry';

        // Email body
        $body = '<table border="1" cellspacing="0" style="border-collapse: collapse; width: 100%;">';
        $body .= '<tr><td style="padding: 8px; border: 1px solid #ddd;">Name</td><td style="padding: 8px; border: 1px solid #ddd;">' . htmlspecialchars($name) . '</td></tr>';
        $body .= '<tr><td style="padding: 8px; border: 1px solid #ddd;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">' . htmlspecialchars($email) . '</td></tr>';
        $body .= '<tr><td style="padding: 8px; border: 1px solid #ddd;">Mobile</td><td style="padding: 8px; border: 1px solid #ddd;">' . htmlspecialchars($mobile) . '</td></tr>';
        $body .= '<tr><td style="padding: 8px; border: 1px solid #ddd;">Message</td><td style="padding: 8px; border: 1px solid #ddd;">' . nl2br(htmlspecialchars($message)) . '</td></tr>';
        $body .= '</table>';
        $mail->Body = $body;

        if ($mail->send()) {
            echo json_encode(["status" => "success", "message" => "Email sent successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Email could not be sent."]);
        }
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
