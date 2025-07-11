document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("bookForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // ページリロードを防ぐ

        const title = form.querySelector('.input_title').value.trim();
        const author = form.querySelector('.input_author').value.trim();

        if (!title || !author) {
            alert("タイトルと著者を入力してください。");
            return;
        }

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

            // 表示に追加
            const content = document.querySelector('.content');

            const newDiv = document.createElement('div');
            newDiv.className = 'list';

            const titleDiv = document.createElement('div');
            titleDiv.className = 'showed_title';
            titleDiv.textContent = title;

            const authorDiv = document.createElement('div');
            authorDiv.className = 'showed_author';
            authorDiv.textContent = author;

            const date = new Date().toISOString().split('T')[0];
            const dateDiv = document.createElement('div');
            dateDiv.className = 'showed_date';
            dateDiv.textContent = date;

            newDiv.appendChild(titleDiv);
            newDiv.appendChild(authorDiv);
            newDiv.appendChild(dateDiv);

            content.insertBefore(newDiv, content.firstChild);

            form.reset();
        })
        .catch(error => {
            alert(error.message);
        });
    });
});