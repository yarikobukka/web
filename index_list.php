<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Book List Table</title>
    <link rel="stylesheet" href="style_list.css" />
</head>
<body>
<?php include('index_header.html'); ?>
<h1>Book List</h1>

<!-- 入力フォーム -->
<form id="book_form" action="save_book.php" method="post">
    <div class="form_input">
        <table class="form_table">
            <tr>
                <td>タイトル</td>
                <td>
                    <input type="text" name="title" class="input_title" required />
                    <!-- ふりがなはhiddenで管理 -->
                    <input type="hidden" name="reading" class="input_reading" />
                </td>
            </tr>
            <tr>
                <td>著者</td>
                <td><input type="text" name="author" class="input_author" required /></td>
            </tr>
        </table>
        <button type="submit" class="submit">追加</button>
    </div>
</form>

<!-- 本のおすすめシステム -->
<div class="recommend">
<!-- {% if recommendations %} -->
<h2>おすすめの本</h2>
<table class="recommend_table">
  <tr><th>タイトル</th><th>著者</th><th>説明</th></tr>
  <!-- {% for book in recommendations %} -->
    <tr>
      <td>{{ book.title }}</td>
      <td>{{ book.author }}</td>
      <td>{{ book.desc }}</td>
    </tr>
  <!-- {% endfor %} -->
</table>
<!-- {% endif %} -->
</div>

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
<div class="content" style="margin-top: 20px;">
<?php
    $filename = "books.txt";
    if (file_exists($filename)) {
        $lines = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $lines = array_reverse($lines); // 新しい順に表示（デフォルト）

        foreach ($lines as $line) {
            if (preg_match("/^(.+?) - (.+?) - (.+?) - (.+)$/u", $line, $matches)) {
                $title = htmlspecialchars($matches[1], ENT_QUOTES, 'UTF-8');
                $reading = htmlspecialchars($matches[2], ENT_QUOTES, 'UTF-8');
                $author = htmlspecialchars($matches[3], ENT_QUOTES, 'UTF-8');
                $datetime = htmlspecialchars($matches[4], ENT_QUOTES, 'UTF-8');
                $date_only = substr($datetime, 0, 10); // YYYY/MM/DD 部分だけ抜き出す

                echo "<div class='list' data-reading='{$reading}'>
                    <div class='showed_title'>{$title}</div>
                    <div class='showed_author'>{$author}</div>
                    <div class='showed_date' data-date='{$datetime}'>{$date_only}</div>
                </div>";
            }
        }
    } else {
        echo "<p>まだ本は登録されていません。</p>";
    }
?>
</div>

<?php include('index_footer.html'); ?>
<script src="https://unpkg.com/wanakana"></script>
<script src="index_list.js"></script>
</body>
</html>