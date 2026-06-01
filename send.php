<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Метод не поддерживается.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$fields = [
    'type' => 'Тип объекта',
    'district' => 'Район',
    'area' => 'Площадь доли',
    'phone' => 'Телефон',
];

$data = [];
foreach ($fields as $name => $label) {
    $value = trim((string)($_POST[$name] ?? ''));
    $value = preg_replace('/[\r\n]+/', ' ', $value);
    $data[$name] = mb_substr($value, 0, 200);
}

if ($data['type'] === '' || $data['district'] === '' || $data['area'] === '' || $data['phone'] === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Заполните все поля формы.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$to = 'vykup1rf@yandex.ru';
$subject = 'Новая заявка с сайта выкуп-36.рф';
$lines = ['Новая заявка с сайта выкуп-36.рф', ''];

foreach ($fields as $name => $label) {
    $lines[] = $label . ': ' . $data[$name];
}

$lines[] = '';
$lines[] = 'Дата: ' . date('d.m.Y H:i:s');
$lines[] = 'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'не определен');

$message = implode("\n", $lines);
$headers = [
    'From: noreply@xn---36-edd4b4a1a6d.xn--p1ai',
    'Reply-To: vykup1rf@yandex.ru',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

if (!mail($to, $subject, $message, implode("\r\n", $headers))) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Не удалось отправить заявку. Попробуйте позвонить.'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['ok' => true, 'message' => 'Заявка принята. Специалист свяжется с вами в ближайшее время.'], JSON_UNESCAPED_UNICODE);
