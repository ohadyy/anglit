import { businessDetails } from "@/content/legal";
import { copy } from "@/content/copy";
import { products } from "@/content/pricingCopy";
import { blogPosts } from "@/content/blog";
import { site } from "@/lib/site";

// llms.txt (llmstxt.org convention): a short, plain-text index for AI crawlers.
// Kept in sync with /llm-information, which has the full structured version.
export function GET() {
  const coursePrice = products.find((p) => p.id === "course")?.price;
  const body = `# Anglit

> ${copy.seoDescription}

Anglit הוא קורס הכנה היברידי של שבוע למבחן אמירנט: מפגשי זום בקבוצה קטנה של 5–6 אנשים, תרגול יומי באתר בין המפגשים, ומבחן פתיחה ומבחן סיום שמודד שיפור. מחיר הסמינר: ${coursePrice} ₪, תשלום חד פעמי.

${copy.footerDisclaimer}

Contact: ${businessDetails.email} · WhatsApp ${businessDetails.phone} · Instagram ${businessDetails.instagram} · Google ${site.googleBusinessUrl}

## Pages

- [מידע מובנה ל-AI](${site.url}/llm-information): כל העובדות על Anglit במקום אחד, לציטוט
- [דף הבית](${site.url}/): ההצעה, ההתחייבות, שלושת סוגי השאלות
- [תרגול חינם](${site.url}/practice): שאלות אמירנט לדוגמה בלי הרשמה
- [מה צריך לדעת על אמירנט](${site.url}/amirnet): מבנה המבחן, ציון, הרשמה ומחיר
- [מחשבון ציון](${site.url}/score): ציון אמירנט ← רמת שיבוץ
- [מחירים](${site.url}/pricing): המסלולים ומה כלול בכל אחד
- [מורה פרטי לאמירנט](${site.url}/private-tutor): מורה אמיתי, לא אפליקציה - איך זה עובד
- [בלוג](${site.url}/blog): מאמרים מקוריים על הכנה לאמירנט

## Blog posts

${blogPosts.map((p) => `- [${p.title}](${site.url}/blog/${p.slug}): ${p.description}`).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
