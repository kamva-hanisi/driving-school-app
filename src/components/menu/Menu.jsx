export function Menu({ isOpen, onToggle }) {
  return (
    <button
      aria-controls="primary-navigation"
      aria-expanded={isOpen}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      className={`menu-toggle${isOpen ? " menu-toggle--open" : ""}`}
      onClick={onToggle}
      type="button"
    >
      <span className="menu-toggle__line" />
      <span className="menu-toggle__line" />
      <span className="menu-toggle__line" />
    </button>
  );
}
