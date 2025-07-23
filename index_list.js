document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("book_form");
  const content = document.querySelector(".content");
  const sortSelect = document.getElementById("select_order");
  const titleInput = document.querySelector(".input_title");
  const readingInput = document.querySelector(".input_reading");
  const authorInput = document.querySelector(".input_author");

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

  // --- メニューボタンとドロップダウンを追加・イベント設定する関数 ---
  function createMenuButtonForItem(itemDiv) {
  if (itemDiv.querySelector(".menu_button")) return;

  const titleDiv = itemDiv.querySelector(".showed_title");
  const authorDiv = itemDiv.querySelector(".showed_author");
  const dateDiv = itemDiv.querySelector(".showed_date");
  const reading = itemDiv.getAttribute("data-reading") || "";

  // メニューボタン
  const menuBtn = document.createElement("button");
  menuBtn.innerHTML = "⋮";
  menuBtn.className = "menu_button";

  // メニュー本体
  const menu = document.createElement("div");
  menu.className = "dropdown_menu";

  // メニュー項目 - 編集
  const editItem = document.createElement("div");
  editItem.textContent = "編集";
  editItem.className = "dropdown_item edit_item";

  // メニュー項目 - 削除
  const deleteItem = document.createElement("div");
  deleteItem.textContent = "削除";
  deleteItem.className = "dropdown_item delete_item";

  menu.appendChild(editItem);
  menu.appendChild(deleteItem);
  menuBtn.appendChild(menu);

  // メニューと日付をまとめる行を作成
  const dateMenuRow = document.createElement("div");
  dateMenuRow.className = "date_menu_row";
  dateMenuRow.appendChild(menuBtn);
  dateMenuRow.appendChild(dateDiv);

  // 挿入
  itemDiv.appendChild(dateMenuRow);

    // メニュー表示切替
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      const isShown = menu.style.display === "block";

      if (isShown) {
        menu.style.display = "none";
      } else {
        menu.style.display = "block";

      const menuRect = menu.getBoundingClientRect();
      const windowWidth = window.innerWidth;

        // はみ出す場合は右寄せに変更
        if (menuRect.right > windowWidth) {
          menu.style.left = "auto";
          menu.style.right = "0";
          menu.style.transform = "none";
        } else {
         // 通常の中央表示
          menu.style.left = "50%";
          menu.style.right = "auto";
          menu.style.transform = "translateX(-50%)";
        }
      }
    });
    document.addEventListener("click", () => {
      menu.style.display = "none";
    });

    // 編集クリック時
    editItem.addEventListener("click", () => {
      menu.style.display = "none";

      const titleText = titleDiv.textContent;
      const authorText = authorDiv.textContent;
      const readingText = reading;

      const titleInput = document.createElement("input");
      titleInput.value = titleText;
      titleInput.setAttribute('name', 'edit_title');
      titleInput.setAttribute('id', 'edit_title');
      titleInput.className = "edit_title";
      const authorInput = document.createElement("input");
      authorInput.value = authorText;
      authorInput.setAttribute('name', 'edit_author');
      authorInput.setAttribute('id', 'edit_author');
      authorInput.className = "edit_author";
      const readingInput = document.createElement("input");
      readingInput.value = readingText;
      readingInput.setAttribute('name', 'edit_reading');
      readingInput.setAttribute('id', 'edit_reading');
      readingInput.className = "edit_reading";

      titleDiv.replaceWith(titleInput);
      authorDiv.replaceWith(authorInput);
      menuBtn.style.display = "none";

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "保存";
      saveBtn.setAttribute('name', 'save');
      saveBtn.setAttribute('id', 'save');
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

    // 削除クリック時
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
      })
      .then(res => {
        if (!res.ok) throw new Error("削除に失敗しました");
        itemDiv.remove();
      })
      .catch(e => alert(e.message));
    });
  }

  // 既存のリスト要素にメニューボタンをセット（初期化）
  function initializeAllMenus() {
    document.querySelectorAll(".list").forEach(item => {
      createMenuButtonForItem(item);
    });
  }

  sortSelect.addEventListener("change", () => sortList(sortSelect.value));

  // ページロード時に初期化
  initializeAllMenus();
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
    const fullDateTime = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

    const params = new URLSearchParams({
      action: "add",
      title, reading, author, date: fullDateTime
    });

    fetch("index_books_manage.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
      dateDiv.textContent = getSmartDateLabel(new Date(fullDateTime));

      newDiv.appendChild(titleDiv);
      newDiv.appendChild(authorDiv);
      newDiv.appendChild(dateDiv);
      content.appendChild(newDiv);

      // 新規にメニューボタンを付与
      createMenuButtonForItem(newDiv);

      form.reset();
      sortList(sortSelect.value);
    })
    .catch(error => alert(error.message));
  });
});

// APIに送信するコード
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('book_form');

  form.addEventListener('submit', function (e) {
    // 入力値の取得
    const title = document.getElementById('title').value.trim();
    const reading = document.getElementById('reading').value.trim();
    const author = document.getElementById('author').value.trim();

    if (!title || !author) {
      alert('タイトルと著者は必須です。');
      return; // フォーム送信はキャンセルしない（PHP側でもバリデートする想定）
    }

    // API送信：fetchで非同期POST
    fetch('https://example.com/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, reading, author })
    })
    .then(response => {
      if (!response.ok) {
        console.warn('⚠ API送信失敗（ステータス:', response.status, '）');
      } else {
        console.log('✔ API送信成功');
      }
    })
    .catch(error => {
      console.error('⚠ 通信エラー:', error.message);
    });

    // ★ ここで return true; として送信を続行（PHPも動く）
    return true;
  });
});