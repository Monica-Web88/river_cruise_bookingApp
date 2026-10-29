'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
const NAV = [
  { href: '/cruises', label: 'Find a cruise' },
  { href: '/#rivers', label: 'Destinations' },
  { href: '/#how', label: 'How it works' },
];
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Close the mobile menu after navigating.
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header className="sticky top-0 z-40 border-b border-sand-200/70 bg-cream-100/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" aria-label="Dream River Cruises, home" className="rounded-lg">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded text-sm font-medium text-bark-800 transition hover:text-mist-700"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/inquire" className="btn btn-primary !px-5 !py-2.5">
            Request a quote
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sand-300 bg-cream-50 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        hidden={!open}
        className="border-t border-sand-200 bg-cream-50 md:hidden"
      >
        <ul className="container-page flex flex-col gap-1 py-4">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-xl px-3 py-3 text-base font-medium hover:bg-sand-100"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <Link href="/inquire" className="btn btn-primary w-full">
              Request a quote
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
