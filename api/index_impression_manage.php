<?php
header('Content-Type: application/json');

$title = $_POST['book'] ?? '';
$author = $_POST['book'] ?? '';
$rating = isset($_POST['review']) ? intval($_POST['review']) : 0;
$impression = $_POST['impression'] ?? '';
$date = date('Y/m/d H:i:s');

if ($title && $impression) {
    $line = "$title - $author - $rating - $impression - $date\n";
    file_put_contents( __DIR__ . '/impressions.txt', $line, FILE_APPEND | LOCK_EX);
    echo json_encode([
        'success' => true,
        'title' => htmlspecialchars($title, ENT_QUOTES, 'UTF-8'),
        'author' => htmlspecialchars($author, ENT_QUOTES, 'UFT-8'),
        'rating' => $rating,
        'impression' => htmlspecialchars($impression, ENT_QUOTES, 'UTF-8'),
        'date' => $date
    ]);
} else {
    echo json_encode(['success' => false]);
}
?>