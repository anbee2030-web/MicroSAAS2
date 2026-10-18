import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { getCategory } from "@/lib/studio/categories";
import { layoutSample } from "@/lib/studio/sample";
import { Storefront } from "@/components/studio/storefront";

const steps = [
  {
    index: "01",
    title: "Choose a service",
    body: "Start from a category such as design, writing, development, or coaching. The choice tells the rest of the studio what kind of offer you are shaping.",
  },
  {
    index: "02",
    title: "Write the offer",
    body: "Add the business name, a description, a price, and contact details. The fields are the ones a client needs before they can say yes.",
  },
  {
    index: "03",
    title: "Preview the storefront",
    body: "Watch a one-page storefront update as you type. Copy the summary, email it to yourself, or print it. The draft stays in this browser.",
  },
];

const included = [
  "Eight service categories to start from",
  "An editor for the name, description, price, and contact details",
  "A live storefront preview",
  "Saving on this device, in this browser",
];

const excluded = [
  "Accounts, or syncing a draft across devices",
  "Taking payment or booking a client",
  "Publishing the storefront to a public URL",
  "AI writing or idea generation",
];

export function HomePage() {
  const sampleCategory = getCategory(layoutSample.offer.categoryId);

  return (
    <div className="min-h-dvh bg-paper">
      <SiteHeader />
      <main id="content">
        <section className="hero-wash border-b border-line">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)] lg:py-24">
            <div className="studio-rise">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-brass">For a first freelance offer</p>
              <h1 className="mt-4 max-w-xl font-display text-5xl leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                Write the offer. Preview the storefront.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-ink-soft">
                Service Launch Studio walks you from a service category to a priced offer and a page you can show.
                This version runs entirely in your browser.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/studio">Open the studio</ButtonLink>
                <a href="#method" className={buttonClass("secondary")}>
                  See the method
                </a>
              </div>
              <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
                <li>No account</li>
                <li className="text-brass" aria-hidden="true">
                  /
                </li>
                <li>Saved in this browser</li>
                <li className="text-brass" aria-hidden="true">
                  /
                </li>
                <li>Free to use</li>
              </ul>
            </div>

            <div className="studio-rise studio-rise-delay">
              <div className="rounded-[28px] bg-sidebar p-2 shadow-[0_30px_80px_-36px_rgba(28,25,21,0.55)]">
                <div className="flex items-center gap-2 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="ml-2 text-xs text-sidebar-muted">Placeholder layout — not a real business</span>
                </div>
                <Storefront
                  offer={layoutSample.offer}
                  category={sampleCategory}
                  variant="sample"
                  interactive={false}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                The storefront in the studio uses your words. This sample only shows the layout.
              </p>
            </div>
          </div>
        </section>

        <section id="method" className="scroll-mt-20 border-b border-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-24">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-brass">Method</p>
              <h2 className="mt-3 font-display text-4xl tracking-tight text-ink">Three steps, then a page.</h2>
            </div>
            <ol className="border-t border-line">
              {steps.map((step) => (
                <li key={step.index} className="grid gap-3 border-b border-line py-8 sm:grid-cols-[88px_minmax(0,1fr)]">
                  <span className="font-display text-3xl text-brass">{step.index}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-ink">{step.title}</h3>
                    <p className="mt-2 max-w-xl text-base leading-7 text-ink-soft">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="scope" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-brass">Scope</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl tracking-tight text-ink">
              A working draft, with the limits written down.
            </h2>
            <div className="mt-10 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line md:grid-cols-2">
              <ScopeColumn title="In this version" items={included} />
              <ScopeColumn title="Not in this version" items={excluded} />
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-[32px] bg-pine px-6 py-12 text-surface sm:px-12 sm:py-16">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#e0c08a]">Open the studio</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl tracking-tight sm:text-5xl">
              Write the first version of the offer.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-[#d7e4df]">
              Nothing is published, and nothing is sent, until you copy, email, or print it yourself.
            </p>
            <div className="mt-8">
              <ButtonLink href="/studio" variant="inverse">
                Open the studio
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function ScopeColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-surface p-6 sm:p-8">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="border-t border-line pt-3 text-sm leading-6 text-ink-soft first:border-t-0 first:pt-0">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
