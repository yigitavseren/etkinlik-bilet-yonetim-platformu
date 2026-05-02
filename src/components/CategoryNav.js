export const categories = [
  { id: "all", label: "Tümü", icon: "✨" },
  { id: "konser", label: "Konser", icon: "🎸" },
  { id: "tiyatro", label: "Tiyatro", icon: "🎭" },
  { id: "festival", label: "Festival", icon: "🎪" },
  { id: "elektronik", label: "Elektronik", icon: "🎧" },
  { id: "standup", label: "Stand-Up", icon: "🎤" },
  { id: "cocuk", label: "Çocuk", icon: "🎈" },
  { id: "workshop", label: "Atölye", icon: "🎨" },
  { id: "blog", label: "Seminer", icon: "📚" }
];

function CategoryNav({ currentCategory, setCategory }) {
  return (
    <div style={{
      display: "flex",
      gap: "12px",
      overflowX: "auto",
      padding: "20px 32px",
      borderBottom: "1px solid var(--border-color)",
      backgroundColor: "var(--bg-dark)",
      scrollbarWidth: "none", /* Firefox */
    }}>
      {categories.map((cat) => {
        const isActive = currentCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "999px",
              border: isActive ? "1px solid var(--primary)" : "1px solid var(--border-color)",
              backgroundColor: isActive ? "rgba(244, 63, 94, 0.1)" : "var(--bg-card)",
              color: isActive ? "var(--primary)" : "var(--text-main)",
              cursor: "pointer",
              fontWeight: isActive ? 600 : 400,
              whiteSpace: "nowrap",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if(!isActive) {
                e.currentTarget.style.backgroundColor = "var(--bg-card-hover)";
                e.currentTarget.style.borderColor = "var(--text-muted)";
              }
            }}
            onMouseLeave={(e) => {
              if(!isActive) {
                e.currentTarget.style.backgroundColor = "var(--bg-card)";
                e.currentTarget.style.borderColor = "var(--border-color)";
              }
            }}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryNav;
