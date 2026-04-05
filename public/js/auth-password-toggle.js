(function () {
  document.querySelectorAll("[data-password-toggle]").forEach(function (btn) {
    var targetId = btn.getAttribute("aria-controls");
    var input = targetId ? document.getElementById(targetId) : null;
    if (!input || input.type !== "password") return;
    btn.addEventListener("click", function () {
      var hidden = input.type === "password";
      input.type = hidden ? "text" : "password";
      btn.setAttribute("aria-label", hidden ? "Ẩn mật khẩu" : "Hiện mật khẩu");
      btn.setAttribute("aria-pressed", hidden ? "true" : "false");
    });
  });
})();
