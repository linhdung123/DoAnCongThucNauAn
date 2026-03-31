import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">
        Chào mừng đến Cooks Delight
      </h1>
      <p className="mt-4 text-lg text-neutral-600">
        Công thức, tips và mẹo nấu ăn giúp bạn vào bếp tự tin hơn mỗi ngày.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          to="/tips"
          className="rounded-full bg-accent px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-filter transition hover:bg-accent-hover"
        >
          Tips & mẹo nấu ăn
        </Link>
        <Link
          to="/muc-luc"
          className="rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-800 shadow-card ring-1 ring-neutral-200 transition hover:bg-neutral-50"
        >
          Mục lục
        </Link>
      </div>
    </div>
  );
}
