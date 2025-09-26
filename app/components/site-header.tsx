"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/backtests", label: "Backtests" },
  { href: "/guide", label: "User guide" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 900px)");

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    handleChange(mediaQuery);

    const listener = (event: MediaQueryListEvent) => handleChange(event);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }

    mediaQuery.addListener(listener);
    return () => mediaQuery.removeListener(listener);
  }, []);

  const navClassName = `site-header__nav${isMenuOpen ? " site-header__nav--open" : ""}`;

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__branding">
          <Link
            href="/"
            className="site-header__logo"
            aria-label="BacktestLab home"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="site-header__mark" aria-hidden="true" />
            <span className="site-header__title">BacktestLab</span>
          </Link>
          <button
            type="button"
            className="site-header__menu-toggle"
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="sr-only">Toggle navigation</span>
            <svg
              aria-hidden="true"
              focusable="false"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              className="site-header__menu-icon"
            >
              {isMenuOpen ? (
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
        <nav aria-label="Primary" className={navClassName} id="primary-navigation">
          <ul className="site-nav">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="site-nav__link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={`site-header__actions${isMenuOpen ? " site-header__actions--visible" : ""}`}>
          <Link href="/login" className="button button--ghost">
            Log in
          </Link>
          <Link href="/signup" className="button button--primary">
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
