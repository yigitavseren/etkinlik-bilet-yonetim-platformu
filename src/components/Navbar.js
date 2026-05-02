import { useState, useContext, useMemo, useRef, useEffect } from "react";
import { Search, User, Ticket, Settings, MapPin, Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { EventContext } from "../context/EventContext";
import { AuthContext } from "../context/AuthContext";
import LoginModal from "./LoginModal";

function Navbar() {
  const [hover, setHover] = useState(false);
  const { events } = useContext(EventContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return events.filter(e => 
      e.name.toLowerCase().includes(query) || 
      e.artist.toLowerCase().includes(query) ||
      e.venue.toLowerCase().includes(query)
    ).slice(0, 5); // En fazla 5 sonuç göster
  }, [searchQuery, events]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (id) => {
    setSearchQuery("");
    setIsDropdownOpen(false);
    navigate(`/bilet/${id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleResultClick(searchResults[0].id);
    }
  };

  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 32px",
      backgroundColor: "var(--bg-card)",
      borderBottom: "1px solid var(--border-color)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      boxShadow: "var(--shadow-sm)"
    }}>
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", color: "var(--primary)" }}>
        <Ticket size={28} />
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: "24px" }}>BiletBul</h2>
      </Link>

      <div ref={searchRef} style={{
        position: "relative",
        width: "40%",
        maxWidth: "500px"
      }}>
        <Search size={18} style={{ position: "absolute", left: "12px", top: "11px", color: "var(--text-muted)" }} />
        <input
          placeholder="Etkinlik, mekan veya sanatçı ara..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            padding: "10px 10px 10px 40px",
            borderRadius: "999px",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-dark)",
            color: "var(--text-main)",
            outline: "none",
            fontSize: "15px",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.borderColor = "var(--primary)"}
          onMouseLeave={(e) => {
             if (document.activeElement !== e.target) {
               e.target.style.borderColor = "var(--border-color)";
             }
          }}
        />

        {/* SEARCH DROPDOWN */}
        {isDropdownOpen && searchQuery.trim().length > 0 && (
          <div style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            boxShadow: "var(--shadow-lg)",
            overflow: "hidden",
            zIndex: 100
          }}>
            {searchResults.length > 0 ? (
              <div>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onMouseDown={() => handleResultClick(result.id)}
                    style={{
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      cursor: "pointer",
                      borderBottom: "1px solid var(--border-color)",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-card-hover)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <img src={result.image} alt={result.name} style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" }} />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={{ fontWeight: 600, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {result.name}
                      </div>
                      <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
                        <span>{result.artist}</span> • <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={10} /> {result.venue}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div 
                  onClick={() => setIsDropdownOpen(false)}
                  style={{ padding: "12px", textAlign: "center", fontSize: "13px", color: "var(--primary)", cursor: "pointer", fontWeight: 500 }}
                  onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                  onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                >
                  Tüm sonuçları gör ({searchResults.length})
                </div>
              </div>
            ) : (
              <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>
                Sonuç bulunamadı
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        
        {/* Admin İkonu (Sadece rolü admin olanlar görür) */}
        {user?.role === "admin" && (
          <Link to="/admin" title="Yönetici Paneli" style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--primary)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}>
            <Settings size={20} />
          </Link>
        )}

        {/* Organizatör İkonu (Sadece rolü organizer olanlar görür) */}
        {user?.role === "organizer" && (
          <Link to="/organizer" title="Organizatör Paneli" style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--primary)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}>
            <Briefcase size={20} />
          </Link>
        )}
        
        {user ? (
          <button
            onClick={() => navigate("/profile")}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: hover ? "var(--bg-card-hover)" : "transparent",
              border: "1px solid var(--primary)",
              color: "var(--primary)",
              padding: "8px 16px",
              borderRadius: "999px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              textTransform: "capitalize"
            }}
          >
            <User size={18} />
            {user.name.split(" ")[0]}
          </button>
        ) : (
          <button
            onClick={() => setIsLoginOpen(true)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: hover ? "var(--bg-card-hover)" : "transparent",
              border: "1px solid var(--border-color)",
              color: "var(--text-main)",
              padding: "8px 16px",
              borderRadius: "999px",
              fontSize: "15px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <User size={18} />
            Giriş Yap
          </button>
        )}
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </nav>
  );
}

export default Navbar;
