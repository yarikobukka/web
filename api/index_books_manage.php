<?php
header('Content-Type: application/json');

$filename = __DIR__ . '/books.txt';

if (!file_exists($filename)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'books.txt が存在しません']);
    exit;
}

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'add':
        $title = $_POST['title'] ?? '';
        $reading = $_POST['reading'] ?? '';
        $author = $_POST['author'] ?? '';
        $date = $_POST['date'] ?? '';

        if (!$title || !$reading || !$author || !$date) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '不正な入力です']);
            exit;
        }

        $line = "{$title} - {$reading} - {$author} - {$date}" . PHP_EOL;
        if (file_put_contents($filename, $line, FILE_APPEND) === false) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'ファイル書き込みに失敗しました']);
            exit;
        }

        echo json_encode(['success' => true, 'message' => '追加成功']);
        break;

    case 'update':
        $oldTitle = $_POST['old_title'] ?? '';
        $oldReading = $_POST['old_reading'] ?? '';
        $oldAuthor = $_POST['old_author'] ?? '';
        $newTitle = $_POST['new_title'] ?? '';
        $newReading = $_POST['new_reading'] ?? '';
        $newAuthor = $_POST['new_author'] ?? '';

        if (!$oldTitle || !$oldReading || !$oldAuthor || !$newTitle || !$newReading || !$newAuthor) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '不正な入力です']);
            exit;
        }

        $lines = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $updated = false;
        foreach ($lines as &$line) {
            $parts = explode(' - ', $line);
            if (count($parts) !== 4) continue;
            list($title, $reading, $author, $date) = $parts;

            if ($title === $oldTitle && $reading === $oldReading && $author === $oldAuthor) {
                $line = "{$newTitle} - {$newReading} - {$newAuthor} - {$date}";
                $updated = true;
                break;
            }
        }

        if ($updated) {
            if (file_put_contents($filename, implode(PHP_EOL, $lines) . PHP_EOL) === false) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'ファイル書き込みに失敗しました']);
                exit;
            }
            echo json_encode(['success' => true, 'message' => '更新成功']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => '該当データが見つかりませんでした']);
        }
        break;

    case 'delete':
        $title = $_POST['title'] ?? '';
        $reading = $_POST['reading'] ?? '';
        $author = $_POST['author'] ?? '';

        if (!$title || !$reading || !$author) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'パラメータ不足']);
            exit;
        }

        $lines = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $found = false;
        $new_lines = [];

        foreach ($lines as $line) {
            $parts = explode(' - ', $line);
            if (count($parts) !== 4) {
                $new_lines[] = $line;
                continue;
            }
            list($lineTitle, $lineReading, $lineAuthor, $lineDate) = $parts;
            if ($lineTitle === $title && $lineReading === $reading && $lineAuthor === $author) {
                $found = true;
                continue; // 削除対象なので追加しない
            }
            $new_lines[] = $line;
        }

        if (!$found) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => '該当データが見つかりません']);
            exit;
        }

        if (file_put_contents($filename, implode(PHP_EOL, $new_lines) . PHP_EOL) === false) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'ファイル書き込みに失敗しました']);
            exit;
        }

        echo json_encode(['success' => true, 'message' => '削除成功']);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '不正なアクションです']);
        break;
}
?>