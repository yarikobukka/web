<?php
header('Content-Type: application/json');

$title = $_POST['book'] ?? '';
$rating = isset($_POST['review']) ? intval($_POST['review']) : 0;
$impression = $_POST['impression'] ?? '';
$date = date('Y/m/d H:i:s');

if ($title && $impression) {
    $line = "$title - $rating - $impression - $date\n";
    file_put_contents('impressions.txt', $line, FILE_APPEND | LOCK_EX);
    echo json_encode([
        'success' => true,
        'title' => htmlspecialchars($title, ENT_QUOTES, 'UTF-8'),
        'rating' => $rating,
        'impression' => htmlspecialchars($impression, ENT_QUOTES, 'UTF-8'),
        'date' => $date
    ]);
} else {
    echo json_encode(['success' => false]);
}
?>