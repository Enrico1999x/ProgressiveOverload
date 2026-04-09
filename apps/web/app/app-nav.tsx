"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/plans/new", label: "New Plan" },
  { href: "/plans/current", label: "Current Plan" },
  { href: "/exercises", label: "Exercises" },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <header className="app-header">
      <div className="container app-header-inner">
        <Link href="/exercises" className="app-brand">
          Progressive Overload
        </Link>

        <nav className="app-nav" aria-label="Main navigation">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`app-nav-link ${isActive ? "active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
