const base = "/api/recipes";

/** Gợi ý khi không gọi được API (ECONNREFUSED, proxy 500, v.v.) */
function connectionHelpLine(actionShort) {
  return [
    `${actionShort} — trang web không nối được máy chủ API (cổng 5000).`,
    "",
    "Cách xử lý:",
    "1) Mở terminal mới → cd thư mục Backend → chạy: npm run dev",
    "2) Để cửa sổ đó mở (thấy dòng “API chạy tại http://localhost:5000”).",
    "3) Bật MongoDB trên máy.",
    "4) F5 lại trang này.",
  ].join("\n");
}

async function handleRecipesResponse(res, fallbackMsg) {
  if (res.ok) return res.json();
  const err = await res.json().catch(() => ({}));
  const msg = err.message;
  if (
    !msg &&
    (res.status === 502 || res.status === 503 || res.status === 504 || res.status === 500)
  ) {
    throw new Error(connectionHelpLine(fallbackMsg.replace(/\.$/, "")));
  }
  throw new Error(msg || fallbackMsg);
}

async function recipesFetch(url, init, fallbackMsg) {
  let res;
  try {
    res = await fetch(url, init);
  } catch (e) {
    if (e instanceof TypeError || /network|fetch/i.test(String(e.message))) {
      throw new Error(connectionHelpLine(fallbackMsg.replace(/\.$/, "")));
    }
    throw e;
  }
  return handleRecipesResponse(res, fallbackMsg);
}

export function fetchRecipes() {
  return recipesFetch(base, undefined, "Không tải danh sách món.");
}

export function createRecipe(payload) {
  return recipesFetch(
    base,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "Không lưu được món."
  );
}

export function updateRecipe(id, payload) {
  return recipesFetch(
    `${base}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "Không cập nhật được món."
  );
}

export function deleteRecipe(id) {
  return recipesFetch(
    `${base}/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    "Không xóa được món."
  );
}
