<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // POSTデータ受け取り（存在しない場合は空文字）
    $title = trim($_POST["title"] ?? '');
    $author = trim($_POST["author"] ?? '');
    $reading = trim($_POST["reading"] ?? '');

    if ($title !== '' && $author !== '') {
        date_default_timezone_set('Asia/Tokyo');
        $date = date("Y/m/d H:i:s");
        $line = "{$title} - {$reading} - {$author} - {$date}" . PHP_EOL;

        $result = file_put_contents("books.txt", $line, FILE_APPEND | LOCK_EX);
        if ($result === false) {
            http_response_code(500);
            echo "ファイル書き込みに失敗しました";
            exit;
        }

        http_response_code(200);
        echo "OK";
    } else {
        http_response_code(400);
        echo "タイトルと著者が必要です";
    }
} else {
    http_response_code(405);
    echo "POSTメソッドのみ許可されています";
}