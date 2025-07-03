document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bookForm");
    if (!form) {
        console.error("form#bookForm が見つかりませんでした");
        return;
    }

    form.addEventListener("submit", function (e) {
        // フォーム送信時に JavaScript で追加処理を入れる場合はここに書く
        // 今は PHP に任せるので何もしない（リロードOK）
    });
});