"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Heart, CalendarDays, Camera, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Home", icon: Heart },
  { href: "/rsvp", label: "RSVP", icon: CalendarDays },
  { href: "/gallery", label: "Gallery", icon: Camera },
];

export function WeddingNav({ guestName }: { guestName: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="font-serif text-xl text-primary">
          {"S & M"}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-sans transition-colors",
                  isActive
                    ? "text-accent font-medium"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border">
            <span className="text-sm text-muted-foreground">
              Hello, {guestName}
            </span>
            <form action={logout}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 pb-4">
          <div className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-secondary text-accent font-medium"
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-border mt-2 pt-2 flex items-center justify-between px-3">
              <span className="text-sm text-muted-foreground">
                Hello, {guestName}
              </span>
              <form action={logout}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
