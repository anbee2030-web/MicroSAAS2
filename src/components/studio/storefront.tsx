import { cn } from "@/lib/cn";
import { formatPriceLabel, isEmail, toPhoneHref, toWebsiteHref } from "@/lib/studio/format";
import type { ServiceCategory, ServiceOffer } from "@/lib/studio/types";

function Display({
  value,
  placeholder,
  className,
  as: Tag = "p",
}: {
  value: string;
  placeholder: string;
  className?: string;
  as?: "p" | "h2" | "span";
}) {
  const filled = value.trim().length > 0;
  return (
    <Tag className={cn(className, "break-words", filled ? "text-ink" : "text-ink-soft italic")}>
      {filled ? value : placeholder}
    </Tag>
  );
}

export function Storefront({
  offer,
  category,
  variant = "full",
  interactive = true,
}: {
  offer: ServiceOffer;
  category: ServiceCategory | null;
  variant?: "full" | "embedded" | "sample";
  interactive?: boolean;
}) {
  const compact = variant !== "full";
  const included = offer.included.filter((item) => item.text.trim());
  const email = offer.contact.email.trim();
  const phone = offer.contact.phone.trim();
  const website = offer.contact.website.trim();
  const websiteHref = toWebsiteHref(website);
  const phoneHref = toPhoneHref(phone);
  const location = offer.contact.location.trim();

  return (
    <article
      className={cn(
        "overflow-hidden border border-line bg-surface",
        variant === "full" ? "print-sheet rounded-[28px] shadow-[0_24px_70px_-36px_rgba(28,25,21,0.45)]" : "rounded-[24px]",
      )}
    >
      <div className={cn("px-6 sm:px-8", compact ? "py-6" : "py-8 sm:py-10")}>
        <p className={cn("text-xs font-medium uppercase tracking-[0.16em]", category ? "text-pine" : "text-ink-soft italic")}>
          {category?.name ?? "Service not selected"}
        </p>
        <Display
          as="h2"
          value={offer.businessName}
          placeholder="Your business name"
          className={cn("mt-3 font-display tracking-tight", compact ? "text-3xl" : "text-4xl sm:text-5xl")}
        />
        <Display
          value={offer.tagline}
          placeholder="A one-sentence promise."
          className={cn("mt-3 max-w-xl", compact ? "text-base" : "text-lg")}
        />
        <Display
          value={offer.description}
          placeholder="Describe who you help and what they leave with."
          className="mt-5 max-w-2xl text-sm leading-7"
        />

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-pine p-5 text-surface">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#d7e4df]">Investment</p>
            <p className="mt-2 font-display text-3xl tracking-tight">{formatPriceLabel(offer)}</p>
            <p className={cn("mt-2 text-sm", offer.deliveryWindow.trim() ? "text-[#d7e4df]" : "text-[#d7e4df] italic")}>
              {offer.deliveryWindow.trim() || "Delivery timing not set"}
            </p>
          </div>
          <div className="rounded-2xl bg-paper p-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brass">Includes</p>
            {included.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm leading-6 text-ink">
                {included.map((item) => (
                  <li key={item.id} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pine" aria-hidden="true" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm italic leading-6 text-ink-soft">What the client receives will show up here.</p>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-line pt-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brass">Contact</p>
          <dl className="mt-3 space-y-2 text-sm">
            <ContactRow label="Email">
              {email && interactive && isEmail(email) ? (
                <a className="text-pine underline decoration-brass underline-offset-4" href={`mailto:${email}`}>
                  {email}
                </a>
              ) : (
                <span className={email ? "text-ink" : "italic text-ink-soft"}>{email || "you@email.com"}</span>
              )}
            </ContactRow>
            <ContactRow label="Phone">
              {phone && interactive && phoneHref ? (
                <a className="text-pine underline decoration-brass underline-offset-4" href={phoneHref}>
                  {phone}
                </a>
              ) : (
                <span className={phone ? "text-ink" : "italic text-ink-soft"}>{phone || "Optional"}</span>
              )}
            </ContactRow>
            <ContactRow label="Location">
              <span className={location ? "text-ink" : "italic text-ink-soft"}>{location || "City or region"}</span>
            </ContactRow>
            <ContactRow label="Website">
              {website && interactive && websiteHref ? (
                <a
                  className="break-all text-pine underline decoration-brass underline-offset-4"
                  href={websiteHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  {website}
                </a>
              ) : (
                <span className={website ? "text-ink" : "italic text-ink-soft"}>{website || "Optional"}</span>
              )}
            </ContactRow>
          </dl>
        </div>
      </div>
    </article>
  );
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}
