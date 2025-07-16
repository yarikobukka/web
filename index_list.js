document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM読み込み完了");
  const form = document.getElementById("book_form");

  form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("submitイベント発火");
});

  });

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("book_form");
  const content = document.querySelector(".content");
  const sortSelect = document.getElementById("select_order");
  const titleInput = document.querySelector(".input_title");
  const readingInput = document.querySelector(".input_reading");
  const authorInput = document.querySelector(".input_author");

  function sortList(order = "new") {
    const items = Array.from(content.querySelectorAll(".list"));
    items.sort((a, b) => {
      if (order === "new" || order === "old") {
        const dateA = new Date(a.querySelector(".showed_date").getAttribute("data-date"));
        const dateB = new Date(b.querySelector(".showed_date").getAttribute("data-date"));
        return order === "new" ? dateB - dateA : dateA - dateB;
      } else if (order === "reading") {
        const aReading = a.getAttribute("data-reading") || "";
        const bReading = b.getAttribute("data-reading") || "";
        return aReading.localeCompare(bReading, 'ja');
      }
    });
    items.forEach(item => content.appendChild(item));
  }

  sortSelect.addEventListener("change", () => sortList(sortSelect.value));
  sortList("new");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const reading = readingInput.value.trim();
    const author = authorInput.value.trim();

    if (!title || !reading || !author) {
      alert("すべての項目を入力してください");
      return;
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    const fullDateTime = `${dateStr} ${timeStr}`;

    const params = new URLSearchParams({
      title: title,
      reading: reading,
      author: author,
      date: fullDateTime
    });

    fetch("index_save_book.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    })
    .then(response => {
      if (!response.ok) throw new Error("保存に失敗しました");

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
      dateDiv.textContent = dateStr;

      newDiv.appendChild(titleDiv);
      newDiv.appendChild(authorDiv);
      newDiv.appendChild(dateDiv);
      content.appendChild(newDiv);

      form.reset();
      sortList(sortSelect.value);
    })
    .catch(error => {
      alert(error.message);
    });
  });
});