import { businessDetails } from "@/content/legal";
import { copy } from "@/content/copy";
import { getProduct } from "@/content/pricingCopy";
import { blogPosts } from "@/content/blog";
import { institutions } from "@/content/institutions";
import { levelPages } from "@/content/levelPages";
import { GROUP_SIZE_TEXT } from "@/content/facts";
import { INDEXED_PAGES } from "@/lib/nav";
import { site } from "@/lib/site";

// llms.txt (llmstxt.org convention): a short, plain-text index for AI crawlers.
// The page list is lib/nav.ts, the same one /llm-information and the sitemap use.
export function GET() {
  const coursePrice = getProduct("course")?.priceIls;
  const body = `# ${site.name}

> ${copy.seoDescription}

${site.name} הוא קורס הכנה היברידי של שבוע למבחן אמירנט: מפגשי זום בקבוצה קטנה של ${GROUP_SIZE_TEXT}, תרגול יומי באתר בין המפגשים, ומבחן פתיחה ומבחן סיום שמודד שיפור. מחיר הסמינר: ${coursePrice} ₪, תשלום חד פעמי.

${copy.footerDisclaimer}

Contact: ${businessDetails.email} · WhatsApp ${businessDetails.phone} · Instagram ${businessDetails.instagram} · Google ${site.googleBusinessUrl}

## Pages

${INDEXED_PAGES.map((p) => `- [${p.title}](${site.url}${p.path}): ${p.description}`).join("\n")}

## איזה ציון אמירנט צריך בכל מוסד

${institutions.map((i) => `- [${i.name}](${site.url}/amirnet/${i.slug}): ${i.answer}`).join("\n")}

## רמות האנגלית (טרום בסיסי עד מתקדמים ב׳)

${levelPages.map((l) => `- [${l.name}](${site.url}/amirnet/level/${l.slug}): ${l.answer}`).join("\n")}

## Blog posts

${blogPosts.map((p) => `- [${p.title}](${site.url}/blog/${p.slug}): ${p.description}`).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
