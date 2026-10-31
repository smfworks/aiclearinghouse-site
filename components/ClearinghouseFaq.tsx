import { CLEARINGHOUSE_FAQS } from "@/lib/clearinghouse-faq";

export default function ClearinghouseFaq({ className = "mx-auto w-full max-w-3xl px-6 py-16" }: { className?: string }) {
  return (
    <section className={`not-prose ${className}`} aria-labelledby="clearinghouse-faq-heading">
      <h2 id="clearinghouse-faq-heading" className="text-2xl font-semibold tracking-tight text-foreground">
        Frequently asked questions
      </h2>
      <div className="mt-8 space-y-8">
        {CLEARINGHOUSE_FAQS.map((faq) => (
          <div key={faq.question}>
            <h3 className="text-lg font-medium text-foreground">{faq.question}</h3>
            <p className="mt-2 leading-relaxed text-foreground-secondary">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
