import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../api/recipes.js";
import { uploadRecipeImage } from "../api/upload.js";

const CATEGORY_OPTIONS = [
  "Chiên – Xào",
  "Nấu – Luộc",
  "Sơ chế",
  "Bảo quản",
  "Salad",
  "Mì & Pasta",
  "Khác",
];

function emptyForm() {
  return {
    name: "",
    description: "",
    category: "Chiên – Xào",
    imageUrl: "",
    ingredients: [{ name: "", amount: "" }],
    instructionsText: "",
  };
}

function recipeToForm(r) {
  return {
    name: r.name || "",
    description: r.description || "",
    category: r.category || "Chiên – Xào",
    imageUrl: r.imageUrl || "",
    ingredients:
      Array.isArray(r.ingredients) && r.ingredients.length
        ? r.ingredients.map((i) => ({
            name: i.name || "",
            amount: i.amount || "",
          }))
        : [{ name: "", amount: "" }],
    instructionsText: Array.isArray(r.instructions)
      ? r.instructions.join("\n")
      : "",
  };
}

function PencilIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export default function RecipeManagePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchRecipes();
      setRecipes(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploadingImage(true);
    try {
      const { imageUrl } = await uploadRecipeImage(file);
      setForm((f) => ({ ...f, imageUrl }));
    } catch (err) {
      setError(err.message);
      e.target.value = "";
    } finally {
      setUploadingImage(false);
    }
  };

  const buildPayload = () => {
    const ingredients = form.ingredients
      .map((i) => ({
        name: i.name.trim(),
        amount: i.amount.trim(),
      }))
      .filter((i) => i.name);
    const instructions = form.instructionsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    return {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      imageUrl: form.imageUrl.trim(),
      ingredients,
      instructions,
    };
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = buildPayload();
    if (!payload.name || !payload.category || !payload.imageUrl) {
      setError(
        "Vui lòng nhập tên món, danh mục và ảnh (tải từ máy hoặc dán link)."
      );
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updateRecipe(editingId, payload);
      } else {
        await createRecipe(payload);
      }
      await load();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (r) => {
    setEditingId(r._id);
    setForm(recipeToForm(r));
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa món "${name}"?`)) return;
    setError(null);
    try {
      await deleteRecipe(id);
      if (editingId === id) resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const setIngredient = (index, field, value) => {
    setForm((f) => {
      const next = [...f.ingredients];
      next[index] = { ...next[index], [field]: value };
      return { ...f, ingredients: next };
    });
  };

  const addIngredientRow = () => {
    setForm((f) => ({
      ...f,
      ingredients: [...f.ingredients, { name: "", amount: "" }],
    }));
  };

  const removeIngredientRow = (index) => {
    setForm((f) => {
      if (f.ingredients.length <= 1) return f;
      const next = f.ingredients.filter((_, i) => i !== index);
      return { ...f, ingredients: next };
    });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
          Quản lý món ăn
        </h1>
        <p className="mt-2 text-neutral-600">
          Thêm và chỉnh sửa món ăn yêu thích
        </p>
      </div>

      {error && (
        <p className="mt-6 whitespace-pre-line rounded-xl bg-red-50 px-4 py-3 text-left text-sm leading-relaxed text-red-800 ring-1 ring-red-200 sm:text-center">
          {error}
        </p>
      )}

      <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:max-w-md">
          <form
            onSubmit={handleSave}
            className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-neutral-200/70"
          >
            <div className="bg-neutral-200/90 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-neutral-700">
              Nhập thông tin và hướng dẫn nấu ăn
            </div>
            <div className="space-y-4 p-5">
              <div>
                <label className="block text-sm font-semibold text-neutral-800">
                  Tên món ăn
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ví dụ: Cánh gà chiên nước mắm"
                  className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-sm outline-none ring-accent/0 transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-800">
                  Mô tả món ăn
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Ví dụ: Món ăn đậm đà"
                  className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-800">
                  Danh mục
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-neutral-800">
                    Nguyên liệu
                  </label>
                  <button
                    type="button"
                    onClick={addIngredientRow}
                    className="text-xs font-semibold text-accent hover:text-accent-hover"
                  >
                    + Thêm dòng
                  </button>
                </div>
                <ul className="mt-2 space-y-2">
                  {form.ingredients.map((ing, idx) => (
                    <li
                      key={idx}
                      className="flex gap-2 rounded-xl border border-neutral-200 bg-neutral-50/30 p-2"
                    >
                      <input
                        type="text"
                        value={ing.name}
                        onChange={(e) =>
                          setIngredient(idx, "name", e.target.value)
                        }
                        placeholder="Tên (vd: Thịt gà)"
                        className="min-w-0 flex-1 rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-accent"
                      />
                      <input
                        type="text"
                        value={ing.amount}
                        onChange={(e) =>
                          setIngredient(idx, "amount", e.target.value)
                        }
                        placeholder="500g"
                        className="w-24 shrink-0 rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-accent sm:w-28"
                      />
                      {form.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredientRow(idx)}
                          className="shrink-0 rounded-lg px-2 text-xs text-red-600 hover:bg-red-50"
                          aria-label="Xóa dòng"
                        >
                          ×
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-800">
                  Hướng dẫn nấu
                </label>
                <p className="mt-0.5 text-xs text-neutral-500">
                  Mỗi dòng là một bước (vd: Bước 1: Ướp gà 15 phút)
                </p>
                <textarea
                  value={form.instructionsText}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, instructionsText: e.target.value }))
                  }
                  rows={5}
                  placeholder="Bước 1: …&#10;Bước 2: …"
                  className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-800">
                  Ảnh món
                </label>
                <p className="mt-0.5 text-xs text-neutral-500">
                  Tải file (JPEG, PNG, GIF, WebP, SVG, BMP, ICO — tối đa 5MB) hoặc
                  dán link ảnh bên dưới.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.heic,.heif"
                  onChange={handleImageFile}
                  className="mt-2 block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-accent-hover"
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <p className="mt-1 text-xs text-neutral-500">Đang tải ảnh…</p>
                )}
                {form.imageUrl && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                    <img
                      src={form.imageUrl}
                      alt="Xem trước"
                      className="mx-auto max-h-40 w-full object-contain"
                    />
                  </div>
                )}
                <label className="mt-3 block text-xs font-medium text-neutral-600">
                  Hoặc dán link ảnh (URL)
                </label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, imageUrl: e.target.value }))
                  }
                  placeholder="https://… hoặc /uploads/… sau khi tải lên"
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600 disabled:opacity-60"
                >
                  {saving ? "Đang lưu…" : "Lưu món ăn"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700"
                >
                  Huỷ
                </button>
              </div>
              {editingId && (
                <p className="text-center text-xs text-accent">
                  Đang sửa món — nhấn Huỷ để thêm món mới
                </p>
              )}
            </div>
          </form>
        </aside>

        <section className="min-w-0 flex-1">
          {loading ? (
            <p className="py-12 text-center text-neutral-500">Đang tải…</p>
          ) : recipes.length === 0 ? (
            <p className="rounded-2xl bg-white py-12 text-center text-neutral-500 shadow-card ring-1 ring-neutral-200/70">
              Chưa có món nào. Thêm mới hoặc chạy{" "}
              <code className="rounded bg-neutral-100 px-1 text-sm">
                npm run seed:recipes
              </code>{" "}
              trong Backend.
            </p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2">
              {recipes.map((r) => (
                <li key={r._id}>
                  <article className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-neutral-200/70">
                    <div className="aspect-[4/3] bg-neutral-200">
                      <img
                        src={r.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="text-center text-base font-bold text-neutral-900">
                        {r.name}
                      </h2>
                      <div className="mt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(r)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100"
                        >
                          <PencilIcon />
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(r._id, r.name)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          <TrashIcon />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
