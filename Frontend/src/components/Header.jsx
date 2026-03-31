import { Link, NavLink } from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-sm">
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 3C9.5 3 7.5 4.8 7.1 7.1 5.4 7.5 4 9.1 4 11c0 1.2.5 2.3 1.3 3.1V20c0 .6.4 1 1 1h12.4c.6 0 1-.4 1-1v-5.9c.8-.8 1.3-1.9 1.3-3.1 0-1.9-1.4-3.5-3.1-3.9C16.5 4.8 14.5 3 12 3zm0 2c1.5 0 2.8 1 3.2 2.4-.4-.1-.8-.1-1.2-.1-1.8 0-3.4.6-4.6 1.6-.5-.9-.8-1.9-.8-3 0-.5.1-1 .2-1.4.6-.3 1.3-.5 2-.5zm-2.8 4.3c1.5-1.2 3.5-1.8 5.8-1.8.5 0 1 0 1.4.1 1.4.2 2.6 1.3 2.6 2.7 0 1.1-.7 2-1.7 2.4V19H8.4v-6.3c-1-.4-1.7-1.3-1.7-2.4 0-.9.5-1.7 1.3-2.2.4-.3.8-.6 1.2-.8z" />
        </svg>
      </span>
      <span className="font-semibold text-neutral-800 tracking-tight">
        Cooks Delight
      </span>
    </Link>
  );
}

const navClass = ({ isActive }) =>
  [
    "text-sm font-medium uppercase tracking-wide px-1 py-0.5 rounded-md transition-colors",
    isActive ? "text-accent" : "text-neutral-600 hover:text-neutral-900",
  ].join(" ");

export default function Header() {
  return (
    <header className="mx-auto max-w-6xl px-4 pt-6 pb-2">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-full bg-neutral-100/90 px-4 py-2.5 shadow-pill backdrop-blur-sm md:px-6">
        <Logo />
        <nav className="order-3 flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 md:order-none md:w-auto md:flex-1 md:justify-center">
          <NavLink to="/" className={navClass} end>
            Trang chủ
          </NavLink>
          <NavLink to="/muc-luc" className={navClass}>
            Mục lục
          </NavLink>
          <NavLink to="/yeu-thich" className={navClass}>
            Món yêu thích
          </NavLink>
          <NavLink to="/tips" className={navClass}>
            Tips
          </NavLink>
          <NavLink to="/gioi-thieu" className={navClass}>
            Giới thiệu
          </NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-600 shadow-sm ring-1 ring-neutral-200/80 transition hover:bg-neutral-50"
            aria-label="Tìm kiếm"
          >
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
          </button>
          <button
            type="button"
            className="rounded-full bg-neutral-800 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-neutral-900"
          >
            Cá nhân
          </button>
        </div>
      </div>
    </header>
  );
}
