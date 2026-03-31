export async function uploadRecipeImage(file) {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    body: fd,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Không tải được ảnh lên");
  }
  return res.json();
}
