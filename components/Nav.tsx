import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-primary">SMF</span>Clearinghouse
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/agents" className="hover:text-primary transition-colors">Agents</Link>
          <Link href="/llms" className="hover:text-primary transition-colors">LLMs</Link>
          <Link href="/deployment-recipes" className="hover:text-primary transition-colors">Recipes</Link>
          <Link href="/guides" className="hover:text-primary transition-colors">Guides</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
        </nav>
      </div>
    </header>
  );
}
