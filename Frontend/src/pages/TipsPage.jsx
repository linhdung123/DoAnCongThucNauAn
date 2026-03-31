import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTips } from "../api/tips.js";

const CATEGORIES = [
  "Chiên – Xào",
  "Nấu – Luộc",
  "Sơ chế",
  "Bảo quản",
];

function ClockIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-neutral-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export default function TipsPage() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchTips(activeCategory || undefined)
      .then((data) => {
        if (!cancelled) setTips(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl lg:text-[2.75rem]">
          Tips & mẹo nấu ăn
        </h1>
        <p className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-sm text-neutral-700 md:text-base">
          <span>
            Những bí quyết giúp bạn nấu ăn ngon – nhanh – chuẩn vị hơn mỗi
            ngày
          </span>
          <span className="inline-flex text-neutral-400" aria-hidden>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={[
            "rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md transition",
            activeCategory === null
              ? "bg-neutral-700 shadow-neutral-400/30 ring-2 ring-neutral-900/20"
              : "bg-neutral-400 hover:bg-neutral-500",
          ].join(" ")}
        >
          Tất cả
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={[
              "rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-filter transition hover:bg-accent-hover",
              activeCategory === cat ? "bg-accent ring-2 ring-accent/40" : "bg-accent/90",
            ].join(" ")}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-10 text-center text-red-600">
          {error} — Hãy chạy backend và MongoDB, sau đó{" "}
          <code className="rounded bg-neutral-200 px-1 text-sm">npm run seed</code>{" "}
          trong thư mục Backend.
        </p>
      )}

      {loading && !error && (
        <p className="mt-16 text-center text-neutral-500">Đang tải…</p>
      )}

      {!loading && !error && tips.length === 0 && (
        <p className="mt-16 text-center text-neutral-500">
          Chưa có tips. Chạy seed trong Backend để thêm dữ liệu mẫu.
        </p>
      )}

      <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {tips.map((tip) => (
          <li key={tip._id || tip.slug}>
            <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-neutral-100/80 shadow-card ring-1 ring-neutral-200/60">
              <div className="aspect-[4/3] overflow-hidden bg-neutral-200">
                <img
                  src={tip.imageUrl}
                  alt=""
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h2 className="text-base font-bold text-neutral-900">
                  {tip.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-neutral-600">
                  {tip.description}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500">
                  <ClockIcon />
                  <span>{tip.frequency || "Áp dụng hằng ngày"}</span>
                </div>
                <Link
                  to={`/tips/${tip.slug}`}
                  className="mt-4 text-sm font-semibold text-accent hover:text-accent-hover"
                >
                  Xem chi tiết
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
