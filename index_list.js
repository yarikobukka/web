document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("book_form");
  const content = document.querySelector(".content");
  const sortSelect = document.getElementById("select_order");
  const titleInput = document.getElementById("title");
  const readingInput = document.getElementById("reading");
  const authorInput = document.getElementById("author");
  const resultArea = document.getElementById("result_area");

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

  function sortList(order = "new") {
    const items = Array.from(content.querySelectorAll(".list"));
    items.sort((a, b) => {
      const dateA = new Date(a.querySelector(".showed_date").getAttribute("data-date"));
      const dateB = new Date(b.querySelector(".showed_date").getAttribute("data-date"));
      if (order === "new") return dateB - dateA;
      if (order === "old") return dateA - dateB;
      if (order === "reading") {
        return (a.getAttribute("data-reading") || "").localeCompare(b.getAttribute("data-reading") || "", 'ja');
      }
    });
    items.forEach(item => content.appendChild(item));
    updateAllDateLabels();
  }

  function createMenuButtonForItem(itemDiv) {
    if (itemDiv.querySelector(".menu_button")) return;

    const titleDiv = itemDiv.querySelector(".showed_title");
    const authorDiv = itemDiv.querySelector(".showed_author");
    const dateDiv = itemDiv.querySelector(".showed_date");
    const reading = itemDiv.getAttribute("data-reading") || "";

    const menuBtn = document.createElement("button");
    menuBtn.innerHTML = "⋮";
    menuBtn.className = "menu_button";

    const menu = document.createElement("div");
    menu.className = "dropdown_menu";

    const editItem = document.createElement("div");
    editItem.textContent = "編集";
    editItem.className = "dropdown_item edit_item";

    const deleteItem = document.createElement("div");
    deleteItem.textContent = "削除";
    deleteItem.className = "dropdown_item delete_item";

    menu.appendChild(editItem);
    menu.appendChild(deleteItem);
    menuBtn.appendChild(menu);

    const dateMenuRow = document.createElement("div");
    dateMenuRow.className = "date_menu_row";
    dateMenuRow.appendChild(menuBtn);
    dateMenuRow.appendChild(dateDiv);
    itemDiv.appendChild(dateMenuRow);

    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isShown = menu.style.display === "block";
      menu.style.display = isShown ? "none" : "block";

      const menuRect = menu.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      if (menuRect.right > windowWidth) {
        menu.style.left = "auto";
        menu.style.right = "0";
        menu.style.transform = "none";
      } else {
        menu.style.left = "50%";
        menu.style.right = "auto";
        menu.style.transform = "translateX(-50%)";
      }
    });

    document.addEventListener("click", () => {
      menu.style.display = "none";
    });

    editItem.addEventListener("click", () => {
      menu.style.display = "none";
      const titleText = titleDiv.textContent;
      const authorText = authorDiv.textContent;
      const readingText = reading;

      const titleInput = document.createElement("input");
      titleInput.value = titleText;
      titleInput.className = "edit_title";

      const authorInput = document.createElement("input");
      authorInput.value = authorText;
      authorInput.className = "edit_author";

      const readingInput = document.createElement("input");
      readingInput.value = readingText;
      readingInput.className = "edit_reading";

      titleDiv.replaceWith(titleInput);
      authorDiv.replaceWith(authorInput);
      menuBtn.style.display = "none";

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "保存";
      saveBtn.className = "save";
      itemDiv.appendChild(saveBtn);

      saveBtn.addEventListener("click", () => {
        const newTitle = titleInput.value.trim();
        const newAuthor = authorInput.value.trim();
        const newReading = readingInput.value.trim();

        if (!newTitle || !newAuthor || !newReading) {
          alert("空欄は保存できません");
          return;
        }

        fetch("index_books_manage.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            action: "update",
            old_title: titleText,
            old_reading: readingText,
            old_author: authorText,
            new_title: newTitle,
            new_reading: newReading,
            new_author: newAuthor
          }).toString()
        }).then(res => {
          if (!res.ok) throw new Error("books.txt の更新に失敗しました");

          titleDiv.textContent = newTitle;
          authorDiv.textContent = newAuthor;
          itemDiv.setAttribute("data-reading", newReading);

          titleInput.replaceWith(titleDiv);
          authorInput.replaceWith(authorDiv);
          saveBtn.remove();
          menuBtn.style.display = "";
          sortList(sortSelect.value);
        }).catch(e => alert(e.message));
      });
    });

    deleteItem.addEventListener("click", () => {
      menu.style.display = "none";
      if (!confirm("この本を削除しますか？")) return;

      const titleText = titleDiv.textContent;
      const authorText = authorDiv.textContent;
      const readingText = reading;

      fetch("index_books_manage.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          action: "delete",
          title: titleText,
          reading: readingText,
          author: authorText
        }).toString()
      }).then(res => {
        if (!res.ok) throw new Error("削除に失敗しました");
        itemDiv.remove();
      }).catch(e => alert(e.message));
    });
  }

  function initializeAllMenus() {
    document.querySelectorAll(".list").forEach(item => {
      createMenuButtonForItem(item);
    });
  }

  sortSelect.addEventListener("change", () => sortList(sortSelect.value));
  initializeAllMenus();
  sortList("new");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const reading = readingInput.value.trim();
    const author = authorInput.value.trim();

    if (!title || !reading || !author) {
      alert("すべての項目を入力してください");
      return;
    }

    const now = new Date();
    const fullDateTime = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
        try {
      // ① ローカル保存（PHP）
      const localRes = await fetch("index_books_manage.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          action: "add",
          title,
          reading,
          author,
          date: fullDateTime
        }).toString()
      });

      if (!localRes.ok) throw new Error("ローカル保存に失敗しました");

      // ② DOMに新規追加
      const newDiv = document.createElement("div");
      newDiv.className = "list";
      newDiv.setAttribute("data-reading", reading);

      const titleDiv = document.createElement("div");
      titleDiv.className = "showed_title";
      titleDiv.textContent = title;

      const authorDiv = document.createElement("div");
      authorDiv.className = "showed_author";
      authorDiv.textContent = author;

      const dateDiv = document.createElement("div");
      dateDiv.className = "showed_date";
      dateDiv.setAttribute("data-date", fullDateTime);
      dateDiv.textContent = getSmartDateLabel(new Date(fullDateTime));

      newDiv.appendChild(titleDiv);
      newDiv.appendChild(authorDiv);
      newDiv.appendChild(dateDiv);
      content.appendChild(newDiv);

      createMenuButtonForItem(newDiv);

      // ③ 外部API送信（Render）
      const apiRes = await fetch("https://backend-5x35.onrender.com/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, reading, author })
      });

      if (!apiRes.ok) throw new Error(`API送信失敗（ステータス: ${apiRes.status}）`);

      const data = await apiRes.json();

      // ④ おすすめ本の表示
      const books = data.similar_books;
      resultArea.innerHTML = "<h3>おすすめの本</h3><table class='recommend_table'><tr><th>タイトル</th><th>著者</th></tr>" +
        books.map(book => `<tr><td>${book.title}</td><td>${book.author}</td></tr>`).join("") +
        "</table>";

      // ⑤ フォームリセットと並び替え
      form.reset();
      sortList(sortSelect.value);

    } catch (err) {
      resultArea.innerHTML = `<p>⚠ エラー: ${err.message}</p>`;
      console.error("送信エラー:", err);
    }
  });
});