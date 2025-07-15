<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $title = trim($_POST["title"] ?? '');
    $reading = trim($_POST["reading"] ?? '');
    $author = trim($_POST["author"] ?? '');
    $date = trim($_POST["date"] ?? '');

    if ($title !== '' && $reading !== '' && $author !== '') {
        date_default_timezone_set('Asia/Tokyo');
        if ($date === '') {
            $date = date("Y/m/d H:i:s");
        }
        $line = "{$title} - {$reading} - {$author} - {$date}" . PHP_EOL;
        file_put_contents("books.txt", $line, FILE_APPEND | LOCK_EX);
        http_response_code(200);
        echo "OK";
    } else {
        http_response_code(400);
        echo "すべての項目を入力してください";
    }
} else {
    http_response_code(405);
    echo "POSTメソッドのみ許可されています";
}
?>