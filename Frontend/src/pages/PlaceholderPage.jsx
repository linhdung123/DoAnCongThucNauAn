import { Link } from "react-router-dom";

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
      <p className="mt-3 text-neutral-600">{description}</p>
      <Link
        to="/tips"
        className="mt-8 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-filter transition hover:bg-accent-hover"
      >
        Xem Tips & mẹo
      </Link>
    </div>
  );
}
