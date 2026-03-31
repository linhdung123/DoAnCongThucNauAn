import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTipBySlug } from "../api/tips.js";

export default function TipDetailPage() {
  const { slug } = useParams();
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchTipBySlug(slug)
      .then((data) => {
        if (!cancelled) {
          setTip(data);
          setError(data ? null : "Không tìm thấy");
        }
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
  }, [slug]);

  if (loading) {
    return (
      <p className="py-20 text-center text-neutral-500">Đang tải…</p>
    );
  }

  if (error || !tip) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-neutral-600">{error || "Không tìm thấy"}</p>
        <Link
          to="/tips"
          className="mt-6 inline-block font-semibold text-accent hover:text-accent-hover"
        >
          ← Quay lại Tips
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link
        to="/tips"
        className="text-sm font-medium text-accent hover:text-accent-hover"
      >
        ← Tips & mẹo
      </Link>
      <div className="mt-6 overflow-hidden rounded-2xl bg-neutral-100 shadow-card ring-1 ring-neutral-200/60">
        <div className="aspect-video max-h-[420px] bg-neutral-200">
          <img
            src={tip.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-6 md:p-8">
          <p className="text-sm font-medium text-accent">{tip.category}</p>
          <h1 className="mt-2 text-2xl font-bold text-neutral-900 md:text-3xl">
            {tip.title}
          </h1>
          <p className="mt-4 text-neutral-600">{tip.description}</p>
          <p className="mt-6 text-sm text-neutral-500">
            {tip.frequency || "Áp dụng hằng ngày"}
          </p>
        </div>
      </div>
    </article>
  );
}
