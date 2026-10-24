import { site } from "@/lib/site";

// Home › [parent ›] page, as schema.org BreadcrumbList. `path` is e.g. "/blog/my-post".
export function BreadcrumbJsonLd({ trail }: { trail: { name: string; path: string }[] }) {
  const items = [{ name: "Anglit", path: "" }, ...trail];
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}
