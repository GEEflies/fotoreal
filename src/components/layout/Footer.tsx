export function Footer() {
  return (
    <footer className="bg-foreground text-background py-4 sm:py-6">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-background/70">
          <span>© {new Date().getFullYear()} NehnuteľnostiBratislava</span>
          <span className="hidden sm:inline">•</span>
          <a href="#" className="hover:text-background transition-colors">Ochrana súkromia</a>
          <span className="hidden sm:inline">•</span>
          <a href="#" className="hover:text-background transition-colors">Podmienky</a>
        </div>
      </div>
    </footer>
  );
}
