const base = "/api/tips";

export async function fetchTips(category) {
  const q = category
    ? `?category=${encodeURIComponent(category)}`
    : "";
  const res = await fetch(`${base}${q}`);
  if (!res.ok) throw new Error("Không tải được danh sách tips");
  return res.json();
}

export async function fetchTipBySlug(slug) {
  const res = await fetch(`${base}/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Không tải được chi tiết");
  return res.json();
}
