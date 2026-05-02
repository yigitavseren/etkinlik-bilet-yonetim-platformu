import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MapPin, Calendar, CreditCard } from "lucide-react";

function EventCard({ event }) {
  const navigate = useNavigate();
  const [hoverCard, setHoverCard] = useState(false);

  return (
    <div 
      onMouseEnter={() => setHoverCard(true)}
      onMouseLeave={() => setHoverCard(false)}
      onClick={() => navigate(`/bilet/${event.id}`)}
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        backgroundColor: "var(--bg-card)",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hoverCard ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hoverCard ? "var(--shadow-lg)" : "var(--shadow-sm)"
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={event.image}
          alt={event.name}
          style={{
            width: "100%",
            height: "180px",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            transform: hoverCard ? "scale(1.05)" : "scale(1)"
          }}
        />
        <div style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          color: "white",
          padding: "6px 12px",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: 500,
          textTransform: "capitalize"
        }}>
          {event.category}
        </div>
      </div>

      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
        
        <h3 style={{
            margin: "0",
            color: hoverCard ? "var(--primary)" : "var(--text-main)",
            transition: "color 0.2s",
            fontSize: "18px",
            fontWeight: 600,
            lineHeight: "1.4"
          }}
        >
          {event.name}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "14px" }}>
            <MapPin size={16} />
            <span>{event.venue}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "14px" }}>
            <Calendar size={16} />
            <span>{event.date}</span>
          </div>
        </div>

        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          marginTop: "12px",
          paddingTop: "16px",
          borderTop: "1px solid var(--border-color)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-main)", fontWeight: "bold" }}>
            <CreditCard size={18} color="var(--primary)" />
            {event.price} ₺
          </div>
          <span style={{ 
            fontSize: "14px", 
            fontWeight: 500, 
            color: hoverCard ? "var(--primary)" : "var(--text-muted)",
            transition: "color 0.2s"
          }}>
            Bilet Al →
          </span>
        </div>

      </div>
    </div>
  );
}

export default EventCard;