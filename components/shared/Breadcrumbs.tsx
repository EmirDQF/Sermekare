import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: readonly BreadcrumbItem[];
  className?: string;
}

/** Migas de pan accesibles; el último elemento es la página actual. */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Ruta de navegación" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1">
              {current ? (
                <span aria-current="page" className="font-semibold text-heading">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="inline-flex min-h-12 min-w-12 items-center justify-center hover:text-primary">
                  {item.label}
                </Link>
              )}
              {current ? null : <ChevronRight aria-hidden className="size-4" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
