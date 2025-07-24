document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('note_form');

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // ページリロード防止

    const formData = new FormData(form);

    fetch('index_impression_manage.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
  
      if (data.success) {
        const contentDiv = document.querySelector('.content');

        const noDataMsg = document.querySelector('.no-data');
        if (noDataMsg) noDataMsg.remove();

        const stars = "★".repeat(data.rating) + "☆".repeat(5 - data.rating);
        const newDiv = document.createElement('div');
        newDiv.className = 'list';
        newDiv.innerHTML = `
          <div class='showed_title'>${data.title}</div>
          <div class='showed_review'>評価：${stars}</div>
          <div class='showed_impression'>感想：「${data.impression}」</div>
          <div class='showed_date'>${data.date.slice(0, 10)}</div>
        `;
        contentDiv.prepend(newDiv);
        form.reset();
      } else {
        alert('送信失敗');
      }
    })
    .catch(err => {
      console.error('エラー:', err);
    });
  });

  const bookSelect = document.querySelector('select[name="book"]');
  const authorInput = document.getElementById('author');

  bookSelect.addEventListener('change', function () {
    const selectedTitle = this.value;
    authorInput.value = bookData[selectedTitle] || '';
  });

    // 初期化（選択されていたら自動表示）
  const selectedTitle = bookSelect.value;
  if (selectedTitle) {
    authorInput.value = bookData[selectedTitle] || '';
  }
});