<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Book List Table</title>
    <link rel="stylesheet" href="../style_list.css" />
</head>
<body>
<?php include __DIR__ . '/index_header.php'; ?>

<h1>Book List</h1>

<!-- 入力フォーム -->
<form id="book_form" method="post">
    <div class="form_input">
        <table class="form_table">
            <tr>
                <td>タイトル</td>
                <td><input type="text" name="title" id="title" class="input_title"></td>
            </tr>
            <tr>
                <td>読み方</td>
                <td><input type="text" name="reading" id="reading" class="input_reading"></td>
            </tr>
            <tr>
                <td>著者</td>
                <td><input type="text" name="author" id="author" class="input_author"></td>
            </tr>
        </table>
        <button type="submit" class="submit">追加</button>
    </div>
</form>

<div id="result_area"></div>

<!-- 並び順セレクトボックス -->
<div class="select_order_wrapper">
    <span class="chevron_icon"></span>
    <select id="select_order">
        <option value="new" selected>新しい順</option>
        <option value="old">古い順</option>
        <option value="reading">タイトル順</option>
    </select>
</div>

<!-- 表示場所 -->
<div class="content">
<?php
    $filename = "../books.txt";
    if (file_exists($filename)) {
        $lines = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (count($lines) === 0) {
            echo "<p>まだ本は登録されていません。</p>";
        } else {
            // 新しい順に表示するため配列を反転
            $lines = array_reverse($lines);

            foreach ($lines as $line) {
              if (preg_match("/^(.+?) - (.+?) - (.+?) - (.+?)$/u", $line, $matches)) {
                $line = htmlspecialchars($matches[0], ENT_QUOTES, 'UTF-8');
                $title = htmlspecialchars($matches[1], ENT_QUOTES, 'UTF-8');
                $reading = htmlspecialchars($matches[2], ENT_QUOTES, 'UTF-8');
                $author = htmlspecialchars($matches[3], ENT_QUOTES, 'UTF-8');
                $date = htmlspecialchars($matches[4], ENT_QUOTES, 'UTF-8');
                $date_only = substr($date, 0, 10);
                    echo "<div class='list' data-reading='{$reading}'>
                            <div class='showed_title'>{$title}</div>
                            <div class='showed_author'>{$author}</div>
                            <div class='showed_date' data-date='{$date}'>{$date_only}</div>
                          </div>";
                }
            }
        }
    } else {
        echo "<p>まだ本は登録されていません。</p>";
    }
?>
</div>

<?php include __DIR__ . '/index_footer.php'; ?>

<script src="../index_list.js"></script>

</body>
</html>