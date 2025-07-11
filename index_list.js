document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("bookForm");
  const content = document.querySelector(".content");
  const sortSelect = document.getElementById("sort_order");

  // 日付取得（data-date 属性を利用）
  function getDateFromElement(el) {
    const dateAttr = el.querySelector(".showed_date")?.getAttribute("data-date") || "";
    return new Date(dateAttr);
  }

  // 並び替え処理
  function sortList(order = "new") {
    const items = Array.from(content.querySelectorAll(".list"));

    items.sort((a, b) => {
      const dateA = getDateFromElement(a);
      const dateB = getDateFromElement(b);
      return order === "new" ? dateB - dateA : dateA - dateB;
    });

    items.forEach(item => content.appendChild(item));
  }

  // 初期表示：新しい順
  sortList("new");

  // セレクトボックス変更イベント
  sortSelect.addEventListener("change", function () {
    const order = sortSelect.value;
    sortList(order);
  });

  // フォーム送信時の処理
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = form.querySelector('.input_title').value.trim();
    const author = form.querySelector('.input_author').value.trim();

    if (!title || !author) {
      alert("タイトルと著者を入力してください。");
      return;
    }

    const now = new Date();
    const dateStr = now.getFullYear() + "/" +
                    String(now.getMonth() + 1).padStart(2, "0") + "/" +
                    String(now.getDate()).padStart(2, "0");
    const timeStr = String(now.getHours()).padStart(2, "0") + ":" +
                    String(now.getMinutes()).padStart(2, "0") + ":" +
                    String(now.getSeconds()).padStart(2, "0");
    const fullDateTime = `${dateStr} ${timeStr}`;

    fetch("save_book.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`
    })
    .then(response => {
      if (!response.ok) throw new Error("保存に失敗しました");

      // 新しい要素を作成
      const newDiv = document.createElement("div");
      newDiv.className = "list";

      const titleDiv = document.createElement("div");
      titleDiv.className = "showed_title";
      titleDiv.textContent = title;

      const authorDiv = document.createElement("div");
      authorDiv.className = "showed_author";
      authorDiv.textContent = author;

      const dateDiv = document.createElement("div");
      dateDiv.className = "showed_date";
      dateDiv.setAttribute("data-date", fullDateTime);
      dateDiv.textContent = dateStr;

      newDiv.appendChild(titleDiv);
      newDiv.appendChild(authorDiv);
      newDiv.appendChild(dateDiv);

      content.insertBefore(newDiv, content.firstChild);

      form.reset();

      // 現在の並び順で再ソート
      sortList(sortSelect.value);
    })
    .catch(error => {
      alert(error.message);
    });
  });
});