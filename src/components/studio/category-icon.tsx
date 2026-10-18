import type { CategoryId } from "@/lib/studio/types";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function CategoryIcon({ id }: { id: CategoryId }) {
  switch (id) {
    case "brand-design":
      return (
        <Icon>
          <path d="M12 3.8 18.2 20h-3.2l-1.1-2.8H10L8.9 20H5.8L12 3.8Z" />
          <path d="M10.6 14.2h2.8" />
        </Icon>
      );
    case "web-design":
      return (
        <Icon>
          <rect x="3.5" y="5" width="17" height="14" rx="2" />
          <path d="M3.5 9h17" />
        </Icon>
      );
    case "development":
      return (
        <Icon>
          <path d="M9 8 5 12l4 4" />
          <path d="m15 8 4 4-4 4" />
        </Icon>
      );
    case "writing":
      return (
        <Icon>
          <path d="M7 6.5h10" />
          <path d="M7 12h10" />
          <path d="M7 17.5h6" />
        </Icon>
      );
    case "marketing":
      return (
        <Icon>
          <path d="m4 16.5 5-5.5 3 3 7-7" />
          <path d="M15 7h4v4" />
        </Icon>
      );
    case "photo-video":
      return (
        <Icon>
          <circle cx="12" cy="12" r="7.5" />
          <circle cx="12" cy="12" r="2.4" />
        </Icon>
      );
    case "coaching":
      return (
        <Icon>
          <circle cx="9" cy="9" r="2.1" />
          <circle cx="15.8" cy="10" r="1.7" />
          <path d="M4.8 18.4c.6-2.3 2.2-3.5 4.2-3.5s3.5 1.2 4.1 3.5" />
          <path d="M14 18.4c.3-1.5 1.2-2.4 2.5-2.4 1.1 0 2 .7 2.4 2" />
        </Icon>
      );
    case "consulting":
      return (
        <Icon>
          <circle cx="12" cy="12" r="7.5" />
          <path d="M12 8.2v4l2.5 1.6" />
        </Icon>
      );
  }
}
