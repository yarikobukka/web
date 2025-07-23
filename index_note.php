<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document_note</title>
	<link rel="stylesheet" href="style_note.css">
</head>
<body>
<?php include ('index_header.html');?>

<h1>Impressions Note</h1>

<form id="note_form" method="post">
    <div class="form_input">
        <table class="form_table">
            <tr>
                <td>本を選ぶ</td>
                <td>
                    <select name="book">
                    <?php
                    $lines = file("books.txt", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                    foreach ($lines as $line) {
                        $parts = explode(" - ", $line);
                        $title = trim($parts[0]);
                        $escaped = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
                        echo "<option value=\"{$escaped}\">{$escaped}</option>\n";
                    }
                    ?>
                </td>
            </tr>
            <tr>
                <td>評価</td>
                <td>
                    <?php for ($i = 5; $i >= 1; $i--): ?>
                    <input type="radio" name="rating" id="star<?php echo $i; ?>" value="<?php echo $i; ?>">
                    <label for="star<?php echo $i; ?>"></label>
                    <?php endfor; ?>
                </td>
            </tr>
            <tr>
                <td>感想</td>
                <td><input type="text" name="impression" id="impression" class="input_impression"></td>
            </tr>
        </table>
        <button type="submit" class="submit">追加</button>
    </div>
</form>
<?php include ('index_footer.html');?>
</body>
</html>