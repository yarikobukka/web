document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("bookForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // フォーム送信を止める（リロード防止）

        const title = form.querySelector('.input_title').value.trim();
        const author = form.querySelector('.input_author').value.trim();

        if (!title || !author) {
            alert("タイトルと著者を入力してください。");
            return;
        }

        // PHPに非同期POST（fetch）
        fetch("save_book.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("保存に失敗しました");
            }

            // 表示テーブルに即座に行を追加
            const table = document.querySelector(".book_table");
            const newRow = table.insertRow();
            const titleCell = newRow.insertCell();
            const authorCell = newRow.insertCell();
            titleCell.textContent = title;
            authorCell.textContent = author;

            // フォームをリセット
            form.reset();
        })
        .catch(error => {
            alert(error.message);
        });
    });
});