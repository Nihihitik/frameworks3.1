"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/iss", label: "МКС" },
  { href: "/osdr", label: "OSDR" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter text-foreground transition-opacity hover:opacity-80">
            <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)] animate-pulse" />
            Космический дашборд
          </Link>

          <div className="flex items-center gap-1 rounded-full bg-white/5 p-1 border border-white/5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_-5px_var(--color-primary)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
