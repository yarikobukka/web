<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $title = trim($_POST["title"] ?? '');
    $author = trim($_POST["author"] ?? '');

    if ($title !== '' && $author !== '') {
        $line = $title . " - " . $author . PHP_EOL;
        file_put_contents("books.txt", $line, FILE_APPEND | LOCK_EX);
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