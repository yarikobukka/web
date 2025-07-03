<?php
header("Content-Type: text/html; charset=UTF-8");

$title = isset($_POST['title']) ? trim($_POST['title']) : '';
$author = isset($_POST['author']) ? trim($_POST['author']) : '';

if ($title === '' || $author === '') {
    echo "タイトルと著者は必須です。";
    exit;
}

$entry ="". $title . " - " . $author . "\n";
file_put_contents("books.txt", $entry, FILE_APPEND | LOCK_EX);

// 保存後に元のページに戻す
header("Location: index_list.php");
exit;
?>