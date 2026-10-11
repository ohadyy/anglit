import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalDocs, legalUpdatedAt } from "@/content/legal";

export function generateStaticParams() {
  return legalDocs.map((doc) => ({ slug: doc.slug }));
}

async function findDoc(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  return legalDocs.find((d) => d.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const doc = await findDoc(params);
  return { title: doc?.title ?? "מסמך" };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const doc = await findDoc(params);
  if (!doc) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-16 pt-4 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{doc.title}</h1>
      <p className="mt-2 text-sm opacity-70">עודכן לאחרונה: {legalUpdatedAt}</p>

      <div className="mt-8 flex flex-col gap-8">
        {doc.sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-xl font-bold">{s.title}</h2>
            <div className="mt-3 flex flex-col gap-3 leading-relaxed opacity-90">
              {s.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
