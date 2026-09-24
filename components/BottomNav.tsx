export function BottomNav({ active = "discover" }: { active?: "discover" | "messages" | "saved" }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <button className={active === "discover" ? "nav-icon active" : "nav-icon"} aria-label="Discover">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/></svg>
      </button>
      <button className={active === "messages" ? "nav-icon active" : "nav-icon"} aria-label="Messages">
        <svg viewBox="0 0 24 24"><path d="M4 5.5h16v11H9l-5 3v-14Z"/></svg>
      </button>
      <button className={active === "saved" ? "nav-icon active" : "nav-icon"} aria-label="Saved">
        <svg viewBox="0 0 24 24"><path d="M7 3h10v18l-5-3-5 3V3Z"/></svg>
      </button>
    </nav>
  );
}
