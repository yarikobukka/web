<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document_note</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
    <link rel="stylesheet" href="style_note.css">
    <script>
    const bookData = {
    <?php
    $lines = file("books.txt", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $parts = explode(" - ", $line);
        $title = trim($parts[0]);
        $author = trim($parts[2]); // 著者（3つ目の要素）
        $title_escaped = json_encode($title);   // JS用にエスケープ
        $author_escaped = json_encode($author);
        echo "    $title_escaped: $author_escaped,\n";
    }
    ?>
    };
    </script>
</head>
<body>
<?php include ('index_header.html');?>

<h1>Impression Note</h1>

<form id="note_form" method="post">
    <div class="form_input">
        <table class="form_table">
            <tr>
                <td>タイトル</td>
                <td>
                    <select class="form_control" name="book">
                    <?php
                    $lines = file("books.txt", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                    foreach ($lines as $line) {
                        $parts = explode(" - ", $line);
                        $title = trim($parts[0]);
                        $escaped = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
                        echo "<option value=\"{$escaped}\">{$escaped}</option>\n";
                    }
                    ?>
                    </select>
                </td>
            </tr>
            <tr>
                <td>著者</td>
                <td>
                    <input type="text" id="author" class="form_control" name="author">
                </td>
            </tr>
            <tr>
                <td>評価</td>
                <td>
                    <div class="stars">
                        <span>
                            <input id="review01" type="radio" name="review" value="1"><label for="review01">★</label>
                            <input id="review02" type="radio" name="review" value="2"><label for="review02">★</label>
                            <input id="review03" type="radio" name="review" value="3"><label for="review03">★</label>
                            <input id="review04" type="radio" name="review" value="4"><label for="review04">★</label>
                            <input id="review05" type="radio" name="review" value="5"><label for="review05">★</label>
                        </span>
                    </div>
                </td>
            </tr>
            <tr>
                <td>感想</td>
                <td><textarea name="impression" id="impression" class="input_impression"></textarea></td>
            </tr>
        </table>
        <button type="submit" class="submit">追加</button>
    </div>
</form>

<div class="content">
<?php
$filename = "impressions.txt";
if (file_exists($filename)) {
    $lines = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (count($lines) === 0) {
        echo "<p class='no-data'>まだ感想は登録されていません。</p>";
    } else {
        $lines = array_reverse($lines); // 新しい順に表示
        foreach ($lines as $line) {
            if (preg_match("/^(.+?) - (.+?) - (\d) - (.+?) - (.+?)$/u", $line, $matches)) {
                $title = htmlspecialchars($matches[1], ENT_QUOTES, 'UTF-8');
                $author = htmlspecialchars($matches[2], ENT_QUOTES, 'UTF-8');
                $rating = (int)$matches[3];
                $impression = htmlspecialchars($matches[4], ENT_QUOTES, 'UTF-8');
                $date = htmlspecialchars($matches[5], ENT_QUOTES, 'UTF-8');
                $date_only = substr($date, 0, 10);

                // 星を表示（例：★★★☆☆）
                $stars = str_repeat("★", $rating) . str_repeat("☆", 5 - $rating);

                echo "<div class='list'>
                        <div class='showed_title'>{$title}</div>
                        <div class='showed_author'>{$author}</div>
                        <div class='showed_date'>{$date_only}</div>
                        <div class='showed_review'>評価：{$stars}</div>
                        <div class='showed_impression'>感想：{$impression}</div>
                      </div>";
            } else {
                echo "<p>⚠ データ形式が不正な行をスキップしました。</p>";
            }
        }
    }
} else {
    echo "<p>まだ感想は登録されていません。</p>";
}
?>
</div>

<?php include ('index_footer.html');?>

<script src="index_note.js"></script>

</body>
</html>