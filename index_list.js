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

            // 新しい本を画面の一番上に追加
            const content = document.querySelector('.content');

            const newDiv = document.createElement('div');
            newDiv.className = 'list';

            const titleDiv = document.createElement('div');
            titleDiv.className = 'showed_title';
            titleDiv.textContent = title;

            const authorDiv = document.createElement('div');
            authorDiv.className = 'showed_author';
            authorDiv.textContent = author;

            newDiv.appendChild(titleDiv);
            newDiv.appendChild(authorDiv);

            // 一番上に追加（ここだけでOK）
            content.insertBefore(newDiv, content.firstChild);

            // フォームをリセット
            form.reset();
        })
        .catch(error => {
            alert(error.message);
        });
    });
});