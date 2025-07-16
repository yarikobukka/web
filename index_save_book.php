<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo "POSTメソッドのみ許可されています";
    exit;
}

$title   = trim($_POST["title"] ?? '');
$reading = trim($_POST["reading"] ?? '');
$author  = trim($_POST["author"] ?? '');
$date    = trim($_POST["date"] ?? '');

if ($title === '' || $reading === '' || $author === '') {
    http_response_code(400);
    echo "すべての項目を入力してください";
    exit;
}

date_default_timezone_set('Asia/Tokyo');
if ($date === '') {
    $date = date("Y/m/d H:i:s");
}

$line = "{$title} - {$reading} - {$author} - {$date}" . PHP_EOL;

// ログ出力で確認（オプション）
file_put_contents("debug_log.txt", print_r($_POST, true), FILE_APPEND);

if (file_put_contents("books.txt", $line, FILE_APPEND | LOCK_EX) === false) {
    http_response_code(500);
    echo "ファイルに書き込めませんでした";
    exit;
}

http_response_code(200);
echo "OK";
?>