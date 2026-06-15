export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border py-10">
      <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} AI Clearinghouse. Independent guidance for AI builders.</p>
      </div>
    </footer>
  );
}
