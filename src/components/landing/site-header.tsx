import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { ButtonLink } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="rounded-xl" aria-label="Service Launch Studio home">
          <Wordmark />
        </Link>
        <nav aria-label="Page" className="flex items-center gap-2 sm:gap-6">
          <a href="#method" className="hidden text-sm text-ink-soft hover:text-ink sm:inline">
            Method
          </a>
          <a href="#scope" className="hidden text-sm text-ink-soft hover:text-ink sm:inline">
            Scope
          </a>
          <ButtonLink href="/studio">
            Open studio
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
