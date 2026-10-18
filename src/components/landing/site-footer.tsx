import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md">
          <Wordmark />
          <p className="mt-4 text-sm leading-6 text-ink-soft">
            Service Launch Studio is the first product in MicroSAAS, a platform for starting and growing a
            business. This version keeps the draft in your browser.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <a href="#method" className="text-ink-soft hover:text-ink">
            Method
          </a>
          <a href="#scope" className="text-ink-soft hover:text-ink">
            Scope
          </a>
          <Link href="/studio" className="text-ink-soft hover:text-ink">
            Studio
          </Link>
        </nav>
      </div>
    </footer>
  );
}
