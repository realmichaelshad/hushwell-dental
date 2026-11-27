"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { OpenNow } from "@/components/visit/OpenNow";
import { CONTACT, NAV } from "@/content/site";
import { cn } from "@/lib/cn";

/* ==========================================================================
   Header: a calm urgent-care note on top, then the logo, four links and one
   button. On phones the links move into a full-screen menu that traps
   nothing but focus order: Esc closes it and focus returns to the toggle.
   ========================================================================== */

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="bg-seaglass text-ink">
        <div className="container-page flex min-h-10 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center text-tiny sm:text-small lg:justify-between">
          <p>
            <span>
              <Icon name="alert" size={17} className="mr-1.5 inline-block -translate-y-px align-middle text-tide" />
              <span className="font-bold">Toothache today?</span>{" "}
              <span className="hidden sm:inline">We keep same-day slots open.</span>
              <span className="sm:hidden">Same-day slots open.</span>{" "}
              <Link
                href="/services/emergency-care"
                className="font-bold text-tide underline decoration-tide/30 underline-offset-4 hover:decoration-tide"
              >
                Emergency care
              </Link>
            </span>
          </p>
          <div className="hidden items-center gap-6 lg:flex">
            <OpenNow />
            <a href={CONTACT.phoneHref} className="font-display font-semibold hover:text-tide" data-contact>
              {CONTACT.phone}
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-mist/95 backdrop-blur-md transition-[border-color,box-shadow] duration-300",
          scrolled ? "border-line shadow-[0_8px_24px_-20px_rgb(18_48_47/0.5)]" : "border-transparent",
        )}
      >
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
          <Link href="/" aria-label="Hushwell Dental, home" className="flex items-center text-[1.15rem] whitespace-nowrap sm:text-[1.3rem]">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const current = isCurrent(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "rounded-full px-4 py-2.5 font-bold transition-colors",
                        current ? "bg-seaglass text-ink" : "text-ink-soft hover:bg-foam hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ButtonLink href="/book" className="min-h-11 px-4 sm:px-5">
              <span className="sm:hidden">Request</span>
              <span className="hidden sm:inline">Request a visit</span>
            </ButtonLink>
            <button
              ref={toggleRef}
              type="button"
              className="grid size-12 place-items-center rounded-full text-ink hover:bg-foam lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "close" : "menu"} size={26} />
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-x-0 top-[4.5rem] bottom-0 z-30 overflow-y-auto bg-mist lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page flex min-h-full flex-col pt-6 pb-10">
          <ul className="divide-y divide-line border-y border-line">
            {[{ href: "/", label: "Home" }, ...NAV].map((item, i) => (
              <li key={item.href}>
                <Link
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex min-h-16 items-center text-h3 font-bold aria-[current=page]:text-tide"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink href="/book" className="mt-8 w-full">
            Request a visit
          </ButtonLink>
          <a href={CONTACT.phoneHref} className="mt-3 flex min-h-12 items-center justify-center gap-2 font-display font-semibold text-tide" data-contact>
            <Icon name="phone" size={20} />
            Call {CONTACT.phone}
          </a>
          <p className="mt-auto pt-10 text-small text-ink-soft">
            Open weekdays from 8 am, Saturdays 9 to 2. Same-day emergency slots every day we're open.
          </p>
        </nav>
      </div>
    </>
  );
}
