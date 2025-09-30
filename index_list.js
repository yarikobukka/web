document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("book_form");
    const content = document.querySelector(".content");
    const sortSelect = document.getElementById("select_order");
    const inputTitle = document.querySelector(".input_title");
    const inputReading = document.querySelector(".input_reading");
    const inputAuthor = document.querySelector(".input_author");
    const resultArea = document.getElementById("result_area");

    // --- 日付処理 ---
    function getSmartDateLabel(pastDate) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const target = new Date(pastDate.getFullYear(), pastDate.getMonth(), pastDate.getDate());

        if (target.getTime() === today.getTime()) {
            const diffMs = now - pastDate;
            const diffSec = Math.floor(diffMs / 1000);
            const diffMin = Math.floor(diffSec / 60);
            const diffHour = Math.floor(diffMin / 60);
            if (diffSec < 60) return `${diffSec}秒前`;
            if (diffMin < 60) return `${diffMin}分前`;
            return `${diffHour}時間前`;
        } else if (target.getTime() === yesterday.getTime()) {
            return "昨日";
        } else {
            return `${pastDate.getFullYear()}/${String(pastDate.getMonth() + 1).padStart(2, "0")}/${String(pastDate.getDate()).padStart(2, "0")}`;
        }
    }

    function updateAllDateLabels() {
        document.querySelectorAll(".showed_date").forEach(el => {
            const raw = el.getAttribute("data-date");
            el.textContent = getSmartDateLabel(new Date(raw));
        });
    }

    // --- ソート処理 ---
    function sortList(order = "new") {
        const items = Array.from(content.querySelectorAll(".list"));
        items.sort((a, b) => {
            const dateA = new Date(a.querySelector(".showed_date").dataset.date);
            const dateB = new Date(b.querySelector(".showed_date").dataset.date);

            if (order === "new") return dateB - dateA;
            if (order === "old") return dateA - dateB;
            if (order === "reading") {
                return (a.dataset.reading || "").localeCompare(b.dataset.reading || "", "ja");
            }
        });
        items.forEach(item => content.appendChild(item));
        updateAllDateLabels();
    }

    // --- メニュー作成 ---
    function createMenuButtonForItem(itemDiv) {
        if (itemDiv.querySelector(".menu_button")) return;

        const titleDiv = itemDiv.querySelector(".showed_title");
        const authorDiv = itemDiv.querySelector(".showed_author");
        const dateDiv = itemDiv.querySelector(".showed_date");
        const reading = itemDiv.dataset.reading || "";

        const menuBtn = document.createElement("button");
        menuBtn.innerHTML = "⋮";
        menuBtn.className = "menu_button";
        menuBtn.setAttribute("aria-label", "メニュー");

        const menu = document.createElement("div");
        menu.className = "dropdown_menu";

        const editItem = document.createElement("div");
        editItem.textContent = "編集";
        editItem.className = "dropdown_item edit_item";

        const deleteItem = document.createElement("div");
        deleteItem.textContent = "削除";
        deleteItem.className = "dropdown_item delete_item";

        menu.append(editItem, deleteItem);
        menuBtn.appendChild(menu);

        const dateMenuRow = document.createElement("div");
        dateMenuRow.className = "date_menu_row";
        dateMenuRow.append(menuBtn, dateDiv);

        itemDiv.appendChild(dateMenuRow);

        // --- メニュー表示切替 ---
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            document.querySelectorAll(".dropdown_menu").forEach(m => m.style.display = "none");
            menu.style.display = (menu.style.display === "block") ? "none" : "block";
        });
        document.addEventListener("click", () => menu.style.display = "none");

        // --- 編集処理 ---
        editItem.addEventListener("click", () => {
            menu.style.display = "none";
            const oldTitle = titleDiv.textContent;
            const oldAuthor = authorDiv.textContent;

            const editTitle = document.createElement("input");
            editTitle.value = oldTitle;
            editTitle.className = "edit_title";

            const editReading = document.createElement("input");
            editReading.value = reading;
            editReading.className = "edit_reading";

            const editAuthor = document.createElement("input");
            editAuthor.value = oldAuthor;
            editAuthor.className = "edit_author";

            const wrapper = document.createElement("div");
            wrapper.className = "title_reading_wrapper";
            wrapper.append(editTitle, editReading);

            titleDiv.replaceWith(wrapper);
            authorDiv.replaceWith(editAuthor);

            menuBtn.style.display = "none";
            const saveBtn = document.createElement("button");
            saveBtn.textContent = "保存";
            saveBtn.className = "save";
            itemDiv.appendChild(saveBtn);

            saveBtn.addEventListener("click", () => {
                const newTitle = editTitle.value.trim();
                const newReading = editReading.value.trim();
                const newAuthor = editAuthor.value.trim();

                if (!newTitle || !newReading || !newAuthor) {
                    alert("空欄は保存できません");
                    return;
                }

                fetch("index_books_manage.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        action: "update",
                        old_title: oldTitle,
                        old_reading: reading,
                        old_author: oldAuthor,
                        new_title: newTitle,
                        new_reading: newReading,
                        new_author: newAuthor
                    }).toString()
                })
                .then(res => {
                    if (!res.ok) throw new Error("books.txt の更新に失敗しました");
                    const newTitleDiv = document.createElement("div");
                    newTitleDiv.className = "showed_title";
                    newTitleDiv.textContent = newTitle;

                    const newAuthorDiv = document.createElement("div");
                    newAuthorDiv.className = "showed_author";
                    newAuthorDiv.textContent = newAuthor;

                    wrapper.replaceWith(newTitleDiv);
                    editAuthor.replaceWith(newAuthorDiv);
                    itemDiv.dataset.reading = newReading;

                    saveBtn.remove();
                    menuBtn.style.display = "";
                    sortList(sortSelect.value);
                })
                .catch(e => alert(e.message));
            });
        });

        // --- 削除処理 ---
        deleteItem.addEventListener("click", () => {
            menu.style.display = "none";
            if (!confirm("この本を削除しますか？")) return;

            fetch("index_books_manage.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    action: "delete",
                    title: titleDiv.textContent,
                    reading,
                    author: authorDiv.textContent
                }).toString()
            })
            .then(res => {
                if (!res.ok) throw new Error("削除に失敗しました");
                itemDiv.remove();
            })
            .catch(e => alert(e.message));
        });
    }

    function initializeAllMenus() {
        document.querySelectorAll(".list").forEach(item => createMenuButtonForItem(item));
    }

    sortSelect.addEventListener("change", () => sortList(sortSelect.value));
    initializeAllMenus();
    sortList("new");

    // --- フォーム送信処理 ---
    form.addEventListener("submit", e => {
        e.preventDefault();
        const title = inputTitle.value.trim();
        const reading = inputReading.value.trim();
        const author = inputAuthor.value.trim();

        if (!title || !reading || !author) {
            alert("すべての項目を入力してください");
            return;
        }

        const now = new Date();
        const fullDateTime = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

        const phpParams = new URLSearchParams({
            action: "add",
            title, reading, author, date: fullDateTime
        });

        fetch("index_books_manage.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: phpParams.toString()
        })
        .then(res => {
            if (!res.ok) throw new Error("リスト保存に失敗しました");

            const newDiv = document.createElement("div");
            newDiv.className = "list";
            newDiv.dataset.reading = reading;

            const titleDiv = document.createElement("div");
            titleDiv.className = "showed_title";
            titleDiv.textContent = title;

            const authorDiv = document.createElement("div");
            authorDiv.className = "showed_author";
            authorDiv.textContent = author;

            const dateDiv = document.createElement("div");
            dateDiv.className = "showed_date";
            dateDiv.dataset.date = fullDateTime;
            dateDiv.textContent = getSmartDateLabel(new Date(fullDateTime));

            newDiv.append(titleDiv, authorDiv, dateDiv);
            content.appendChild(newDiv);

            createMenuButtonForItem(newDiv);
            form.reset();
            sortList(sortSelect.value);
        })
        .catch(err => alert(err.message));

        // --- API送信 ---
        fetch("https://backend-5x35.onrender.com/api/books", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, reading, author })
        })
        .then(res => {
            if (!res.ok) return res.text().then(txt => { throw new Error(`APIエラー: ${txt}`); });
            return res.json();
        })
        .then(data => {
            const books = data.similar_books || [];
            resultArea.textContent = ""; // クリア
            if (books.length > 0) {
                const table = document.createElement("table");
                table.className = "recommend_table";

                const header = document.createElement("tr");
                header.innerHTML = "<th>タイトル</th><th>著者</th>";
                table.appendChild(header);

                books.forEach(book => {
                    const row = document.createElement("tr");
                    row.innerHTML = `<td>${book.title}</td><td>${book.author}</td>`;
                    table.appendChild(row);
                });

                const h3 = document.createElement("h3");
                h3.textContent = "おすすめの本";
                resultArea.append(h3, table);
            } else {
                resultArea.textContent = "おすすめは見つかりませんでした。";
            }
        })
        .catch(err => {
            console.error("⚠ API送信失敗:", err.message);
            resultArea.textContent = `⚠ API送信失敗: ${err.message}`;
        });
    });
});